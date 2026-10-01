---
title: Pollito Slayer
description: "A boss-rush brawler shipped on s&box (Source 2 / C#), with a public playable build and ten versions in production. A 47,000-sardine crowd drawn by instancing, four bosses, and thirteen systems from the AgasKhan library ported from Unity to a different engine."
permalink: /en/projects/pollito-slayer/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Pollito Slayer <span class="tag active">shipped</span></h1>
  <p class="lead">A single-player boss-rush brawler, built for the s&amp;box Game Jam III on the theme <em>"One More Round"</em>. It is my first title shipped outside Unity, and the project I am proudest of: a whole game, played in public, built and fixed in front of people.</p>
  <p><a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener"><strong>▶ Play on s&amp;box (free) →</strong></a></p>
  <div class="chip-row">
    <span class="tag">s&amp;box</span><span class="tag">Source 2</span><span class="tag">C# / .NET</span><span class="tag">Boss-rush</span><span class="tag">Game jam</span><span class="tag">Performance</span><span class="tag">Shaders</span>
  </div>
</section>

<figure class="shot">
  <img src="{{ '/assets/img/pollito-slayer/orca-escala.webp' | relative_url }}"
       width="1600" height="900" decoding="async" fetchpriority="high"
       alt="An orca in a fedora fills half the screen. On the sand, tiny by comparison, the chick with its red boxing glove. Behind them, the fence lined with sardine spectators, and the sea.">
  <figcaption>Orca Nostra. The chick is down there, with the red glove.</figcaption>
</figure>

## What it is

A newborn chick puts on boxing gloves and sends waves of marine mammals back to the sea. The dinosaurs banished them to the ocean ages ago; they adapted, and waited. The chick is what is left of that lineage.

The joke is that the chick takes itself completely seriously, and so does the game: nothing in the presentation winks. That was the tone rule I held to throughout, because the moment a game laughs at itself the chick stops being a warrior and becomes a mascot.

A complete single-player game: melee combat, thirteen rounds, four bosses that come back transformed, unlockables, achievements and a leaderboard. Eighteen days of jam, from September 7th to 25th, 2026, and the versions that followed: **ten shipped through 0.4.1 on September 28th**. Sole programmer on the project.

## The engine wasn't mine

s&box is Facepunch's engine (the Garry's Mod and Rust people): C#/.NET on top of Source 2. It shares no API, units or conventions with Unity: distances are in inches, the vertical axis is Z, and the sandbox restricts which parts of .NET are available: `System.IO` and `Console` don't exist, and everything goes through the engine's own APIs.

It is the second project I've built there, and the first one to ship.

## Shipping while building, not after

The jam is voted through nominations that accumulate **while you build**: a playable game uploaded early collects nominations for weeks, and one uploaded on the last day collects none. That isn't a detail of the rules: it decided how I built the game.

I chose to ship something playable early and iterate in public. Faced with adding a feature versus keeping what I had playable, playable wins, every time. In four days I published seven changelog entries covering ten versions, each one with what changed and why.

What I learned there and didn't expect: **the changelog is the first thing a new player reads**, and saying what you failed to deliver is what makes it credible. One entry opens by admitting the previous one had claimed something was fixed when it wasn't. Two are named after the player whose report caused them. Several improvements came straight from that: the bell volume, the framerate drop, the length of the final round, the parry that gave no feedback.

## The game dragged 12% of the time and the frame counter said everything was fine

This is the problem that taught me the most on this project, because the obvious instrument said it didn't exist.

Blocking against the shoal felt wrong. The fps counter showed nothing: **not a single frame was being dropped**.

What was happening is that every blow the guard absorbed fired a 0.03-second *hitstop*, the time freeze that gives an impact its weight. The shoal can land up to four hits per second, and the freeze doesn't stack but it **renews**: every hit puts the full remainder back. Blocking left the world running slowed **12% of the time**.

The fps was perfect because every frame was being drawn. What had collapsed was game time, not render time. Measuring it meant asking a different question: not how many frames per second, but **what percentage of real speed the world was advancing at**.

The real fix was deciding that **blocking freezes nothing**: that freeze went to zero. A blow the guard absorbs is precisely the one that has no business interrupting the game.

And while I was there I changed the nature of the effect everywhere else. The freeze scale sat at 0.05, or 5% of normal speed, which isn't a freeze, it's a pause; it went to 0.35, the same one used for the boss's arc out to sea. The counterintuitive part is that **it costs less, not more**: in the worst case the game went from running at 84.8% of its speed to 89.6%. And the unguarded hit, the one that is supposed to hurt, dropped from 0.08 to 0.04 seconds: from 32% of the time slowed to 16%.

I took a rule away from it: **when something feels wrong and the instrument says it's fine, the instrument is measuring something else.**

## The sea was answering forty-six thousand times per frame

From round 5 on, the game dropped to 36 fps on any PC, even machines that should have had power to spare.

The cause was in the shoal. Every sardine travelling from the sea to the crowd asked the sea for its height and its edge, and **each of those questions rebuilt a transform and a rotation from scratch**. With tens of thousands of sardines in transit, that came to roughly 46,000 queries per frame to answer something identical for all of them: on any given frame, the sea is where it is.

I moved to computing the sea's state **once per frame**, with everyone reading that result. From 29.3 ms to 18.6 ms per frame. Frames over the 33 ms mark, where a hitch becomes noticeable, dropped **from 42 to 2**, and the measurement was taken under heavier load than the game ever reaches in play.

## Forty-seven thousand sardines, drawn by instancing

The stands fill with sardines that come to watch the fight, and the crowd doubles with every boss that falls: 2,937, then 5,874, 11,747, 23,494, and **46,988 in the final round**. You don't do that with prefab copies.

The system ended up split across four pieces, and the split is the decision that matters:

- **Movement is a function, not a state.** Each sardine's pose is computed from time and a seed, in plain C#. Nobody stores the position of forty-seven thousand fish.
- **The swim animation is baked in the editor to a texture**, 787 vertices by 32 frames, 400 KB. The player's machine never computes it.
- **The shader reads 32 bytes per instance**: seat, scale, yaw, clip, phase and start. From those it derives the rest.
- **Drawing goes in batches**, with box culling across four groups by ring side.

Verifying it meant instrumenting the behaviour, not the feel: frame by frame over 96 seconds, **no height jump larger than half a unit**, no sardine disappearing between frames with the camera held still, and 99% of them within 20 degrees of the expected heading. With vsync and all 47,000 on screen, the 99th percentile landed between 17 and 24.5 ms.

<figure class="shot shot-pair">
  <img src="{{ '/assets/img/pollito-slayer/cardumen-ring-1.webp' | relative_url }}"
       width="1400" height="676" loading="lazy" decoding="async"
       alt="Top-down view of the arena: columns of blue sardines converge from the edges towards the chick, tiny in the middle with its red glove.">
  <img src="{{ '/assets/img/pollito-slayer/cardumen-ring-2.webp' | relative_url }}"
       width="1400" height="676" loading="lazy" decoding="async"
       alt="The same arena moments later, the sand covered edge to edge with sardines and the chick barely visible among them.">
  <figcaption>The final round, the only one without a boss: every sardine comes down to the ring at once. They are drawn with the same system as the stands.</figcaption>
</figure>

## The attack that followed you as you dodged it

The four bosses have sixteen attacks between them. Fifteen lock the point they will land on the moment the wind-up marker appears, and that is what gives the player the window to read it and get out.

One didn't: the orca's breach kept tracking the chick **through the entire wind-up**. With the chick walking 300 units while it lasted, the blow landed where the chick ended up, not where it had been when the marker appeared.

What that broke wasn't the attack's difficulty, but **the existence of more than one answer**. The breach is unblockable, but unblockable is not unparryable: the parry is precisely what it is meant to meet, on the same 0.30-second window as the rest of the orca's attacks. Tracking through the wind-up left the parry as the only way out, and the parry is the hardest read in the game. An attack that had two answers had quietly been reduced to one, without anyone deciding it.

It wasn't a bug: each piece, on its own, was correct. It was the crossing of two correct decisions that took the alternative away from the player. The breach now locks its point when the wind-up begins, and it can be dodged again as well as parried.

<figure class="shot">
  <img src="{{ '/assets/img/pollito-slayer/telegrafiado.webp' | relative_url }}"
       width="1600" height="900" loading="lazy" decoding="async"
       alt="A red band runs from the orca across the sand to the chick, marking the spot where the blow is going to land.">
  <figcaption>The red band marks where the blow is going to land. That is the window to get out.</figcaption>
</figure>

## Nothing is computed on the player's machine if it can be computed beforehand

This was a rule, not a one-off optimisation: **anything that can be baked in the editor ships as an asset**. Precomputed tables, generated textures, layouts, the shoal's swim animation. That way I never demand anything of anyone's PC.

What can't be prepared in advance, such as the pipelines the video driver builds the first time it sees a material, doesn't get deferred to the moment of use, because that is exactly when it shows. It gets warmed up ahead of time, spread across a **load queue with a per-frame time budget**: run what fits in the budget, continue next frame.

The startup hitch, which used to do all the warm-up in a single frame, **measured 196 ms**. That work is the skins of the four bosses and the chick, eleven VFX prefabs, the sounds and three sky renders, now spread out until the player doesn't feel it.

## The library crossed engines

Thirteen systems from <a href="{{ '/en/projects/common-package/' | relative_url }}">Common-Package</a>, my library written for Unity, moved into this project and carry the game that shipped: agent perception, enemy AI, state machine, object pooling, timers, event bus, data structures, the camera stack, and logging and fading utilities.

That is what this project shows better than any architecture write-up: **a core written in plain C#, with the engine at the edge, transfers.** Enemy decision-making and perception did not have to be rewritten to go from Unity to Source 2; what had to be written was the thin layer that binds them to the new engine.

The port was done file by file, **without using the trip as an excuse to improve anything**: a port that also refactors can't be verified, because when something breaks you can't tell whether the port broke it or the improvement did. Engine differences were recorded in each class's comment.

Inside the game I applied the same pattern: health, combat, the hit chain, HUD, impulse, rounds and unlockables are plain C# objects of their own, with the engine component left as a shell. That is what lets most of the game be tested without opening the editor.

Three further systems were extracted into their own packages during this build, tracing back to earlier projects: agent perception, the character's swappable brain, and the distance-band enemy FSM. The loop runs both ways: the library carries the game, and the game pushes the library.

## Seven tests are left red on purpose

The repository runs **1,193 unit tests across 133 files, in five seconds, without opening the editor or the game**. That is the practical payoff of keeping the core decoupled from the engine: perception, decision and timing logic is verified in seconds, and jam time goes into playing the game.

Of those 1,193, **1,186 are green and seven are red on purpose**, with the reason written inside the failure message.

Six of them verify each species' *signature*: that the seal pounces from mid-range and not from across the ring, that only the sea lion shoves you towards the ropes, that each boss plants itself facing you with an attack in reach. A difficulty rebalance moved the ranges and those signatures are currently suspended. I could have turned them green by adjusting the expected number. I didn't: **green would leave no trace that the signature is suspended**, and the decision of whether the design goes back would quietly disappear. The red is the record.

The seventh says the gap the dash opens is refilled within the same frame. That's true, and it has been decided it should stay true: the dash sweeps 34 units and sardines decide to jump from 100, so the ones in between never learn about the dodge. Buying that space meant nearly tripling the sweep, and the dash feels right as it is. Turning it green would assert that the gap isn't refilled, and it is.

I also use tests in reverse: to verify a new rule I **break the code on purpose and watch the test fall**. A test that compares a calculation against the data it came from passes always, and verifies nothing.

## What it demonstrates

- **A complete game shipped on an engine that wasn't mine**, with ten versions in production and the report-fix-ship cycle running in public.
- **Diagnosis on live systems**: finding why something feels wrong when the obvious instrument says it's fine, and choosing the measurement that does show it.
- **Performance as an architecture decision**, not a late optimisation: what gets baked in the editor, what gets spread across frames and what gets paid every frame, decided up front and measured.
- **An engine-agnostic core that actually crossed engines**, with the test coverage that enables.
- **Verification judgment**: tests that fall when you break the rule they guard, and tests left red when red is the information.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener">Play on s&amp;box →</a>
  <span>contract work for Del Bueno Games | private repo</span>
</div>
