---
title: Packages
description: Published Unity Packages. Distributed as independent repos on GitHub.
permalink: /en/packages/
---

{% assign t = site.data.i18n[page.lang] %}
{% assign visible_packages = site.data.packages | where: "visibility", "public" %}

<section class="hero">
  <h1>Unity <span class="accent">{{ t.packages.heading }}</span></h1>
  {% if visible_packages.size > 0 %}
  <p class="lead">{{ visible_packages.size }} {{ t.packages.intro_with_count_prefix }} <a href="{{ '/en/about/' | relative_url }}">Common-Package</a>{{ t.packages.intro_with_count_suffix }} <code>manifest.json</code>.</p>
  {% else %}
  <p class="lead">{{ t.packages.empty }}</p>
  {% endif %}
</section>

{% if visible_packages.size > 0 %}
<div class="install-block">
  <div class="label">{{ t.packages.install_label }}</div>
<pre><code>"com.agaskhan.timersmanager": "https://github.com/AgasKhan/TimersManager.git#0.2.0"</code></pre>
  <p class="muted" style="margin: 8px 0 0; font-size: 13px;">{{ t.packages.transitive_note }}</p>
</div>

{% assign categories = "Foundation,Engine,Systems,Serialization,Tooling" | split: "," %}

{% for cat in categories %}
  {% assign pkgs = visible_packages | where: "category", cat %}
  {% if pkgs.size > 0 %}
  <div class="category-block">
    <h3 class="category-title">{{ cat }} <span style="color: var(--text-dim); font-weight: normal;">· {{ pkgs.size }}</span></h3>
    <div class="cards">
      {% for pkg in pkgs %}
      <article class="card">
        <div class="card-header">
          <a class="card-title" href="{{ pkg.repo }}" target="_blank" rel="noopener">{{ pkg.display_name }}</a>
          <span class="card-version">v{{ pkg.version }}</span>
        </div>
        <div class="card-id">{{ pkg.id }}</div>
        <p class="card-desc">{{ pkg.description }}</p>
        <div class="card-meta">
          <span>Unity {{ pkg.unity }}</span>
          <span>{{ pkg.dependencies.size }} {% if pkg.dependencies.size == 1 %}{{ t.packages.deps_singular }}{% else %}{{ t.packages.deps_plural }}{% endif %}</span>
          <a href="{{ pkg.repo }}" target="_blank" rel="noopener">repo ↗</a>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
  {% endif %}
{% endfor %}

<hr>

<h2>{{ t.packages.notes_heading }}</h2>
<ul>
  <li>{{ t.packages.notes_semver }}</li>
  <li>{{ t.packages.notes_changelog }}</li>
</ul>
{% else %}
<p class="muted">{{ t.packages.empty_long }}</p>
{% endif %}
