---
title: "Nexio — SaaS platform (Tech Lead)"
description: "A multi-tenant SaaS platform in production for intelligence and management of digital communities across multiple messaging channels. Tech Lead / Product Engineer: end-to-end architecture and build."
permalink: /en/projects/nexio-saas-platform/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Nexio — SaaS platform <span class="tag active">active</span></h1>
  <p class="lead">A <strong>multi-tenant SaaS product in production</strong> to analyze and manage digital communities across <strong>multiple messaging channels</strong> (Discord, Telegram, WhatsApp). I work as <strong>Tech Lead / Product Engineer</strong>: I lead the end-to-end architecture and build, from the frontend to the serverless backend and the AI integrations.</p>
  <div class="chip-row">
    <span class="tag">TypeScript</span><span class="tag">React</span><span class="tag">Supabase</span>
    <span class="tag">PostgreSQL</span><span class="tag">Edge Functions (Deno)</span><span class="tag">Node.js</span><span class="tag">AI (Gemini)</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>Nexio is the main focus of my professional work and a live product (<a href="https://nexio.land" target="_blank" rel="noopener">nexio.land</a>). This write-up describes the architecture and my contribution in transferable terms; it does not expose business data, internal metrics or confidential details.</p>
</div>

## Multi-channel architecture

The platform integrates three messaging channels (Discord, Telegram, WhatsApp) through **per-channel adapters** that converge on a single normalization model. The design consequence is the point: **adding a channel does not rewrite the analysis pipeline** — the pipeline works on the normalized model, not on each API's quirks.

## Multi-tenant serverless backend

The backend is serverless on **Supabase**: PostgreSQL with **per-tenant Row-Level Security**, Edge Functions in **Deno** as the authorization boundary, a Realtime channel and versioned migrations. Isolation between clients is enforced **at the database level**, not in application code — the security property does not rely on every query remembering to filter.

## Layered data boundary

I defined and enforce a layered data-access architecture: the frontend **never** queries the database directly, but goes through a typed wrapper → edge function → shared query helper. The rules are **verified by lint and CI**: the authorization boundary is encoded, and the system resists drift as it grows.

## AI with auditable limits

I integrated AI content generation (**Google Gemini**) under contractual, auditable limits. The separation is deliberate: **AI interprets and contextualizes, but base metrics are computed deterministically in code**. I migrated from a legacy gateway to a direct integration with the provider.

## Process and deployment

- **Disciplined continuous deployment**: feature → staging → production, with controlled promote/backport.
- **Contract-first**: versioned, immutable specifications — a stable spec is not edited in place, it is versioned. This removes drift between documentation and system.
- **Task and spec governance**: a lightweight protocol with a state lifecycle and branch governance, integrated with the team's documentation, so architecture decisions and work in progress stay traceable.

## What it shows

- **SaaS product architecture**: multi-tenant, in production — not a proof of concept.
- **Tech leadership**: not just writing code, but defining boundaries (security, data, AI) and making the system hold them as it grows.
- **Full-stack + DevOps**: typed frontend, serverless backend, messaging and AI integrations, and the deployment pipeline that sustains them.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://nexio.land" target="_blank" rel="noopener">Live product · nexio.land →</a>
  <span>employer product · in production</span>
</div>
