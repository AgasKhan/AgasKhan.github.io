---
title: "HLSL compute shaders on DirectX 11"
description: "C++ library for Unity that compiles HLSL compute shaders at runtime on DX11. Case study: debugging a silent GPU failure with 3 root causes."
permalink: /en/projects/compute-shaders-dx11/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>HLSL compute shaders on DirectX 11 <span class="tag done">done</span></h1>
  <p class="lead">A C++ library for Unity that compiles <strong>HLSL compute shaders at runtime</strong> on DirectX 11, with native C++ ↔ C# bindings, a fragment → compute converter and a multi-architecture build (x86 + x64).</p>
  <div class="chip-row">
    <span class="tag">C++</span><span class="tag">DirectX 11</span><span class="tag">HLSL (compute)</span>
    <span class="tag">Unity Native Plugin</span><span class="tag">P/Invoke</span><span class="tag">Reflection</span>
  </div>
</section>

## Context

Unity exposes no standard API to **compile HLSL at runtime**: compute shaders are compiled at build time. This project works around that limitation with a **native C++ plugin** that calls the DirectX compiler directly and hands the result back to C# through interop.

It was built as a personal deliverable for an introductory shader course (Image Campus), extending the syllabus. It is the sibling of this site's <a href="{{ '/en/playground/' | relative_url }}">shader playground</a>: the descent from high-level GLSL/HLSL down to the native graphics API.

## Architecture

- **Runtime compilation pipeline.** The C++ plugin receives the HLSL source, invokes the native DirectX compiler (emitting a `.cso`) and returns the bytecode to Unity. A C# loader picks it up via reflection and fills a `RenderTexture` during the frame.
- **Fragment → compute converter.** Takes a fragment shader and automatically generates the equivalent compute shader from a template (`RWTexture2D<float4> _Result`), so a shader meant for the screen can run as a compute pass.
- **Native C++ ↔ C# bindings.** `DllImport` + manual marshalling + explicit native memory management. The interop layer keeps ownership unambiguous across the two runtimes.
- **Multi-architecture build.** Compiled for x86 and x64; compilation is restricted to Windows, but execution runs on any DX11/DX12 GPU.

## Case study: debugging a "silent" GPU failure

The symptom was the worst kind: **an intermittent black screen, with no error in the log**. A GPU won't complain when you write to a valid-but-wrong resource — it just produces garbage, or nothing. With no message to follow, the path was **hypothesis-driven**: isolate each suspicion, reproduce, rule it out. Under a single symptom lived three independent causes.

<ol class="rootcauses">
  <li class="rootcause">
    <h4>UAVs recreated every frame</h4>
    <dl>
      <dt>Symptom</dt><dd>The compute pass was writing, but the result didn't show up consistently.</dd>
      <dt>Cause</dt><dd>The <em>Unordered Access Views</em> were recreated every frame, invalidating the bound pipeline state: the <code>Dispatch</code> ended up writing against a view that was no longer the bound one.</dd>
      <dd class="fix"><strong>Fix:</strong> cache the UAVs across frames and reuse them, recreating only when the underlying resource changes.</dd>
    </dl>
  </li>
  <li class="rootcause">
    <h4>Main ↔ Render thread race</h4>
    <dl>
      <dt>Symptom</dt><dd>Black frames that came and went depending on timing — the classic race-dependent bug.</dd>
      <dt>Cause</dt><dd>Unity's rendering runs on its own <em>render thread</em>. Setting textures from the main thread without syncing to the render thread's cycle made the GPU sample a resource that wasn't bound yet.</dd>
      <dd class="fix"><strong>Fix:</strong> synchronize resource updates with the render thread's cycle instead of assuming the main thread takes effect immediately.</dd>
    </dl>
  </li>
  <li class="rootcause">
    <h4>Constant Buffer misalignment (16-byte padding)</h4>
    <dl>
      <dt>Symptom</dt><dd>Parameters reaching the shader as zero or shifted, with no compile error.</dd>
      <dt>Cause</dt><dd>HLSL constant buffers pack into 16-byte registers. The C++/C# struct layout didn't respect that boundary, so the shader read the fields at the wrong offsets.</dd>
      <dd class="fix"><strong>Fix:</strong> align the CBuffers explicitly so the CPU-side layout matches, byte for byte, what the GPU expects.</dd>
    </dl>
  </li>
</ol>

Three bugs, one symptom, zero error messages: each was invisible on its own, and none of them crossed paths in the log.

## What it shows

- Work at the **native graphics API** level (DirectX 11), below the engine.
- The **Unity ↔ native interop** model: marshalling, memory ownership, bindings.
- **GPU concurrency and memory layout**: main/render thread synchronization and buffer alignment.
- A **hypothesis-driven** debugging method when there's no stack trace or log to hold onto.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/playground/' | relative_url }}">See the shader playground →</a>
  <span>personal course deliverable · no public repo</span>
</div>
