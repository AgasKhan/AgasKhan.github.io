---
title: "AI image-generation service — local GPU orchestration + LoRA pipeline"
description: "A multi-user AI image-generation service: orchestration of a local diffusion engine on a single GPU, per-GPU queue, inference-process lifecycle, a LoRA training pipeline and a Discord bot as gateway. Built end to end."
permalink: /en/projects/ai-image-generation-service/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>AI image-generation service <span class="tag active">active</span></h1>
  <p class="lead">I designed, built and operate a <strong>multi-user AI image-generation service</strong> that runs <strong>100% locally on a single GPU</strong>. A <strong>Discord bot</strong> acts as the gateway to a diffusion engine, with a per-GPU queue, management of the inference-process lifecycle and a <strong>per-character LoRA training pipeline</strong>. I stood up the whole structure end to end, on my own.</p>
  <div class="chip-row">
    <span class="tag">Node.js</span><span class="tag">discord.js v14</span><span class="tag">stable-diffusion.cpp (CUDA)</span>
    <span class="tag">Python / PyTorch</span><span class="tag">kohya-ss (LoRA)</span><span class="tag">RTX 3090</span><span class="tag">Orchestration</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>What's on display here is the <strong>engineering</strong>: turning a single-GPU machine into a shared, multi-user generation service, with the orchestration, pipeline and tooling that requires. The domain is character image generation for adult content. I stood up the whole structure on my own — infrastructure, orchestration and task system — from idea to a service in operation. No output is shown and the repo (private) is not linked.</p>
</div>

## Local GPU orchestration

The bot is the orchestration layer; the AI runs **100% locally**, with no dependency on third-party APIs. On a single card (**RTX 3090**) I built:

- A **single-slot FIFO queue** tuned to one GPU: it serializes heavy work so the card never saturates.
- **Per-user rate-limiting** (token bucket), to share the common resource fairly.
- **Layered prompt composition** (character + scene + defaults) and an **archive of every generation** with full metadata in a JSON sidecar.

## Inference-process lifecycle

The diffusion engine runs as a **child process**, and its lifecycle is where the service's robustness lives:

- **Spawn / reuse / kill** of the inference server on demand.
- **HTTP health-check** before routing work.
- **Timeouts via `AbortController`** so the queue never hangs.
- **Orphan-process detection** on startup (Windows) and **graceful shutdown** on signals.

## LoRA training pipeline

To achieve **consistent identity** across generations, I built a per-character LoRA training pipeline:

- **kohya-ss / sd-scripts** on PyTorch/CUDA, with a reproducible setup.
- Verification that the build runs on **GPU and not CPU** (a silent, expensive-to-catch error).

## Consistent-identity dataset generator

I wrote a **synthetic dataset** generator: it fixes a character's identity via a **face embedding (IP-Adapter FaceID)** and varies pose, scene and framing to produce the diversity a LoRA needs — emitting progress that the orchestrating process can parse.

## Multi-architecture

I supported multiple diffusion architectures (**SD1.5, SDXL, Flux**) using **quantized weights (gguf)** to fit within available VRAM.

## Process engineering

All work is organized with an **issues-based task system** (GitHub), issues-first. The whole structure — infra, orchestration, pipeline and tooling — I stood up alone.

## What it shows

- **Systems orchestration** over scarce resources: turning a single GPU into a shared, multi-user service that stays stable.
- **Process lifecycle** and operational robustness (spawn/reuse/kill, health-check, timeouts, orphans, graceful shutdown).
- **Applied ML pipeline**: LoRA training + dataset generation, integrated into an automated flow.
- **End-to-end ownership**: from idea to a service in operation, built solo.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>personal project · private repo</span>
</div>
