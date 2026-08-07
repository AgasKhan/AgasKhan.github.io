---
title: "Stealth multiplayer (freelance)"
description: "A stealth multiplayer game in Unity delivered in ~1 month. Case study: netcode on Photon Fusion 2 + suspicion-based stealth AI (visual and auditory perception)."
permalink: /en/projects/stealth-multiplayer/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Stealth multiplayer <span class="tag done">done</span></h1>
  <p class="lead">A real-time stealth multiplayer game, built for a freelance client. I contributed the networking layer on <strong>Photon Fusion 2</strong>, the <strong>suspicion-based enemy AI</strong> (visual and auditory perception) and the character, perception and interaction systems — the full project in roughly a month.</p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3 LTS</span><span class="tag">C#</span><span class="tag">Photon Fusion 2</span>
    <span class="tag">Jobs / Burst</span><span class="tag">URP</span><span class="tag">Game AI</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>Work for a private client. This write-up describes only my technical contribution; it does not expose the client or the game's theme. I could deliver the full project in ~1 month by leaning on my own library of Unity systems (see <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a>) — a concrete example of the ROI of having a reusable base.</p>
</div>

## Netcode on Photon Fusion 2

- **Sessions and lobby:** match browser, host/client mode and a minimum player count to start.
- **Networked players:** player spawn and synchronization, with input routed through the network runner's callbacks.
- **Scene sync with authority:** the active scene is synchronized over the network with scene authority, keeping every client in the same game state.

## Case study: suspicion-based stealth AI

The heart of the gameplay is enemy AI that **decides how much it suspects the player** rather than a binary "sees it or not". Two pieces make it work:

- **Hierarchical state machine.** `Relax` / `Alert` super-states, each with sub-states (patrol, curiosity, chase, evade, attack). The hierarchy lets related states share behaviour and switch branches cleanly, reusing the hierarchical FSM from my framework.
- **A two-sense suspicion system.** Suspicion is fed by:
  - **Visual perception:** a vision cone with central and peripheral zones, a multiplier based on the target's speed and a distance threshold.
  - **Auditory perception:** sound detection with memory and decay, so a recent noise keeps weighing for a while even after it stops.

  The resulting suspicion level is what drives the state machine's transitions: it rises with evidence, decays over time, and crosses thresholds that move the enemy from patrolling to investigating, chasing or attacking.

## Character systems

The character decouples **input from logic** via an input mediator and an event system; on that base I implemented picking up and throwing objects, and charging and aiming an attack. I reused my library (field-of-view detection, event manager, timers, movement/locomotion, object pool) as the common base to move fast.

## What it shows

- Real-time gameplay **multiplayer / networking** on Photon Fusion 2 (sessions, synchronization, scene authority).
- **Gameplay AI**: multi-sense perception (visual + auditory) driving a hierarchical state machine.
- **Delivery speed** leveraged on my own reusable architecture — a full project in ~1 month.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/projects/common-package/' | relative_url }}">See Common-Package →</a>
  <span>freelance client · private repo</span>
</div>
