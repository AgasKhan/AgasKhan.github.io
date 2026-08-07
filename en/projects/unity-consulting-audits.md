---
title: "Unity consulting & audits"
description: "Technical consultant across ~10 Unity projects owned by other developers: code audits, reusable cross-cutting systems and refactors. The contribution is mine; the games are third-party."
permalink: /en/projects/unity-consulting-audits/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Unity consulting &amp; audits <span class="tag active">active</span></h1>
  <p class="lead">Technical consultant across <strong>~10 Unity projects owned by other developers</strong>: I audit unfamiliar codebases, implement reusable cross-cutting systems, and do targeted fixes and refactors inside each team's code.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Photon Fusion 2</span>
    <span class="tag">ParrelSync</span><span class="tag">Addressables</span><span class="tag">Editor tooling</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>All the material is <strong>third-party code</strong> (other developers' games). I'm not the author of the games: I come in as a consultant/auditor and contribute systems, fixes and documentation inside each team's code. This write-up describes my contribution, not someone else's IP — no game names or authors are exposed.</p>
</div>

## What I contribute

- **Reusable cross-cutting systems**, applied across several projects: asynchronous, additive scene loading with fade and progress bar, local save, global audio management and multi-language localization.
- **Multiplayer with Photon Fusion 2** and a local test flow with ParrelSync (a project clone to test on the same machine), in card projects.
- **Architecture and patterns into unfamiliar codebases**: dependency injection, state machines, event/UI systems and reusable utilities; player/health refactors and concurrency & parallelism work.
- **Editor tooling and pipeline**: an audio playback editor, a bake-based reference system, Android build configuration and shaders.

## The deepest engagement: systems + audit of a shipping game

In the deepest engagement (a mobile game already shipping on Android, by another developer) I went from spot consultant to co-developing its service layer and producing its canonical technical audit:

- **A service layer over an unfamiliar codebase:** queued additive, asynchronous scene loading with a loading screen and fade, local save with skin support, a global audio player and dependency injection.
- **Structural production fixes:** cross-scene canvas sync and scaling, audio duplication, level loading from the game-over screen, particle visibility and Android build configuration.
- **A technical audit as the deliverable:** a layered architecture-and-patterns analysis, a full script reference, a content inventory, commit history and a prioritized fix plan — meant as onboarding and source of truth for the team. The documentation leaned, honestly, on my own analysis process/tooling.

## What it shows

- A **tech-lead / consultant** role over code I didn't write: reading someone else's architecture, improving it and leaving it documented.
- **Reusable systems** that solve the same problems (loading, saving, audio, i18n, multiplayer) across several different projects.
- The **technical audit** as a product in itself, not just the code.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>client / third-party projects · private repos</span>
</div>
