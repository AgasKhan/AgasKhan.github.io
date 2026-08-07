---
title: "Self-updating game launcher"
description: "Degree coursework (Da Vinci): a launcher/patcher that installs, updates and launches a game build — remote version manifest, download, unzip and run."
permalink: /en/projects/game-launcher-autoupdater/
---

<p class="crumbs"><a href="{{ '/en/projects/' | relative_url }}">← Back to projects</a></p>

<section class="hero">
  <h1>Self-updating game launcher <span class="tag academic">academic</span></h1>
  <p class="lead">A Unity <strong>launcher/patcher</strong> app that installs, updates and runs a game build for the end user. It handles the full distribution cycle: check the published version, compare it against the installed one, download the package, unzip it, locate the executable and launch it.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">UnityWebRequest</span>
    <span class="tag">System.IO.Compression</span><span class="tag">Coroutines</span><span class="tag">PlayerPrefs</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Academic project</p>
  <p>Degree coursework (Da Vinci). It tackles a real problem — distributing builds to players without your own infrastructure — with a pragmatic solution. It's different from my other projects: not gameplay, but distribution tooling (I/O, networking and install lifecycle).</p>
</div>

## What it does

- **Manifest-based auto-update.** Compares the local version against a remote manifest and only downloads the package when an update is pending, persisting path, version and executable with `PlayerPrefs`.
- **Full install cycle.** Downloads to `%AppData%`, unzips to a versioned folder, recursively finds the executable and launches the process — with install / update / uninstall / play actions in the UI.
- **Download from Google Drive.** Converts the file link into a direct link and parses Drive's confirmation form to get the real binary URL, bypassing the intermediate download screen.

> The manifest and package were hosted on Google Drive for the convenience of the academic context. Scraping Drive's form is a pragmatic solution, fragile to Drive changes — not production infrastructure, and framed as such.

## What it shows

- **Low-level client I/O and networking**: downloads, decompression, file handling and launching processes.
- Thinking through the full **install lifecycle**, not just the download.
- A **pragmatic solution** to a real distribution problem, with its limits stated up front.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>degree project (Da Vinci) · private repo</span>
</div>
