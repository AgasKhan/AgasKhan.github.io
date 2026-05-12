---
title: Proyectos
description: Proyectos personales y de equipo.
permalink: /es/projects/
---

{% assign t = site.data.i18n[page.lang] %}
{% assign visible_projects = site.data.projects | where: "repo_visibility", "public" %}

<section class="hero">
  <h1><span class="accent">{{ t.projects.heading }}</span></h1>
  {% if visible_projects.size > 0 %}
  <p class="lead">{{ t.projects.lead_with_items }}</p>
  {% else %}
  <p class="lead">{{ t.projects.lead_empty }}</p>
  {% endif %}
</section>

{% if visible_projects.size > 0 %}
<div class="project-list">
  {% for proj in visible_projects %}
  <div class="project-row">
    <div>
      <h3><a href="{{ proj.page | relative_url }}">{{ proj.name }}</a>
        {% if proj.status == "active" %}<span class="tag active">{{ t.status.active }}</span>
        {% elsif proj.status == "paused" %}<span class="tag paused">{{ t.status.paused }}</span>
        {% else %}<span class="tag">{{ proj.status }}</span>{% endif %}
      </h3>
      <p>{{ proj.short }}</p>
    </div>
    <div class="project-meta">
      {% for tech in proj.tech %}<span class="tag">{{ tech }}</span>{% endfor %}
    </div>
  </div>
  {% endfor %}
</div>
{% endif %}
