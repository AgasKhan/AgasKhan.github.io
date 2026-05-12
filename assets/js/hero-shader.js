// Site background shader runner.
// - Inserts a fixed full-viewport WebGL canvas behind the whole page.
// - Two-pass pipeline with ping-pong FBOs so user shaders can sample the
//   previous frame via uniform sampler2D u_history (used for trail effects).
//   Pass 1 renders the user shader into one of two textures; pass 2 blits
//   that texture to the screen. Buffers swap each frame.
// - Loads the fragment shader from localStorage if present, otherwise fetches
//   the default from /assets/shaders/voronoi.glsl and persists it under "hero_shader".
// - Exposes window.HeroShader with setFragment / reset / getCurrent so external
//   pages (e.g. the playground editor) can hot-swap the shader at runtime.

(function ()
{
    'use strict';

    var STORAGE_KEY = 'hero_shader';
    var DEFAULT_URL = '/assets/shaders/voronoi.glsl';

    var VS = [
        'attribute vec2 a_position;',
        'void main()',
        '{',
        '    gl_Position = vec4(a_position, 0.0, 1.0);',
        '}'
    ].join('\n');

    // Blit shader — copies the FBO texture to the default framebuffer.
    var BLIT_FS = [
        'precision mediump float;',
        'uniform sampler2D u_tex;',
        'uniform vec2 u_resolution;',
        'void main()',
        '{',
        '    vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
        '    gl_FragColor = vec4(texture2D(u_tex, uv).rgb, 1.0);',
        '}'
    ].join('\n');

    // Mutable runtime state — installProgram() rebinds the per-program
    // attribute/uniform locations when the user swaps the fragment shader.
    var state = {
        gl:        null,
        canvas:    null,

        // User program (Voronoi or whatever the user pasted in the playground).
        program:   null,
        userPosLoc: -1,
        uRes:      null,
        uTime:     null,
        uMouse:    null,
        uHistory:  null,

        // Pointer position in physical pixels with bottom-left origin, matching
        // gl_FragCoord. Off-screen until the first mousemove/touchmove so nothing
        // is highlighted on initial load (or on touch devices without movement).
        mouseX:    -10000.0,
        mouseY:    -10000.0,

        // Blit pipeline.
        blitProgram: null,
        blitPosLoc:  -1,
        blitURes:    null,
        blitUTex:    null,

        // Ping-pong FBOs. textures[writeIdx] is rendered this frame; the other
        // is sampled as u_history.
        textures: [null, null],
        fbos:     [null, null],
        fboWidth:  0,
        fboHeight: 0,
        writeIdx:  0,

        // Shared full-screen quad buffer.
        quadBuf:   null,

        ready:     false
    };

    function compile(gl, type, src)
    {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        {
            var info = gl.getShaderInfoLog(s);
            gl.deleteShader(s);
            throw new Error(info);
        }
        return s;
    }

    function link(gl, vs, fs)
    {
        var p = gl.createProgram();
        gl.attachShader(p, vs);
        gl.attachShader(p, fs);
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        {
            var info = gl.getProgramInfoLog(p);
            gl.deleteProgram(p);
            throw new Error(info);
        }
        return p;
    }

    function buildProgram(gl, fragSrc)
    {
        var vs = compile(gl, gl.VERTEX_SHADER, VS);
        var fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
        var p  = link(gl, vs, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return p;
    }

    function installProgram(program)
    {
        var gl = state.gl;
        if (state.program)
            gl.deleteProgram(state.program);

        state.program    = program;
        state.userPosLoc = gl.getAttribLocation(program, 'a_position');
        state.uRes       = gl.getUniformLocation(program, 'u_resolution');
        state.uTime      = gl.getUniformLocation(program, 'u_time');
        state.uMouse     = gl.getUniformLocation(program, 'u_mouse');
        state.uHistory   = gl.getUniformLocation(program, 'u_history');
    }

    function installBlitProgram()
    {
        var gl = state.gl;
        var vs = compile(gl, gl.VERTEX_SHADER, VS);
        var fs = compile(gl, gl.FRAGMENT_SHADER, BLIT_FS);
        state.blitProgram = link(gl, vs, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        state.blitPosLoc = gl.getAttribLocation(state.blitProgram, 'a_position');
        state.blitURes   = gl.getUniformLocation(state.blitProgram, 'u_resolution');
        state.blitUTex   = gl.getUniformLocation(state.blitProgram, 'u_tex');
    }

    function createTexture(w, h)
    {
        var gl = state.gl;
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        // NPOT-safe filtering / wrap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return tex;
    }

    function createFbo(tex)
    {
        var gl = state.gl;
        var fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        // Clear the freshly-attached texture so history starts at (0, 0, 0, 0).
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return fb;
    }

    function ensureFbos(w, h)
    {
        if (state.fboWidth === w && state.fboHeight === h && state.textures[0] && state.textures[1])
            return;

        var gl = state.gl;
        // Tear down old resources.
        for (var i = 0; i < 2; i++)
        {
            if (state.textures[i])
                gl.deleteTexture(state.textures[i]);
            if (state.fbos[i])
                gl.deleteFramebuffer(state.fbos[i]);
        }
        for (var j = 0; j < 2; j++)
        {
            state.textures[j] = createTexture(w, h);
            state.fbos[j]     = createFbo(state.textures[j]);
        }
        state.fboWidth  = w;
        state.fboHeight = h;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    function fetchDefault()
    {
        return fetch(DEFAULT_URL, { cache: 'no-cache' }).then(function (r)
        {
            if (!r.ok)
                throw new Error('Default shader fetch failed: ' + r.status);
            return r.text();
        });
    }

    function loadInitialSource()
    {
        var stored = null;
        try
        {
            stored = window.localStorage.getItem(STORAGE_KEY);
        }
        catch (e)
        {
            // localStorage unavailable (privacy mode, etc.)
        }
        if (stored)
            return Promise.resolve(stored);

        return fetchDefault().then(function (src)
        {
            try
            {
                window.localStorage.setItem(STORAGE_KEY, src);
            }
            catch (e)
            {
                // quota exceeded — fine, we still return the source
            }
            return src;
        });
    }

    function setupCanvas()
    {
        var canvas = document.createElement('canvas');
        canvas.className = 'site-bg-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(canvas, document.body.firstChild);
        return canvas;
    }

    function setupGeometry()
    {
        var gl = state.gl;
        state.quadBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, state.quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,  1, -1, -1,  1,
            -1,  1,  1, -1,  1,  1
        ]), gl.STATIC_DRAW);
    }

    function bindQuadAttribute(loc)
    {
        var gl = state.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, state.quadBuf);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    function resize()
    {
        var canvas = state.canvas;
        var gl     = state.gl;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = canvas.clientWidth  || canvas.offsetWidth  || 1;
        var h = canvas.clientHeight || canvas.offsetHeight || 1;
        var pw = Math.max(1, Math.floor(w * dpr));
        var ph = Math.max(1, Math.floor(h * dpr));
        if (canvas.width !== pw || canvas.height !== ph)
        {
            canvas.width  = pw;
            canvas.height = ph;
            gl.viewport(0, 0, pw, ph);
        }
    }

    function updatePointerFromClient(clientX, clientY)
    {
        // Convert from CSS pixels (top-left origin) to physical pixels
        // matching gl_FragCoord (bottom-left origin).
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        state.mouseX = clientX * dpr;
        state.mouseY = state.canvas.height - clientY * dpr;
    }

    function setupPointerTracking()
    {
        window.addEventListener('mousemove', function (e)
        {
            updatePointerFromClient(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', function (e)
        {
            if (e.touches.length === 0)
                return;
            var t = e.touches[0];
            updatePointerFromClient(t.clientX, t.clientY);
        }, { passive: true });

        // Park the pointer off-screen when it leaves the viewport so the
        // highlighted cell disappears instead of getting stuck at the edge.
        document.addEventListener('mouseleave', function ()
        {
            state.mouseX = -10000.0;
            state.mouseY = -10000.0;
        });
    }

    function renderFrame(timeSeconds)
    {
        var gl = state.gl;
        var canvas = state.canvas;
        ensureFbos(canvas.width, canvas.height);

        var writeIdx = state.writeIdx;
        var readIdx  = 1 - writeIdx;

        // ---------- Pass 1: user shader → textures[writeIdx] ----------
        gl.bindFramebuffer(gl.FRAMEBUFFER, state.fbos[writeIdx]);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(state.program);
        bindQuadAttribute(state.userPosLoc);

        if (state.uRes)
            gl.uniform2f(state.uRes, canvas.width, canvas.height);
        if (state.uTime)
            gl.uniform1f(state.uTime, timeSeconds);
        if (state.uMouse)
            gl.uniform2f(state.uMouse, state.mouseX, state.mouseY);
        if (state.uHistory)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, state.textures[readIdx]);
            gl.uniform1i(state.uHistory, 0);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // ---------- Pass 2: blit textures[writeIdx] → screen ----------
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(state.blitProgram);
        bindQuadAttribute(state.blitPosLoc);

        if (state.blitURes)
            gl.uniform2f(state.blitURes, canvas.width, canvas.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, state.textures[writeIdx]);
        if (state.blitUTex)
            gl.uniform1i(state.blitUTex, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        state.writeIdx = readIdx;
    }

    function setupRenderLoop()
    {
        resize();
        window.addEventListener('resize', resize);
        setupPointerTracking();

        var t0 = performance.now();
        var running = true;
        var rafId   = 0;

        function loop()
        {
            if (!running)
                return;

            resize();
            renderFrame((performance.now() - t0) * 0.001);
            rafId = requestAnimationFrame(loop);
        }

        document.addEventListener('visibilitychange', function ()
        {
            if (document.hidden)
            {
                running = false;
                cancelAnimationFrame(rafId);
            }
            else if (!running)
            {
                running = true;
                loop();
            }
        });

        loop();
    }

    function announceReady()
    {
        state.ready = true;
        window.dispatchEvent(new CustomEvent('hero-shader:ready'));
    }

    function start()
    {
        if (!document.body)
            return;

        state.canvas = setupCanvas();
        state.gl = state.canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
        if (!state.gl)
        {
            state.canvas.remove();
            return;
        }

        setupGeometry();
        installBlitProgram();

        loadInitialSource().then(function (src)
        {
            try
            {
                installProgram(buildProgram(state.gl, src));
            }
            catch (err)
            {
                // The stored shader is broken — recover with the default.
                console.warn('hero-shader: stored shader failed, falling back to default.\n', err.message);
                return fetchDefault().then(function (def)
                {
                    installProgram(buildProgram(state.gl, def));
                });
            }
        }).then(function ()
        {
            setupRenderLoop();
            announceReady();
        }).catch(function (err)
        {
            console.warn('hero-shader: setup failed, removing canvas.\n', err);
            if (state.canvas)
                state.canvas.remove();
        });
    }

    // ------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------
    window.HeroShader = {
        get ready()
        {
            return state.ready;
        },

        setFragment: function (src)
        {
            return new Promise(function (resolve)
            {
                if (!state.gl)
                {
                    resolve({ ok: false, error: 'WebGL context not ready' });
                    return;
                }
                try
                {
                    installProgram(buildProgram(state.gl, src));
                    try
                    {
                        window.localStorage.setItem(STORAGE_KEY, src);
                    }
                    catch (e)
                    {
                        // quota or storage disabled — shader is applied in memory anyway
                    }
                    resolve({ ok: true });
                }
                catch (err)
                {
                    resolve({ ok: false, error: String(err.message || err) });
                }
            });
        },

        reset: function ()
        {
            try
            {
                window.localStorage.removeItem(STORAGE_KEY);
            }
            catch (e)
            {
                // ignore
            }
            return fetchDefault().then(function (src)
            {
                return window.HeroShader.setFragment(src).then(function (r)
                {
                    return { ok: r.ok, source: src, error: r.error };
                });
            });
        },

        getCurrent: function ()
        {
            var stored = null;
            try
            {
                stored = window.localStorage.getItem(STORAGE_KEY);
            }
            catch (e)
            {
                // ignore
            }
            if (stored)
                return Promise.resolve(stored);
            return fetchDefault();
        }
    };

    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', start);
    else
        start();
})();
