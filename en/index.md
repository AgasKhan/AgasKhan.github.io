---
title: Home
description: AgasKhan's portal. Hub of Unity Packages, ongoing projects and technical notes.
permalink: /en/
---

{% assign t = site.data.i18n[page.lang] %}
{% assign visible_packages = site.data.packages | where: "visibility", "public" %}
{% assign visible_projects = site.data.projects | where: "repo_visibility", "public" %}

<section class="hero">
  <h1>{{ t.hero.welcome_prefix }} <span class="accent">AgasKhan</span>.</h1>
  <p class="lead">{{ t.home.profile_short }}</p>
  <p style="margin-top: 14px;"><a href="{{ '/en/about/' | relative_url }}">{{ t.home.profile_link }}</a></p>
</section>

<div class="section-heading">
  <h2>{{ t.home.packages_heading }}</h2>
  {% if visible_packages.size > 0 %}<a class="section-action" href="{{ '/en/packages/' | relative_url }}">{{ t.home.view_all }}</a>{% endif %}
</div>

{% if visible_packages.size > 0 %}
<p class="muted">{{ visible_packages.size }} {{ t.home.packages_intro_count }} <code>manifest.json</code>.</p>

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
<p class="muted">{{ t.home.packages_empty }}</p>
{% endif %}

<div class="section-heading">
  <h2>{{ t.home.projects_heading }}</h2>
  {% if visible_projects.size > 0 %}<a class="section-action" href="{{ '/en/projects/' | relative_url }}">{{ t.home.view_all }}</a>{% endif %}
</div>

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
{% else %}
<p class="muted">{{ t.home.projects_empty }}</p>
{% endif %}

<hr>

<h2>{{ t.home.purpose_heading }}</h2>
<p>{{ t.home.purpose_body }}</p>
