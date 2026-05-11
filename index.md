---
title: Home
description: Portal de AgasKhan. Hub de Unity Packages, proyectos en curso y notas técnicas.
---

<section class="hero">
  <h1>Bienvenido al portal de <span class="accent">AgasKhan</span>.</h1>
  <p class="lead">Unity developer. Mantengo una biblioteca de packages reutilizables y trabajo sobre proyectos personales. Este sitio es el nexo entre todo eso.</p>
</section>

{% assign visible_packages = site.data.packages | where: "visibility", "public" %}
{% assign visible_projects = site.data.projects | where: "repo_visibility", "public" %}

<div class="section-heading">
  <h2>Packages</h2>
  {% if visible_packages.size > 0 %}<a class="section-action" href="{{ '/packages/' | relative_url }}">Ver todos →</a>{% endif %}
</div>

{% if visible_packages.size > 0 %}
<p class="muted">{{ visible_packages.size }} Unity Packages publicados, distribuidos como repos independientes para consumo via Git URL en <code>manifest.json</code>.</p>

<div class="cards">
  {% for pkg in visible_packages limit:3 %}
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
{% else %}
<p class="muted">Aún no hay packages publicados al público. La biblioteca se desarrolla en repos privados; los más estables se irán publicando progresivamente.</p>
{% endif %}

<div class="section-heading">
  <h2>Proyectos</h2>
  {% if visible_projects.size > 0 %}<a class="section-action" href="{{ '/projects/' | relative_url }}">Ver todos →</a>{% endif %}
</div>

{% if visible_projects.size > 0 %}
<div class="project-list">
  {% for proj in visible_projects %}
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
{% else %}
<p class="muted">Aún no hay proyectos públicos para mostrar.</p>
{% endif %}

<hr>

<h2>¿Para qué sirve este sitio?</h2>

<p>
Centraliza el acceso a packages, proyectos y notas. Cada README de los repos públicos puede apuntar acá como punto de entrada, en lugar de mantener listas duplicadas package-por-package.
</p>
