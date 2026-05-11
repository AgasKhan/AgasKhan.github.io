---
title: Proyectos
description: Proyectos personales y de equipo.
permalink: /projects/
---

{% assign visible_projects = site.data.projects | where: "repo_visibility", "public" %}

<section class="hero">
  <h1><span class="accent">Proyectos</span></h1>
  {% if visible_projects.size > 0 %}
  <p class="lead">Proyectos personales y de equipo. Algunos activos, otros pausados — todos comparten la biblioteca de packages.</p>
  {% else %}
  <p class="lead">Aún no hay proyectos públicos para mostrar.</p>
  {% endif %}
</section>

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
{% endif %}
