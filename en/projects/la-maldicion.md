---
title: La Maldición
description: "Competitive card game in development, with a public playable build on itch.io. Main consumer of the AgasKhan packages."
permalink: /en/projects/la-maldicion/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>La Maldición: Héroes de Lorthar <span class="tag active">in development</span></h1>
  <p class="lead">A competitive turn-based card game in active development. Main consumer of the AgasKhan packages library.</p>
  <p><a href="https://riassogna.itch.io/la-maldicin-hroes-de-lorthar" target="_blank" rel="noopener"><strong>▶ Play on itch.io (WebGL build, free) ↗</strong></a></p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3</span><span class="tag">C#</span><span class="tag">WebGL</span><span class="tag">Card game</span>
  </div>
</section>

## Status

In active development. It's the official digital adaptation of an Argentine card game (physical game sold in 40+ stores, "Best friendship-breaker game" award 2022): up to 4 players, 8 heroes with asymmetric abilities, 1v1 / free-for-all / 2v2 modes. There is a public, playable WebGL build on itch.io.

## Relationship with the packages

La Maldición is the **main consumer** of <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a>: it validates the packages against a real game and consumes only the ones it needs, referenced by Git URL + tag in `Packages/manifest.json` as they stabilize. It's the feedback loop between the library and a product in production.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://riassogna.itch.io/la-maldicin-hroes-de-lorthar" target="_blank" rel="noopener">itch.io ↗</a>
  <span>team project · private repo</span>
</div>
