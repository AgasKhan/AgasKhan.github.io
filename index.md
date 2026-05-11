---
title: Home
description: Portal de Lucas (AgasKhan). Hub de Unity Packages, proyectos en curso y notas técnicas.
---

<section class="hero">
  <h1>Hey, soy <span class="accent">Lucas</span>.</h1>
  <p class="lead">Unity developer. Mantengo una biblioteca de packages reutilizables y trabajo sobre proyectos personales. Este sitio es el nexo entre todo eso.</p>
</section>

<div class="section-heading">
  <h2>Packages</h2>
  <a class="section-action" href="{{ '/packages/' | relative_url }}">Ver todos →</a>
</div>

<p class="muted">{{ site.data.packages.size }} Unity Packages publicados desde Common-Package, distribuidos como repos independientes para consumo via Git URL en <code>manifest.json</code>.</p>

<div class="cards">
  {% assign featured = site.data.packages | where: "category", "Foundation" %}
  {% for pkg in featured limit:3 %}
  <article class="card">
    <div class="card-header">
      <a class="card-title" href="{{ pkg.repo }}" target="_blank" rel="noopener">{{ pkg.display_name }}</a>
      <span class="card-version">v{{ pkg.version }}</span>
    </div>
    <div class="card-id">{{ pkg.id }}</div>
    <p class="card-desc">{{ pkg.description | truncate: 160 }}</p>
    <div class="card-meta">
      <span>Unity {{ pkg.unity }}</span>
      <span>{{ pkg.dependencies.size }} deps</span>
    </div>
  </article>
  {% endfor %}
</div>

<div class="section-heading">
  <h2>Projects</h2>
  <a class="section-action" href="{{ '/projects/' | relative_url }}">Ver todos →</a>
</div>

<div class="project-list">
  {% for proj in site.data.projects %}
  <div class="project-row">
    <div>
      <h3><a href="{{ proj.page | relative_url }}">{{ proj.name }}</a>
        {% if proj.status == "active" %}<span class="tag active">activo</span>
        {% elsif proj.status == "paused" %}<span class="tag paused">pausado</span>
        {% else %}<span class="tag">{{ proj.status }}</span>{% endif %}
      </h3>
      <p>{{ proj.short }}</p>
    </div>
    <div class="project-meta">
      {% for t in proj.tech %}<span class="tag">{{ t }}</span>{% endfor %}
    </div>
  </div>
  {% endfor %}
</div>

<hr>

<h2>¿Para qué sirve este sitio?</h2>

<p>
Centraliza acceso a packages, proyectos y notas. Cada README de mis repos puede apuntar acá como punto de entrada, en lugar de mantener listas duplicadas package-por-package.
</p>

<p class="muted">
Stack: GitHub Pages + Jekyll. El listado de packages se regenera desde <code>Common-Package</code> con <code>scripts/sync-from-cp.ps1</code>.
</p>
