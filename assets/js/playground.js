// Live shader editor wired to window.HeroShader.
// - Loads the current fragment shader into the textarea.
// - Compiles on input (debounced) and hot-swaps the running shader on success.
// - Displays the GL info log on compile failure without breaking the page.

(function ()
{
    'use strict';

    var DEBOUNCE_MS = 400;

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

    function init()
    {
        var editor   = document.getElementById('pg-editor');
        var resetBtn = document.getElementById('pg-reset');
        var status   = document.getElementById('pg-status');
        var errorBox = document.getElementById('pg-error');
        if (!editor || !resetBtn || !status || !errorBox)
            return;

        var labelOk    = readLabel(editor, 'data-label-ok',    'applied');
        var labelError = readLabel(editor, 'data-label-error', 'error');
        var labelIdle  = readLabel(editor, 'data-label-idle',  '');

        function apply(src)
        {
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

        // Seed the editor with whatever is currently driving the canvas.
        window.HeroShader.getCurrent().then(function (src)
        {
            editor.value = src;
            setStatus(status, 'idle', labelIdle);
        });

        var debounceId = 0;
        editor.addEventListener('input', function ()
        {
            clearTimeout(debounceId);
            debounceId = setTimeout(function ()
            {
                apply(editor.value);
            }, DEBOUNCE_MS);
        });

        // Tab key inserts 4 spaces instead of jumping focus — closer to a real editor.
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

        resetBtn.addEventListener('click', function ()
        {
            window.HeroShader.reset().then(function (r)
            {
                editor.value = r.source;
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
        });
    }

    onHeroReady(init);
})();
