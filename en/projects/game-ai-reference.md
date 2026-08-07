---
title: "Game AI — reference implementations"
description: "Freelance Game AI work: a reusable generic FSM, any-angle pathfinding (Theta*) and steering behaviours, with clean reference implementations."
permalink: /en/projects/game-ai-reference/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Game AI — reference implementations <span class="tag active">active</span></h1>
  <p class="lead">Freelance <strong>Game AI work in Unity</strong>: I designed a progression (fundamentals → steering → state machines → pathfinding → integrator project) and built the reference implementations — clean, performance-aware code as a study base.</p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3 LTS</span><span class="tag">C#</span><span class="tag">Generic FSM</span>
    <span class="tag">Theta* (any-angle)</span><span class="tag">Steering</span><span class="tag">Coroutines</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>Work for a private client. This write-up describes the technical capability and the implementations, without exposing client data. The blocks described are reusable Game AI, aligned with my own library (see <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a>).</p>
</div>

## The building blocks

- **A reusable generic FSM.** Parameterized by the state enum and the avatar type, it decouples each state's logic from the agent. The same machine serves a controllable character and autonomous NPCs.
- **Any-angle pathfinding (Theta*).** Over a procedurally generated grid with obstacle detection. It runs asynchronously via coroutines so it doesn't block the frame, with a fallback to the nearest walkable node when the destination is unreachable.
- **Performance-aware autonomous agents.** Vision-cone perception, chasing, attack with cooldown, fleeing at low HP and obstacle avoidance. The enemy scan and the flee computation are **cached per interval** instead of recomputed every frame.
- **A steering-behaviours library.** Seek / Flee / Arrive / Pursuit / Evade over a movement abstraction with several backends (CharacterController / Rigidbody / Transform) and a reactive service-locator with observable values.

## What it shows

- **Classic Game AI done well**: FSM, any-angle pathfinding and steering, not as loose recipes but as reusable blocks.
- **Performance-aware design**: caching perception per interval, async pathfinding to keep the frame smooth.
- **Reference-quality code**: written so someone else can read it and learn from it.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/projects/common-package/' | relative_url }}">See Common-Package →</a>
  <span>freelance client · private repo</span>
</div>
