---
title: La Maldición
description: "Competitive card game in development; the playable WebGL build publishes on 2026-08-17. One of the main consumers of the AgasKhan packages."
permalink: /en/projects/la-maldicion/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>La Maldición: Héroes de Lorthar <span class="tag active">in development</span></h1>
  <p class="lead">A competitive turn-based card game in active development. One of the main consumers of the AgasKhan packages library.</p>
  <p><strong>▶ Playable WebGL build — publishing on 2026-08-17.</strong></p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3</span><span class="tag">C#</span><span class="tag">WebGL</span><span class="tag">Card game</span>
  </div>
</section>

## Status

In active development. It's the official digital adaptation of an Argentine card game (physical game sold in 40+ stores, "Best friendship-breaker game" award 2022): up to 4 players, 8 heroes with asymmetric abilities, 1v1 / free-for-all / 2v2 modes. The playable WebGL build publishes on 2026-08-17.

## Relationship with the packages

La Maldición is **one of the most intensive consumers** of <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a> — being the most recent build, it exercises the latest package versions: it validates the library against a real game and consumes only the ones it needs, referenced by Git URL + tag in `Packages/manifest.json` as they stabilize. The library backs **several projects** — not only this one; here the feedback loop between the library and a playable product in production is especially clear.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>playable build: publishing 2026-08-17</span>
  <span>team project · private repo</span>
</div>
