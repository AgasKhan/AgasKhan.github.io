// Live shader editor wired to window.HeroShader.
// - Two languages selectable via the toolbar: GLSL (native) and HLSL (translated).
// - In GLSL mode the textarea content is fed straight into HeroShader.setFragment().
// - In HLSL mode the textarea content goes through HLSLToGLSL.convert() first;
//   the resulting GLSL is shown read-only in a secondary panel so you can read
//   what the translator emitted (and any compile error line numbers match it).
// - Overlay technique for the primary editor (transparent textarea over a
//   syntax-highlighted <pre>), same as a Unity TMP_InputField + TMP_Text.

(function ()
{
    'use strict';

    var DEBOUNCE_MS = 400;

    // localStorage keys.
    var KEY_GLSL_CANVAS = 'hero_shader';                // applied to the canvas
    var KEY_GLSL_USER   = 'hero_shader_source_glsl';    // user-typed GLSL
    var KEY_HLSL_USER   = 'hero_shader_source_hlsl';    // user-typed HLSL
    var KEY_LANG        = 'hero_shader_lang';           // 'glsl' | 'hlsl'
    var KEY_HEIGHT      = 'hero_shader_editor_height';  // user-chosen editor px

    // Height bounds — same as the CSS clamps, kept in sync.
    var HEIGHT_MIN = 280;
    var HEIGHT_MAX = 1200;

    var DEFAULT_GLSL_URL = '/assets/shaders/voronoi.glsl';
    var DEFAULT_HLSL_URL = '/assets/shaders/default.hlsl';

    function readStorage(k)
    {
        try { return window.localStorage.getItem(k); } catch (e) { return null; }
    }
    function writeStorage(k, v)
    {
        try { window.localStorage.setItem(k, v); } catch (e) { /* quota */ }
    }
    function clearStorage(k)
    {
        try { window.localStorage.removeItem(k); } catch (e) { /* ignore */ }
    }

    function onHeroReady(cb)
    {
        if (window.HeroShader && window.HeroShader.ready)
        {
            cb();
            return;
        }
        window.addEventListener('hero-shader:ready', cb, { once: true });
    }

    function setStatus(el, kind, text)
    {
        el.className = 'playground-status playground-status-' + kind;
        el.textContent = text || '';
    }

    function showError(el, message)
    {
        el.textContent = message || '';
        el.hidden = !message;
    }

    function readLabel(el, attr, fallback)
    {
        return (el.getAttribute(attr) || fallback || '').trim();
    }

    function fetchText(url)
    {
        return fetch(url, { cache: 'no-cache' }).then(function (r)
        {
            if (!r.ok) throw new Error('Fetch failed: ' + url + ' (' + r.status + ')');
            return r.text();
        });
    }

    function init()
    {
        var root           = document.querySelector('.playground');
        var editor         = document.getElementById('pg-editor');
        var highlight      = document.getElementById('pg-highlight');
        var resetBtn       = document.getElementById('pg-reset');
        var fullscreenBtn  = document.getElementById('pg-fullscreen');
        var shaderOnlyBtn  = document.getElementById('pg-shader-only');
        var shaderOnlyExit = document.getElementById('pg-shader-only-exit');
        var tabGlslBtn     = document.getElementById('pg-tab-glsl');
        var tabHlslBtn     = document.getElementById('pg-tab-hlsl');
        var status         = document.getElementById('pg-status');
        var errorBox       = document.getElementById('pg-error');
        var secondary      = document.getElementById('pg-secondary');
        var secondaryBody  = document.getElementById('pg-secondary-body');
        if (!root || !editor || !highlight || !resetBtn || !status || !errorBox)
            return;

        var labelOk    = readLabel(editor, 'data-label-ok',    'applied');
        var labelError = readLabel(editor, 'data-label-error', 'error');
        var labelIdle  = readLabel(editor, 'data-label-idle',  '');

        // Current mode in this session.
        var mode = readStorage(KEY_LANG) === 'hlsl' ? 'hlsl' : 'glsl';

        function highlightFor(src, m)
        {
            if (m === 'hlsl' && window.HLSLHighlight)
                return window.HLSLHighlight.highlight(src);
            if (window.GLSLHighlight)
                return window.GLSLHighlight.highlight(src);
            return src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function renderPrimaryHighlight()
        {
            highlight.innerHTML = highlightFor(editor.value, mode) + '\n';
        }

        function renderSecondaryGlsl(glsl)
        {
            if (!secondaryBody)
                return;
            secondaryBody.innerHTML = (window.GLSLHighlight
                ? window.GLSLHighlight.highlight(glsl)
                : glsl.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '\n';
        }

        function syncScroll()
        {
            highlight.scrollTop  = editor.scrollTop;
            highlight.scrollLeft = editor.scrollLeft;
        }

        // Pipeline: take whatever is in the editor (GLSL or HLSL) and apply.
        function applyFromEditor()
        {
            var src = editor.value;
            if (mode === 'hlsl')
            {
                if (!window.HLSLToGLSL)
                {
                    setStatus(status, 'error', labelError);
                    showError(errorBox, 'HLSL conversor not loaded.');
                    return;
                }
                var result = window.HLSLToGLSL.convert(src);
                renderSecondaryGlsl(result.glsl);
                writeStorage(KEY_HLSL_USER, src);
                window.HeroShader.setFragment(result.glsl).then(function (r)
                {
                    if (r.ok)
                    {
                        setStatus(status, 'ok', labelOk);
                        showError(errorBox, '');
                    }
                    else
                    {
                        setStatus(status, 'error', labelError);
                        showError(errorBox, r.error);
                    }
                });
            }
            else
            {
                writeStorage(KEY_GLSL_USER, src);
                window.HeroShader.setFragment(src).then(function (r)
                {
                    if (r.ok)
                    {
                        setStatus(status, 'ok', labelOk);
                        showError(errorBox, '');
                    }
                    else
                    {
                        setStatus(status, 'error', labelError);
                        showError(errorBox, r.error);
                    }
                });
            }
        }

        // Editor height (shared across GLSL and HLSL modes).
        var editors = document.querySelector('.playground-editors');

        function getStoredHeight()
        {
            var v = parseInt(readStorage(KEY_HEIGHT), 10);
            if (!isFinite(v))
                return null;
            return Math.max(HEIGHT_MIN, Math.min(HEIGHT_MAX, v));
        }

        function applyStoredHeight()
        {
            var h = getStoredHeight();
            if (!h)
                return;

            if (mode === 'hlsl' && editors)
                editors.style.height = h + 'px';
            else if (editor)
                editor.style.height = h + 'px';
        }

        // Persist whatever height the user drags to. Both targets are watched:
        // the textarea in GLSL mode (resize handle is on it) and the editors
        // container in HLSL mode (handle is on the grid wrapper).
        var resizeWriteTimer = 0;
        function scheduleHeightWrite(px)
        {
            clearTimeout(resizeWriteTimer);
            resizeWriteTimer = setTimeout(function ()
            {
                var clamped = Math.max(HEIGHT_MIN, Math.min(HEIGHT_MAX, Math.round(px)));
                writeStorage(KEY_HEIGHT, String(clamped));
            }, 120);
        }

        if (window.ResizeObserver)
        {
            var ro = new ResizeObserver(function (entries)
            {
                for (var i = 0; i < entries.length; i++)
                {
                    var target = entries[i].target;
                    var h = target.getBoundingClientRect().height;
                    // Only the *active* mode's container is treated as authoritative,
                    // otherwise window-resize ticks on the inactive one would clobber the value.
                    if (mode === 'hlsl' && target === editors)
                        scheduleHeightWrite(h);
                    else if (mode === 'glsl' && target === editor)
                        scheduleHeightWrite(h);
                }
            });
            if (editor)  ro.observe(editor);
            if (editors) ro.observe(editors);
        }

        // Load the editor with the source for the active mode, then apply.
        function loadModeIntoEditor()
        {
            // Toggle tab visuals.
            if (tabGlslBtn)
                tabGlslBtn.setAttribute('aria-pressed', mode === 'glsl' ? 'true' : 'false');
            if (tabHlslBtn)
                tabHlslBtn.setAttribute('aria-pressed', mode === 'hlsl' ? 'true' : 'false');
            root.classList.toggle('is-hlsl', mode === 'hlsl');
            if (secondary)
                secondary.hidden = (mode !== 'hlsl');
            writeStorage(KEY_LANG, mode);

            // Apply persisted height to whichever element owns the resize handle now.
            applyStoredHeight();

            var p;
            if (mode === 'hlsl')
            {
                var saved = readStorage(KEY_HLSL_USER);
                p = saved ? Promise.resolve(saved) : fetchText(DEFAULT_HLSL_URL);
            }
            else
            {
                var savedGlsl = readStorage(KEY_GLSL_USER);
                if (savedGlsl)
                    p = Promise.resolve(savedGlsl);
                else
                    p = window.HeroShader.getCurrent();
            }

            p.then(function (src)
            {
                editor.value = src;
                renderPrimaryHighlight();
                syncScroll();
                applyFromEditor();
            });
        }

        // Initial load.
        setStatus(status, 'idle', labelIdle);
        loadModeIntoEditor();

        // -------- Event wiring --------

        var debounceId = 0;
        editor.addEventListener('input', function ()
        {
            renderPrimaryHighlight();
            syncScroll();
            clearTimeout(debounceId);
            debounceId = setTimeout(applyFromEditor, DEBOUNCE_MS);
        });

        editor.addEventListener('scroll', syncScroll);
        editor.addEventListener('keyup', syncScroll);
        editor.addEventListener('click', syncScroll);

        // Tab inserts 4 spaces.
        editor.addEventListener('keydown', function (e)
        {
            if (e.key !== 'Tab')
                return;

            e.preventDefault();
            var start = editor.selectionStart;
            var end   = editor.selectionEnd;
            var value = editor.value;
            editor.value = value.substring(0, start) + '    ' + value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Reset: clear the current mode's stored source and reload its default.
        resetBtn.addEventListener('click', function ()
        {
            if (mode === 'hlsl')
            {
                clearStorage(KEY_HLSL_USER);
                fetchText(DEFAULT_HLSL_URL).then(function (src)
                {
                    editor.value = src;
                    renderPrimaryHighlight();
                    syncScroll();
                    applyFromEditor();
                });
            }
            else
            {
                clearStorage(KEY_GLSL_USER);
                clearStorage(KEY_GLSL_CANVAS);
                fetchText(DEFAULT_GLSL_URL).then(function (src)
                {
                    editor.value = src;
                    renderPrimaryHighlight();
                    syncScroll();
                    applyFromEditor();
                });
            }
        });

        // Tabs.
        if (tabGlslBtn)
        {
            tabGlslBtn.addEventListener('click', function ()
            {
                if (mode === 'glsl')
                    return;
                mode = 'glsl';
                loadModeIntoEditor();
            });
        }
        if (tabHlslBtn)
        {
            tabHlslBtn.addEventListener('click', function ()
            {
                if (mode === 'hlsl')
                    return;
                mode = 'hlsl';
                loadModeIntoEditor();
            });
        }

        // Fullscreen toggle.
        function setFullscreen(on)
        {
            root.classList.toggle('playground-fullscreen', on);
            document.body.classList.toggle('playground-fullscreen-on', on);
            if (fullscreenBtn)
            {
                var labelExpand = readLabel(fullscreenBtn, 'data-label-expand', '⛶ Expand');
                var labelClose  = readLabel(fullscreenBtn, 'data-label-close',  '✕ Close');
                fullscreenBtn.textContent = on ? labelClose : labelExpand;
                fullscreenBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
            }
            syncScroll();
        }
        if (fullscreenBtn)
        {
            fullscreenBtn.addEventListener('click', function ()
            {
                setFullscreen(!root.classList.contains('playground-fullscreen'));
            });
        }
        // "Shader only" mode: hide everything chrome-related (editor, header,
        // footer, container card) so the bg canvas takes the full viewport.
        // The two toggles are mutually exclusive — activating one kills the other.
        function setShaderOnly(on)
        {
            if (on)
                setFullscreen(false);
            document.body.classList.toggle('shader-only-on', on);
        }
        if (shaderOnlyBtn)
        {
            shaderOnlyBtn.addEventListener('click', function ()
            {
                setShaderOnly(!document.body.classList.contains('shader-only-on'));
            });
        }
        if (shaderOnlyExit)
        {
            shaderOnlyExit.addEventListener('click', function ()
            {
                setShaderOnly(false);
            });
        }

        document.addEventListener('keydown', function (e)
        {
            if (e.key !== 'Escape')
                return;

            if (root.classList.contains('playground-fullscreen'))
                setFullscreen(false);
            else if (document.body.classList.contains('shader-only-on'))
                setShaderOnly(false);
        });
    }

    onHeroReady(init);
})();
