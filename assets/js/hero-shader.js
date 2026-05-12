// Site background shader runner.
// - Inserts a fixed full-viewport WebGL canvas behind the whole page.
// - Loads the fragment shader from localStorage if present, otherwise fetches the
//   default from /assets/shaders/voronoi.glsl and persists it under "hero_shader".
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

    // Mutable runtime state — installProgram() rebinds these when the user
    // swaps the fragment shader at runtime.
    var state = {
        gl:      null,
        canvas:  null,
        program: null,
        aPosLoc: -1,
        uRes:    null,
        uTime:   null,
        ready:   false
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

        state.program = program;
        gl.useProgram(program);

        state.aPosLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(state.aPosLoc);
        gl.vertexAttribPointer(state.aPosLoc, 2, gl.FLOAT, false, 0, 0);

        state.uRes  = gl.getUniformLocation(program, 'u_resolution');
        state.uTime = gl.getUniformLocation(program, 'u_time');
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
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,  1, -1, -1,  1,
            -1,  1,  1, -1,  1,  1
        ]), gl.STATIC_DRAW);
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

    function setupRenderLoop()
    {
        resize();
        window.addEventListener('resize', resize);

        var t0 = performance.now();
        var running = true;
        var rafId   = 0;

        function loop()
        {
            if (!running)
                return;

            resize();
            var gl = state.gl;
            var t = (performance.now() - t0) * 0.001;
            if (state.uRes)
                gl.uniform2f(state.uRes, state.canvas.width, state.canvas.height);
            if (state.uTime)
                gl.uniform1f(state.uTime, t);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
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
