---
title: Packages
description: Unity Packages publicados desde Common-Package. Distribuidos como repos individuales en GitHub.
permalink: /packages/
---

<section class="hero">
  <h1>Unity <span class="accent">Packages</span></h1>
  <p class="lead">{{ site.data.packages.size }} packages publicados desde <a href="{{ '/projects/common-package/' | relative_url }}">Common-Package</a>. Cada uno vive en su propio repo y se instala via Git URL en <code>manifest.json</code>.</p>
</section>

<div class="install-block">
  <div class="label">Install ejemplo (manifest.json)</div>
<pre><code>"com.agaskhan.timersmanager": "https://github.com/AgasKhan/TimersManager.git#0.2.0"</code></pre>
  <p class="muted" style="margin: 8px 0 0; font-size: 13px;">UPM no resuelve dependencias transitivas en git URLs — hay que listar también las dependencias de cada package en el manifest.</p>
</div>

{% assign categories = "Foundation,Engine,Systems,Serialization,Tooling" | split: "," %}

{% for cat in categories %}
  {% assign pkgs = site.data.packages | where: "category", cat %}
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
  <li>Todos los repos están <strong>privados</strong> hoy. Plan futuro: los más estables se publican en Unity Asset Store.</li>
  <li>Licencia: <strong>Proprietary / All Rights Reserved</strong> (excepto Common Extensions que es MIT).</li>
  <li>Versiones siguen semver. Breaking changes bump major / minor según corresponda.</li>
  <li>Source de verdad: <a href="{{ '/projects/common-package/' | relative_url }}">Common-Package</a>.</li>
</ul>
