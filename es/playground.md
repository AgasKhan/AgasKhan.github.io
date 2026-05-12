---
title: Playground
description: Editor de fragment shader del fondo. Preview en tiempo real.
permalink: /es/playground/
---

{% assign t = site.data.i18n[page.lang] %}

<section class="hero">
    <h1><span class="accent">{{ t.playground.heading }}</span></h1>
    <p class="lead">{{ t.playground.lead }}</p>
</section>

<div class="playground">
    <div class="playground-toolbar">
        <button id="pg-reset" type="button">{{ t.playground.reset }}</button>
        <span id="pg-status" class="playground-status playground-status-idle"></span>
    </div>
    <div class="editor-wrap">
        <pre id="pg-highlight" class="editor-highlight" aria-hidden="true"></pre>
        <textarea id="pg-editor"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            data-label-ok="{{ t.playground.status_ok }}"
            data-label-error="{{ t.playground.status_error }}"
            data-label-idle="{{ t.playground.status_idle }}"></textarea>
    </div>
    <pre id="pg-error" class="playground-error" hidden></pre>
    <p class="playground-hint">{{ t.playground.hint }}</p>
</div>

<script src="{{ '/assets/js/glsl-highlight.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/playground.js' | relative_url }}" defer></script>
