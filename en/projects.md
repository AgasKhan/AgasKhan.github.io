---
title: Projects
description: Personal and team projects, with technical write-ups.
permalink: /en/projects/
---

{% assign t = site.data.i18n[page.lang] %}
{% assign lang = page.lang %}
{% assign visible_projects = site.data.projects | where: "listed", true %}

<section class="hero">
  <h1><span class="accent">{{ t.projects.heading }}</span></h1>
  {% if visible_projects.size > 0 %}
  <p class="lead">{{ t.projects.lead_with_items }}</p>
  {% else %}
  <p class="lead">{{ t.projects.lead_empty }}</p>
  {% endif %}
</section>

<div class="callout">
  <p class="callout-title">{{ t.projects.capabilities_heading }}</p>
  <p>{{ t.projects.capabilities_note }} <a href="{{ '/en/playground/' | relative_url }}">{{ t.nav.playground }} →</a></p>
</div>

{% if visible_projects.size > 0 %}
<div class="project-list">
  {% for proj in visible_projects %}
  {% assign detail_url = '/' | append: lang | append: '/projects/' | append: proj.id | append: '/' %}
  <div class="project-row">
    <div>
      <h3><a href="{{ detail_url | relative_url }}">{{ proj.name }}</a>
        {% if proj.status == "active" %}<span class="tag active">{{ t.status.active }}</span>
        {% elsif proj.status == "paused" %}<span class="tag paused">{{ t.status.paused }}</span>
        {% elsif proj.status == "done" %}<span class="tag done">{{ t.status.done }}</span>
        {% elsif proj.status == "academic" %}<span class="tag academic">{{ t.status.academic }}</span>
        {% else %}<span class="tag">{{ proj.status }}</span>{% endif %}
      </h3>
      <p>{{ proj.short[lang] }}</p>
      {% if proj.case_study %}<a class="cs-link" href="{{ detail_url | relative_url }}">{{ t.projects.read_case_study }}</a>{% endif %}
    </div>
    <div class="project-meta">
      {% for tech in proj.tech %}<span class="tag">{{ tech }}</span>{% endfor %}
    </div>
  </div>
  {% endfor %}
</div>
{% endif %}
