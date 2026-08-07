---
title: "Institutional portal + management system (chamber/association)"
description: "A multi-section institutional portal and full-stack management system in PHP/MySQL for a trade chamber/association: two-sided job board, advisory services, scholarships, courses, forum and a custom back-office."
permalink: /en/projects/institutional-portal-management/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Institutional portal + management <span class="tag done">done</span></h1>
  <p class="lead"><strong>Full-stack PHP/MySQL</strong> development of a multi-section institutional portal for a <strong>trade chamber/association</strong>, with a custom admin back-office: it combines the public informational face with operational modules (job board, advisory services, scholarships, courses, forum).</p>
  <div class="chip-row">
    <span class="tag">PHP</span><span class="tag">MySQL</span><span class="tag">JavaScript</span>
    <span class="tag">jQuery / AJAX</span><span class="tag">Bootstrap</span><span class="tag">Apache</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Framing</p>
  <p>Another management system + website built as <strong>on-demand work</strong>, from the same ecosystem as the <a href="{{ '/en/projects/php-web-platform-automotive/' | relative_url }}">PHP web platform</a>. I describe only my technical contribution; I do not expose the institution's name or its members' data. It adds to the <strong>real years of PHP/MySQL/Apache</strong> on production systems.</p>
</div>

## Multi-section institutional portal

I built the public informational part: institutional sections, board of directors, how to join, agreements, benefits, news and useful data — in PHP/MySQL on Apache.

## Two-sided job board

I developed a job board module with **two sides**: signup, login, search and edit for **companies** on one side and for **applicants/CVs** on the other, plus the views for offered and requested positions (job supply and demand).

## Member services

I implemented service sections: **accounting and legal advisory**, **scholarship** management, affiliated chambers, sponsors/agreements and labor-competence certification.

## Courses, technical sheets and forum

- A **courses/training** module: enrollment, course creation and per-course information.
- A **technical-sheets** base with search and login-gated access.
- Integration of a **discussion forum** (based on phpBB) for the institution's community: the integration is mine, the forum software is third-party.

## Custom back-office

I set up an admin back-office to run the portal **without touching code** (CRUD and management of content and modules via the admin panel).

## What it shows

- A **complete management system** (multiple operational modules + admin panel) built by hand in PHP/MySQL.
- Non-trivial domain modeling: two-sided job board, services, training and community.
- More depth to the **years of web in production** under on-demand work.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/en/projects/php-web-platform-automotive/' | relative_url }}">See the PHP web platform →</a>
  <span>private client · internal system (not public)</span>
</div>
