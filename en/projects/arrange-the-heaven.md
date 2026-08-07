---
title: "Arrange the Heaven"
description: "Procedural RPG in Unity (degree final project). Case study: thousands of on-screen objects without framerate drops, via parallel compute (Jobs) + GPU instancing."
permalink: /en/projects/arrange-the-heaven/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Arrange the Heaven <span class="tag done">done</span></h1>
  <p class="lead">A procedural RPG in Unity, the degree's final project (Da Vinci), built as a team. It combines procedural generation, modular AI (FSM / Steering / GOAP) and custom URP rendering as a showcase of reusable in-house architectures.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">URP</span>
    <span class="tag">Jobs System</span><span class="tag">GOAP / FSM / Steering</span>
  </div>
</section>

## Context

The degree's final project, built as a team (Lucas's role: programmer and designer). The game brings together procedural generation, modular AI and custom rendering, but its technical value is less in the game itself and more in the **reusable architectures** developed in parallel over the course of the degree, with the game as their test bed. Many of those pieces now live, consolidated, in <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a>. The concept didn't start with the thesis either: it has a mobile predecessor, <a href="{{ '/en/projects/conquerhex/' | relative_url }}">Conquerhex</a>, iterated earlier in the degree.

## Case study: thousands of on-screen objects without framerate drops

The challenge: showing and driving **thousands of objects** on screen at once, every frame, without the framerate collapsing. Doing it the naive way — iterating over everything on the main thread — stalls the game as soon as the count grows.

The solution splits the work by what each part allows:

- **Parallel compute (Jobs System):** deciding each object's state is pure data computation that never touches the Unity API, so it's spread across every CPU core.
- **Batched rendering with GPU instancing:** objects sharing mesh and material are drawn in a batch, cutting the rendering load.
- **Only the unavoidable on the main thread:** Unity's `Transform`/`GameObject` API is **not thread-safe**, so the engine-bound operation (turning each object on/off with `SetActive`) stays on the main thread — and nothing else.

Concretely, this sustains turning **4,096 GameObjects** on and off per frame: the heavy computation runs in parallel, rendering leans on GPU instancing, and the main thread does only what it's forced to, instead of resolving everything sequentially.

## What it shows

- **Performance engineering at scale** in massive scenes.
- Deliberate handling of Unity's **thread-safety constraints**: what can be parallelized and what cannot.
- Design of **reusable modular architectures** (FSM / Steering / GOAP, custom rendering) meant to outlive a single project.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/projects/common-package/' | relative_url }}">See Common-Package →</a>
  <span>team project · private repo</span>
</div>
