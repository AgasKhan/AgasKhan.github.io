// Hero background shader runner.
// - Finds the first .hero on the page and inserts a WebGL canvas behind its content.
// - Loads the fragment shader from localStorage if present, otherwise fetches the
//   default from /assets/shaders/voronoi.glsl and persists it under "hero_shader".
// - If a custom (localStorage) shader fails to compile, falls back to the default.

(function () {
  'use strict';

  var STORAGE_KEY = 'hero_shader';
  var DEFAULT_URL = '/assets/shaders/voronoi.glsl';

  var VS = [
    'attribute vec2 a_position;',
    'void main() {',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var info = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('Shader compile failed: ' + info);
    }
    return s;
  }

  function link(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error('Program link failed: ' + gl.getProgramInfoLog(p));
    }
    return p;
  }

  function fetchDefault() {
    return fetch(DEFAULT_URL, { cache: 'force-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Default shader fetch failed: ' + r.status);
      return r.text();
    });
  }

  function loadShaderSource() {
    var stored = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch (e) { /* no localStorage */ }
    if (stored) return Promise.resolve(stored);
    return fetchDefault().then(function (src) {
      try { window.localStorage.setItem(STORAGE_KEY, src); } catch (e) { /* quota / privacy mode */ }
      return src;
    });
  }

  function buildProgram(gl, fragSrc) {
    var vs = compile(gl, gl.VERTEX_SHADER, VS);
    var fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    return link(gl, vs, fs);
  }

  function setupCanvas(hero) {
    var canvas = document.createElement('canvas');
    canvas.className = 'hero-bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);
    return canvas;
  }

  function start() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var canvas = setupCanvas(hero);
    var gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) { canvas.remove(); return; }

    loadShaderSource().then(function (src) {
      var program;
      try {
        program = buildProgram(gl, src);
      } catch (err) {
        // Custom shader from localStorage is broken — recover with the default.
        console.warn('hero-shader: user shader failed, falling back to default.\n', err.message);
        return fetchDefault().then(function (def) {
          return buildProgram(gl, def);
        });
      }
      return program;
    }).then(function (program) {
      if (!program) return;
      run(gl, canvas, program);
    }).catch(function (err) {
      console.warn('hero-shader: setup failed, removing canvas.\n', err);
      canvas.remove();
    });
  }

  function run(gl, canvas, program) {
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]), gl.STATIC_DRAW);

    gl.useProgram(program);
    var aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uRes  = gl.getUniformLocation(program, 'u_resolution');
    var uTime = gl.getUniformLocation(program, 'u_time');

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth  || canvas.offsetWidth  || 1;
      var h = canvas.clientHeight || canvas.offsetHeight || 1;
      var pw = Math.max(1, Math.floor(w * dpr));
      var ph = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width  = pw;
        canvas.height = ph;
        gl.viewport(0, 0, pw, ph);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    var t0 = performance.now();
    var running = true;
    var rafId   = 0;

    function loop() {
      if (!running) return;
      resize();
      var t = (performance.now() - t0) * 0.001;
      if (uRes)  gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(loop);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        loop();
      }
    });

    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
