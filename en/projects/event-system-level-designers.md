---
title: "Event system for level designers"
description: "My own product: an event system that lets level designers trigger game logic without writing code. Sold and licensed to other developers."
permalink: /en/projects/event-system-level-designers/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Event system for level designers <span class="tag active">product</span></h1>
  <p class="lead">A Unity event system built so that <strong>level designers can define and trigger game logic without writing code</strong>. It's my own product, sold and licensed to other developers.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">ScriptableObjects</span>
    <span class="tag">Editor tooling</span><span class="tag">Reflection</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Commercial validation</p>
  <p>Not an experiment: it's a product <strong>sold and licensed</strong> to other developers, with <strong>recurring revenue</strong>. Other professionals pay for it and ship it in their own games — the most direct signal that the technology holds up outside my own code.</p>
</div>

## How it works

- **A ScriptableObject event bus.** Events are assets: a level designer wires and triggers them from the editor, without touching game code.
- **String commands (in-game console).** Events can be fired by name; argument parsing is resolved via reflection over the event's generic types (`int`, `float`, `bool`, `string`, `Vector2`, `Vector3`), which enables an in-game command console.
- **Lightweight internal DI.** It ships a simple dependency-injection mechanism to resolve the references each event needs.

## Context

It's one of the ~36 systems in the <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a> suite (UPM package `com.agaskhan.eventsystem`), promoted to a product on the strength of its commercial validation. It packages a well-known pattern (ScriptableObject events) and adds the command layer that turns it into a level-design tool.

## What it shows

- Designing **tooling for non-programmers** (DevEx / designer authoring).
- A product with **market validation**: other developers pay to use it.
- Reflection and ScriptableObjects applied to a real authoring problem.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/projects/common-package/' | relative_url }}">See Common-Package →</a>
  <span>part of Common-Package · private repo</span>
</div>
