---
title: Projects
description: Proyectos personales y de equipo. Cada uno con su contexto, estado y links a repos.
permalink: /projects/
---

<section class="hero">
  <h1><span class="accent">Projects</span></h1>
  <p class="lead">Proyectos personales y de equipo. Algunos activos, otros pausados — todos comparten la biblioteca de packages.</p>
</section>

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
