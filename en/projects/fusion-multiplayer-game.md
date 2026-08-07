---
title: "2D multiplayer game (Photon Fusion 1)"
description: "Networking final project (Da Vinci): a 2D action game taken to multiplayer with Photon Fusion 1 (Shared mode), plus a data-driven pipeline to author attacks and bosses."
permalink: /en/projects/fusion-multiplayer-game/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>2D multiplayer game (Photon Fusion 1) <span class="tag academic">academic</span></h1>
  <p class="lead">The final project for the Networking course: a top-down 2D action game with boss combat, taken to <strong>multiplayer on Photon Fusion 1 in Shared mode</strong>. It shows applied netcode alongside my own editor tooling to author content in a data-driven way.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Photon Fusion 1</span>
    <span class="tag">ScriptableObjects</span><span class="tag">ParrelSync</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Academic project</p>
  <p>Degree coursework (Da Vinci); the teaching goal was to take a single-player game to multiplayer with a real networking framework. I built the networking layer and the content architecture.</p>
</div>

## Netcode on Photon Fusion 1 (Shared mode)

- **Startup and session:** `NetworkRunner` initialization in Shared mode and player spawn with **input authority**.
- **Physics synchronization:** movement resolved with `NetworkRigidbody2D` inside `FixedUpdateNetwork`, with **state authority** separation so each client owns what it should.
- **Local testing:** multiplayer validation with ParrelSync, cloning the project to run several instances on the same machine.

## A data-driven pipeline for designers

I designed a pipeline to author **attacks, spells and boss patterns as ScriptableObjects**, with custom inspectors (`CustomEditor`) that give the designer an editing interface without touching code. I also added the game's support systems (dialogue, audio, dash, health bars).

## Cross-stack multiplayer

This project adds **Photon Fusion 1** to the range of multiplayer I cover: Fusion 1 here, <a href="{{ '/en/projects/stealth-multiplayer/' | relative_url }}">Photon Fusion 2</a> in freelance work, and <a href="{{ '/en/projects/reference-demo-games/' | relative_url }}">Netcode for GameObjects + Unity Relay</a> in the reference demos.

## What it shows

- **Applied netcode**: state/input authority and physics synchronization in a real networking framework.
- **Authoring tooling**: data-driven content editable by designers.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>degree project (Da Vinci) · private repo</span>
</div>
