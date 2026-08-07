---
title: "Reference demo games"
description: "Complete, self-authored demo games I build as reference implementations to teach architecture and patterns: action-adventure, turn-based multiplayer tactics and a 3D demo."
permalink: /en/projects/reference-demo-games/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Reference demo games <span class="tag active">active</span></h1>
  <p class="lead">Complete, <strong>self-authored</strong> demo games I build end to end as reference implementations to teach architecture and patterns in advanced Unity courses: a playable base and model code students start from.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Netcode for GameObjects</span>
    <span class="tag">Unity Relay</span><span class="tag">NavMesh</span><span class="tag">ScriptableObjects</span>
  </div>
</section>

## The demos

<div class="module-grid">
  <div class="module">
    <h4>Top-down action-adventure</h4>
    <p>Zelda-style: enemy FSM (Patrol / Wander / Chase), a Memento pattern for state saving, a binary save system over ScriptableObjects, a language manager and camera systems.</p>
  </div>
  <div class="module">
    <h4>Turn-based multiplayer tactics</h4>
    <p>A grid tactics game with multiplayer: <strong>Netcode for GameObjects + Unity Relay</strong>, a turn system, troops and HP.</p>
  </div>
  <div class="module">
    <h4>3D action demo</h4>
    <p>NavMesh enemy AI (chasers, warriors, turrets and projectiles), knockback, checkpoints and a vitality bar.</p>
  </div>
</div>

They all lean on my reusable library of Unity systems (see <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a>), reinforcing in class the value of a shared, well-architected codebase.

## Cross-stack multiplayer

Across these demos and the rest of my projects, multiplayer spans several stacks depending on the case: **Netcode for GameObjects + Unity Relay** here, **Photon Fusion 2** in the <a href="{{ '/en/projects/stealth-multiplayer/' | relative_url }}">stealth game</a> and in the <a href="{{ '/en/projects/unity-consulting-audits/' | relative_url }}">consulting work</a>, and **Photon Fusion 1** in a <a href="{{ '/en/projects/fusion-multiplayer-game/' | relative_url }}">networking final project</a>.

## What it shows

- **Breadth**: different genres and systems (action-adventure, turn-based tactics, 3D action) resolved end to end.
- **Reference-quality architecture**: code meant to be read and studied.
- Teaching **with model code**, not just theory.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/projects/common-package/' | relative_url }}">See Common-Package →</a>
  <span>internal teaching material · no public build</span>
</div>
