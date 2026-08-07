---
title: "NPC AI: event-driven FSM + GOAP"
description: "AI final project (Da Vinci): my own event-driven FSM framework that evolves into agents with GOAP planning and multithreaded A* pathfinding."
permalink: /en/projects/event-fsm-goap-planning/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>NPC AI: event-driven FSM + GOAP <span class="tag academic">academic</span></h1>
  <p class="lead">The final project for the degree's AI course. My own <strong>event-driven state machine</strong> framework (a generic EventFSM) applied to NPC behaviour, which then evolves into agents that combine FSM, <strong>GOAP</strong> planning and <strong>multithreaded A*</strong> pathfinding.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">FSM</span>
    <span class="tag">GOAP</span><span class="tag">multithreaded A*</span><span class="tag">Unity.Collections / Mathematics</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Academic project</p>
  <p>Degree coursework (Da Vinci), not a commercial product. I include it because it shows a grasp of game-AI architectures, from the reactive (FSM) to the deliberative (planning).</p>
</div>

## EventFSM: the reusable base

The base deliverable is a **generic, event-driven FSM** (`EventFSM<T>`), designed to be reused across projects:

- **States with a full lifecycle:** `Enter` / `Update` / `LateUpdate` / `FixedUpdate` / `Exit`.
- **Input-driven transitions:** a state reacts to events, not to a giant `switch`.
- **A fluent transition configurer** (`StateConfigurer`): defining which event moves you from one state to another reads like a sentence, not boilerplate.

## From reactive to deliberative: GOAP + multithreaded A*

Later in the degree, that same FSM integrates with a **GOAP planner** and an **A\*** pathfinding grid: the agent stops merely reacting and starts **planning** how to reach a goal. Path computation is solved in a **background thread** with `Unity.Collections` / `Unity.Mathematics` so it doesn't stall the main thread.

It's the jump from a simple FSM to planning agents, on the same architectural base.

## What it shows

- **Game-AI architectures**: event-driven FSM, GOAP and A*, not as loose recipes but as layers that integrate.
- **Reusable design**: the generic FSM is the common base for everything else.
- **Multithreading** applied to pathfinding to keep the frame smooth.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>degree project (Da Vinci) · private repo</span>
</div>
