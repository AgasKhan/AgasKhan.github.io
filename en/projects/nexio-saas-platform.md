---
title: "Nexio — Multi-layer SaaS platform (Tech Lead)"
description: "A multi-tenant SaaS platform in production for intelligence and management of digital communities across multiple messaging channels. Tech Lead / Product Engineer: end-to-end architecture and build of a multi-layer system (SPA + serverless backend + custom Node.js runtime layer + testing harness + traffic simulator)."
permalink: /en/projects/nexio-saas-platform/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Nexio — Multi-layer SaaS platform <span class="tag active">active</span></h1>
  <p class="lead">A <strong>multi-tenant SaaS product in production</strong> to analyze and manage digital communities across <strong>multiple messaging channels</strong> (Discord, Telegram, WhatsApp). I work as <strong>Tech Lead / Product Engineer</strong>: I lead the end-to-end architecture and build of a <strong>multi-layer system</strong> — an SPA frontend, a serverless backend, a <strong>custom Node.js runtime layer</strong>, a multi-technique testing harness and a traffic simulator with ground-truth.</p>
  <div class="chip-row">
    <span class="tag">TypeScript</span><span class="tag">React</span><span class="tag">Supabase</span>
    <span class="tag">PostgreSQL / RLS</span><span class="tag">Edge Functions (Deno)</span><span class="tag">Node.js</span><span class="tag">Baileys / WebSockets</span>
    <span class="tag">Multi-model AI</span><span class="tag">Playwright</span><span class="tag">DevOps</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>Nexio is the main focus of my professional work and a live product (<a href="https://nexio.land" target="_blank" rel="noopener">nexio.land</a>). This write-up describes the architecture and my contribution in transferable terms; it does not expose business data, internal metrics or confidential details.</p>
</div>

## A multi-layer system, not just a frontend + BaaS

The shape of the architecture is what makes it interesting. It isn't an SPA talking to a backend-as-a-service: it's a system of several layers, each chosen for what it can sustain and separated from the others by explicit boundaries.

- **SPA frontend**, typed (TypeScript / React).
- **Serverless backend** on Supabase (PostgreSQL with Row-Level Security, Edge Functions in Deno, Realtime).
- **A custom Node.js runtime layer**, in a separate repo and on an always-on host, for what a serverless backend cannot sustain.
- **A multi-technique testing harness** organized into lanes.
- **A traffic simulator** that fabricates synthetic communities with ground-truth.
- **A methodology of my own** that orchestrates the work (human and AI-agent) against versioned contracts.

## Multi-channel architecture

The platform integrates three messaging channels (Discord, Telegram, WhatsApp) through **per-channel adapters** that converge on a single normalization model. The design consequence is the point: **adding a channel does not rewrite the analysis pipeline** — the pipeline works on the normalized model, not on each API's quirks.

## Multi-tenant serverless backend

The backend is serverless on **Supabase**: PostgreSQL with **per-tenant Row-Level Security**, Edge Functions in **Deno** as the authorization boundary, a Realtime channel and versioned migrations. Isolation between clients is enforced **at the database level**, not in application code — the security property does not rely on every query remembering to filter.

## Layered data boundary

I defined and enforce a layered data-access architecture: the frontend **never** queries the database directly, but goes through a typed wrapper → edge function → shared query helper. The rules are **verified by lint and CI**: the authorization boundary is encoded, and the system resists drift as it grows.

## The Node.js runtime layer: the why

A serverless backend is short-lived (request/response): it does not sustain a **persistent WebSocket** to a messaging channel well, nor run a **minutes-long** AI job without hitting its limits. So I built a **long-lived Node.js runtime layer**, in a separate repo, on an always-on host (a DigitalOcean Droplet with a reserved IP, TLS via Caddy and supervision by systemd).

The division of responsibilities is deliberate: **the database is the system of record and the clock; Node is the muscle.** The runtime ingests the channel's events (WhatsApp via **Baileys**, a multidevice client over WebSocket; and the second channel through its gateway), runs the long-running AI detection and generation, and returns results without ever being the authority over the data.

## Mechanically verified invariants

In this layer, the security properties don't depend on anyone's discipline: **they are encoded, and the machine verifies them.**

- **Zero-outbound, with a double barrier.** The runtime never emits a message to the channel — not as a confirmation, not on error. Two independent layers that must coexist guarantee it: an **AST-selector lint rule** that fails the build if anyone writes a send call, and a **runtime guard (a Proxy over the socket)** that throws if one is invoked anyway. The same receive-only pattern applies to the second channel.
- **No privileged credential on the host.** The runtime **does not write tables** and holds no privileged write credential: its only path to the database is a **boundary function authenticated by a shared secret**. Environment validation is **fail-fast**: it refuses to start if it detects on that host a privileged credential that shouldn't live there. The threat it was designed to eliminate — that credential leaking on an exposed host — stops being possible by construction.

## Staging / prod isolation by topology

Staging and production aren't separated by code flags but **by topology**: one app/host per branch, wired by environment variables (nothing hardcoded) to its own database project. The staging host can only talk to the staging database, and the prod host only to prod. Promotion follows the same flow as the rest of the system (staging → main).

## Job triggering: the database as the clock

Background work is triggered by a **cadence-tier seam**: a fixed set of cron heartbeats in the database makes an **authenticated POST** to a single runtime endpoint, which runs every producer due at that tier (signal detection, content generation, member-identity classification). It responds immediately and runs in the background, so a slow AI job doesn't blow the cron timeout, and jobs are **idempotent** so a retry is a benign replay. It's a deliberate pattern after discarding an in-process scheduler: an internal timer **drifts** across every host restart.

## AI: multi-model routing with fallback and circuit-breaker

I integrated AI as a **multi-model router** with cross-provider fallback (Google Gemini, Anthropic Claude) and a **per-model circuit-breaker**. The design decisions are what matter:

- **The UI passes only the intent** of the operation; **model ids live server-side** and the client never sees them.
- Fallback **preserves quality**: it never degrades to a lower tier for content or strategy.
- It distinguishes **recoverable from non-recoverable** errors (it doesn't fabricate a response) and **counts usage exactly once**.
- The AI **interprets and contextualizes, but base metrics are computed deterministically in code** — the auditable part isn't left to the model's mercy.

## Multi-technique testing harness

Each layer is validated with the technique that fits it, organized into lanes with a guiding principle: **validator health is separate from product quality** (catching bad product is a validator success, not a failure).

- **Transactional SQL (BEGIN/ROLLBACK)** for schema invariants and multi-tenant isolation, without dirtying the database.
- **Synthetic events (PowerShell)** for the boundary-function contracts.
- **Python + Playwright** for real onboarding E2E.
- **Quality audits** of content and of AI-generated narrative against a **versioned rubric**.

## Traffic simulator with ground-truth

To validate the analysis engine without operating dozens of real accounts, I built a **traffic simulator** that fabricates synthetic communities: a **persistent cast of archetype members** aligned to the real dimensions the product detects (user type, strategic value, transient states, message intent), with optional local AI (**llama.cpp**). Each message is **tagged with its expected intent and sentiment**, producing the **ground-truth** against which what the analysis detected is checked.

## Methodology and context-engineering

I formalized a **methodology of my own**: a lightweight protocol for task and spec governance (a state lifecycle, frozen versioned specifications — a stable spec isn't edited in place, it's versioned — and branch governance), integrated with the team's documentation so architecture decisions and work in progress stay traceable.

I extended it to **context-engineering to orchestrate AI agents in layers**: an orchestrator thread hands out work against contracts and per-domain agents return evidence against their contract, with a "live state" of the project as the mandatory first read. And I keep a **versioned visual baseline** — dated step-by-step captures of onboarding, **3 channels × 2 languages** — to compare historical vs. current and catch UI regressions.

## What it shows

- **Multi-layer architecture** of a SaaS product in production: picking the right tool for each layer and separating them with explicit boundaries — not a monolith, not an SPA + BaaS.
- **Security boundaries encoded and machine-verified**: zero-outbound with a double barrier, no privileged credential, isolation by topology — properties that don't depend on anyone's discipline.
- **Tech leadership**: defining invariants (security, data, AI) and making the system hold them as it grows.
- **Verification rigor**: a multi-technique harness and a ground-truth simulator, with validator health kept separate from product quality.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://nexio.land" target="_blank" rel="noopener">Live product · nexio.land →</a>
  <span>employer product · in production</span>
</div>
