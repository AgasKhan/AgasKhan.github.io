---
title: "Conquerhex — editor tooling"
description: "Hex-grid strategy game (Da Vinci, team project). Lucas's contribution: the editor tooling, including a visual node editor (UIElements GraphView) and reusable extensions."
permalink: /en/projects/conquerhex/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Conquerhex — mobile predecessor of the thesis <span class="tag academic">academic</span></h1>
  <p class="lead">A hex-based <strong>mobile</strong> game, developed as a degree project <strong>with a team</strong>. It's the <strong>predecessor of the <a href="{{ '/en/projects/arrange-the-heaven/' | relative_url }}">Arrange the Heaven</a> thesis</strong>: the same concept, iterated later into the final project. My contribution was the technical side: the <strong>editor tooling</strong>, including a visual node editor built with UIElements GraphView, plus a reusable architecture base.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Mobile</span>
    <span class="tag">UIElements</span><span class="tag">GraphView</span><span class="tag">URP</span><span class="tag">ScriptableObjects</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Academic · team project</p>
  <p>Degree coursework (Da Vinci) built as a team: there were collaborators handling art and content. My role was <strong>programmer</strong>, with the weight on architecture and editor tooling — not art or level design. Conquerhex is the <strong>earlier, mobile version</strong> of the concept that later became the <a href="{{ '/en/projects/arrange-the-heaven/' | relative_url }}">Arrange the Heaven</a> thesis: it shows the iteration on a single idea across the degree.</p>
</div>

## Visual node editor (UIElements GraphView)

The most visible technical piece is a **graph editor** to author logic graphically, built on UIElements GraphView: a custom window, a graph view, nodes and a search box. Instead of wiring logic by hand in the inspector, the team builds it by connecting nodes.

## Editor extensions and architecture

- **A battery of reusable editor extensions:** custom property drawers, per-type inspectors, hierarchy highlighting, asset post-processing and shaders, and a URP camera render feature — all meant to speed up the team's work.
- **Architecture base:** an abstract FSM with reusable containers and states, separating architecture from the game's concrete content.

> The project uses the third-party CrashKonijn (GOAP) package alongside the in-house code; the node editor and the editor extensions are my own development.

## What it shows

- **Command of the Unity editor**: UI Toolkit / GraphView, property drawers, windows and asset post-processing.
- **DevEx for a team**: tools that save the other members work.
- **Teamwork** with a clear, scoped technical role.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/projects/arrange-the-heaven/' | relative_url }}">See how it evolved: Arrange the Heaven →</a>
  <span>academic team project (Da Vinci) · private repo</span>
</div>
