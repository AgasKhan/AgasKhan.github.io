---
title: Playground
description: Background fragment shader editor. Real-time preview.
permalink: /en/playground/
---

{% assign t = site.data.i18n[page.lang] %}

<section class="hero">
    <h1><span class="accent">{{ t.playground.heading }}</span></h1>
    <p class="lead">{{ t.playground.lead }}</p>
</section>

<div class="playground">
    <div class="playground-toolbar">
        <div class="playground-tabs" role="tablist">
            <button id="pg-tab-glsl" type="button" class="playground-tab" role="tab">{{ t.playground.tab_glsl }}</button>
            <button id="pg-tab-hlsl" type="button" class="playground-tab" role="tab">{{ t.playground.tab_hlsl }}</button>
        </div>
        <button id="pg-reset" type="button">{{ t.playground.reset }}</button>
        <button id="pg-fullscreen" type="button"
            data-label-expand="{{ t.playground.expand }}"
            data-label-close="{{ t.playground.exit_fullscreen }}">{{ t.playground.expand }}</button>
        <button id="pg-shader-only" type="button">{{ t.playground.shader_only }}</button>
        <span id="pg-status" class="playground-status playground-status-idle"></span>
    </div>
    <div class="playground-editors">
        <div class="editor-wrap" id="pg-primary">
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
        <div class="editor-readonly" id="pg-secondary" hidden>
            <div class="editor-readonly-label">{{ t.playground.secondary_label }}</div>
            <pre id="pg-secondary-body" class="editor-readonly-body" aria-hidden="true"></pre>
        </div>
    </div>
    <pre id="pg-error" class="playground-error" hidden></pre>
    <p class="playground-hint">{{ t.playground.hint }}</p>
</div>

<button id="pg-shader-only-exit" type="button" class="shader-only-exit-btn">{{ t.playground.exit_shader_only }}</button>

<script src="{{ '/assets/js/glsl-highlight.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/hlsl-highlight.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/hlsl-to-glsl.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/playground.js' | relative_url }}" defer></script>
