---
title: Common-Package
description: "A suite of reusable production Unity systems (several sold/licensed to other devs, with recurring revenue). The workshop the individual systems ship from."
permalink: /en/projects/common-package/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Common-Package <span class="tag active">active</span></h1>
  <p class="lead">A suite of reusable <strong>production</strong> Unity systems I've built and maintained since 2021. Several of them I <strong>sell and license to other developers</strong>, with recurring revenue. It's the internal <em>workshop</em> the individual systems ship from.</p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3</span><span class="tag">C#</span><span class="tag">Burst</span>
    <span class="tag">Jobs</span><span class="tag">Source Generators</span><span class="tag">DirectX 11</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Commercial validation</p>
  <p>Not a side project: several of these systems I sell and license to other developers, with <strong>recurring revenue</strong> — for example an <a href="{{ '/en/projects/event-system-level-designers/' | relative_url }}">event system for level designers</a> that is still billing, among others. Other professionals pay for this technology and ship it in their own games.</p>
</div>

<div class="statline">
  <div class="stat"><span class="num">~36</span><span class="lbl">reusable systems</span></div>
  <div class="stat"><span class="num">18</span><span class="lbl">published UPM packages</span></div>
  <div class="stat"><span class="num">2021→</span><span class="lbl">in production &amp; maintained</span></div>
  <div class="stat"><span class="num">100%</span><span class="lbl">own authorship</span></div>
</div>

## Philosophy

- **Hybrid-repo strategy.** Common-Package is a working monorepo (permanently private). The consumable packages live in isolated GitHub repos (`AgasKhan/<Module>`), versioned with semver and consumed by other projects via Git URL in `manifest.json`.
- **`com.agaskhan.*` namespace** for every distributable package.
- **Unity 2022.3** baseline; some packages support Unity 6 through `#if UNITY_6000_0_OR_NEWER`.
- **Issues-first** task system (GitHub Issues + project board) and its own context engineering in `Assets/Context/` (state in issues, reasoning in docs, conventions in a typed `memory/`).

## Highlighted modules

Of the ~36 systems, this is a selection by technical depth. Each has its own `.asmdef` and ships as an independent package (18 already published as formal UPM packages — semver, isolated repos, tests, proprietary license) once it stabilizes:

<div class="module-grid">
  <div class="module">
    <h4>SystemEngineUpdate</h4>
    <p>A custom player loop over Unity's native <code>PlayerLoop</code>, with extended phases (Pre/Post Update, LateUpdate, FixedUpdate, EndUpdate) and sub-system auto-discovery via an <code>[EngineSubSystem]</code> attribute + reflection.</p>
  </div>
  <div class="module">
    <h4>GPUInstancing</h4>
    <p>Batched rendering of N instances with <code>Graphics.RenderMeshInstanced</code>. The <code>NativeArray</code> fill combines <code>Parallel.For</code> + <code>unsafe</code> pointers + Jobs&nbsp;+&nbsp;Burst, crossing into parallel above a threshold.</p>
  </div>
  <div class="module">
    <h4>Hierarchical FSM</h4>
    <p>Classic + hierarchical state machine that computes the <strong>Lowest Common Ancestor</strong> at runtime to fire <code>OnExit</code>/<code>OnEnter</code> in the right order when switching branches.</p>
  </div>
  <div class="module">
    <h4>DataStructure · Heap</h4>
    <p>A priority queue with an internal index map enabling <code>DecreaseKey</code>/<code>IncreaseKey</code> in O(log n) — which brings Dijkstra/A* down to O(E&nbsp;log&nbsp;V). Plus FastDictionary, serializable Pictionarys and intrusive linked lists.</p>
  </div>
  <div class="module">
    <h4>Lite-DependencyInjection</h4>
    <p>Lightweight DI via <strong>code generation</strong>: an <code>AssetPostprocessor</code> scans the <code>AppDomain</code>, detects <code>[DefaultDependency]</code> by reflection and emits the resolved classes into <code>Generated/</code>.</p>
  </div>
  <div class="module">
    <h4>JobManager</h4>
    <p>A <code>JobHandle</code> orchestrator with automatic completion callbacks and dispose (supports <code>IJob</code>, <code>IJobFor</code>, <code>IJobParallelFor</code>, <code>IJobParallelForTransform</code>), so the caller never has to call <code>Complete()</code>.</p>
  </div>
  <div class="module">
    <h4>TypeSelector</h4>
    <p>A serializable <code>System.Type</code> with a UI Toolkit <code>PropertyDrawer</code> over open generics, plus a variant that instantiates a polymorphic wrapper through <code>SerializeReference</code>.</p>
  </div>
  <div class="module">
    <h4>CommonScaffolder</h4>
    <p>An EditorWindow that generates a full new-module structure from templates, with a generator registry — including a meta-tool that generates generators.</p>
  </div>
  <div class="module">
    <h4>Movement / Steerings</h4>
    <p>Uniform locomotion over Transform/Rigidbody2D/3D/CharacterController + 7+ classic steering behaviours (Seek, Flee, Pursuit, Evade, Arrive, ObstacleAvoidance).</p>
  </div>
</div>

Other modules: <a href="{{ '/en/projects/event-system-level-designers/' | relative_url }}">EventManager</a> (a ScriptableObject event bus with a command parser, also sold as a product), TimersManager, CameraPlus (a priority-ordered modifier stack), a circular ObjectPool, CrossSceneReference, DebugPrint / DebugDraw, AutoSaveSystem, LenguageSystem. The <a href="{{ '/en/packages/' | relative_url }}">published packages list</a> has the installable detail.

## How packages are consumed

In the consumer project's `Packages/manifest.json`:

```json
{
  "dependencies": {
    "com.agaskhan.commoninterfaces": "https://github.com/AgasKhan/CommonInterfaces.git#0.1.0",
    "com.agaskhan.timersmanager": "https://github.com/AgasKhan/TimersManager.git#0.2.0"
  }
}
```

> UPM does not resolve transitive dependencies in git URLs: you must list **all** dependencies (transitive ones included) explicitly in `manifest.json`.

## Real usage and roadmap

- Real usage: the library backs **several projects** — including <a href="{{ '/en/projects/la-maldicion/' | relative_url }}">La Maldición</a> (the most recent build, exercising the latest versions), a <a href="{{ '/en/projects/stealth-multiplayer/' | relative_url }}">stealth multiplayer</a> and educational reference games — each referencing only the packages it needs as they stabilize.
- Roadmap: namespace convergence towards `AgasKhan.<Module>` and selective publishing of the most stable packages to the Unity Asset Store.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/packages/' | relative_url }}">See published packages →</a>
  <span>private repo</span>
</div>
