---
title: "Full-stack PHP web platform (automotive diagnostics)"
description: "Years of full-stack PHP/MySQL/Apache development in production for an automotive diagnostics equipment company: institutional site, back-office, service management, custom auth and real-time messaging."
permalink: /en/projects/php-web-platform-automotive/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Full-stack PHP web platform <span class="tag done">done</span></h1>
  <p class="lead"><strong>Full-stack PHP/MySQL</strong> development, over <strong>several years in production</strong>, of the institutional site and internal systems of an automotive diagnostics equipment company: catalog, admin back-office, service management, custom authentication and real-time messaging.</p>
  <div class="chip-row">
    <span class="tag">PHP 7</span><span class="tag">MySQL (PDO)</span><span class="tag">JavaScript</span>
    <span class="tag">jQuery / AJAX</span><span class="tag">Bootstrap</span><span class="tag">Apache / cPanel</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>Work for a private client (an automotive diagnostics company); this write-up describes only my technical contribution and does not expose the client or its business data. The signal is concrete: <strong>real years of PHP/MySQL/Apache on a production system</strong> — the substrate behind my web depth (React, by contrast, is recent).</p>
</div>

## Institutional site and catalog

I built and maintained the public face and catalog for years: multi-product catalog, **multi-language (ES/EN)** price lists, a software and technical-manual download portal, and contact and reseller-signup forms.

## Custom authentication

I developed a **custom auth module in PHP/MySQL**: registration with email activation, login, password recovery, session management, access control and account validation.

## Admin back-office

I implemented a back-office to run the business **without touching code**: CRUD for products and images, price and user administration, and **technical-service management** (per-technician repair tracking, with acceptance and billing states).

## Real-time messaging

I built a **real-time messaging** system in PHP/JavaScript (polling server, sending and reading messages) for communication between internal users and clients.

## Knowledge base and infrastructure

- I modeled a **technical automotive knowledge base** (wiring sheets, ECU database, technical notes and courses), serving hundreds of documents and downloads.
- I set up **scheduled tasks (cron)** for segmented mailing and data cleanup.
- I administered the web infrastructure: domains, cPanel, CNAME and subdomains.

## What it shows

- **Full-stack web in production for years** — not a proof of concept.
- Backend, auth, admin panel and real-time built by hand on PHP/MySQL.
- The concrete counterweight to a recent modern stack (React): the web foundation runs deep.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>private client · internal system (not public)</span>
</div>
