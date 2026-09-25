---
title: Pollito Slayer
description: "A boss-rush brawler shipped on s&box (Source 2 / C#), with a public playable build. Thirteen systems from the AgasKhan library, ported from Unity to a different engine, carry the whole game."
permalink: /en/projects/pollito-slayer/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Pollito Slayer <span class="tag active">shipped</span></h1>
  <p class="lead">A single-player boss-rush brawler, built for the s&amp;box Game Jam III on the theme <em>"One More Round"</em>. It is my first title shipped outside Unity.</p>
  <p><a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener"><strong>▶ Play on s&amp;box (free) ↗</strong></a></p>
  <div class="chip-row">
    <span class="tag">s&amp;box</span><span class="tag">Source 2</span><span class="tag">C# / .NET</span><span class="tag">Boss-rush</span><span class="tag">Game jam</span>
  </div>
</section>

## What it is

A newborn chick puts on boxing gloves and sends waves of marine mammals back to the sea. The dinosaurs banished them to the ocean ages ago; they adapted, and waited. The chick is what is left of that lineage.

A complete single-player game: melee combat, wave-based rounds, bosses, unlockables and scoring. Built in eighteen days, from September 7th to 25th, 2026, as the only programmer on the project.

## The engine wasn't mine

s&box is Facepunch's engine (the Garry's Mod and Rust people): C#/.NET on top of Source 2. It shares no API, units or conventions with Unity — distances are in inches, the vertical axis is Z, and the sandbox restricts which parts of .NET are available.

It is the second project I've built there, and the first one to ship.

## The library crossed engines

Thirteen systems from <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a> — my library, written for Unity — moved into this project and carry the game that shipped: agent perception, enemy AI, state machine, object pooling, timers, event bus, data structures, and logging and fading utilities.

That is what this project shows better than any architecture write-up: **a core written in plain C#, with the engine at the edge, transfers.** Enemy decision-making and perception did not have to be rewritten to go from Unity to Source 2; what had to be written was the thin layer that binds them to the new engine.

Three further systems — agent perception, the character's swappable brain, and the distance-band enemy FSM — were extracted into their own packages during this build, tracing back to earlier projects. The loop runs both ways: the library carries the game, and the game pushes the library.

## How the pace held

The repository ships with **126 unit test files** that run without opening the editor or the game. That is the practical payoff of keeping the core decoupled from the engine: perception, decision and timing logic is verified in seconds, and jam time goes into playing the game rather than re-checking by hand what already worked.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener">Play on s&amp;box ↗</a>
  <span>contract work for Del Bueno Games · private repo</span>
</div>
