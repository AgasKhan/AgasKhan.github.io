---
title: Packages
description: Unity Packages publicados. Distribuidos como repos individuales en GitHub.
permalink: /packages/
---

{% assign visible_packages = site.data.packages | where: "visibility", "public" %}

<section class="hero">
  <h1>Unity <span class="accent">Packages</span></h1>
  {% if visible_packages.size > 0 %}
  <p class="lead">{{ visible_packages.size }} packages publicados desde <a href="{{ '/projects/common-package/' | relative_url }}">Common-Package</a>. Cada uno vive en su propio repo y se instala via Git URL en <code>manifest.json</code>.</p>
  {% else %}
  <p class="lead">Aún no hay packages publicados al público.</p>
  {% endif %}
</section>

{% if visible_packages.size > 0 %}
<div class="install-block">
  <div class="label">Install ejemplo (manifest.json)</div>
<pre><code>"com.agaskhan.timersmanager": "https://github.com/AgasKhan/TimersManager.git#0.2.0"</code></pre>
  <p class="muted" style="margin: 8px 0 0; font-size: 13px;">UPM no resuelve dependencias transitivas en git URLs — hay que listar también las dependencias de cada package en el manifest.</p>
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
          <span>{{ pkg.dependencies.size }} dep{% if pkg.dependencies.size != 1 %}s{% endif %}</span>
          <a href="{{ pkg.repo }}" target="_blank" rel="noopener">repo ↗</a>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
  {% endif %}
{% endfor %}

<hr>

<h2>Notas</h2>
<ul>
  <li>Las versiones siguen semver. Los breaking changes bump major / minor según corresponda.</li>
  <li>Cada package mantiene su CHANGELOG en su propio repo.</li>
</ul>
{% else %}
<p class="muted">La biblioteca se desarrolla en repos privados. Cuando un package se estabilice, se publicará y aparecerá listado acá.</p>
{% endif %}
