---
title: About
description: Professional summary, technical skills and education.
permalink: /en/about/
---

{% assign t = site.data.i18n[page.lang] %}
{% assign cv = site.data.cv %}
{% assign lang = page.lang %}

<section class="hero">
  <h1><span class="accent">{{ t.about.heading }}</span></h1>
  <p class="lead">{{ t.about.lead }}</p>
  <p style="margin: 14px 0 6px;">
    <a href="{{ '/cv/Lucas_Galardo_CV_Publico_EN.pdf' | relative_url }}" download><strong>⬇ Download CV (short version · PDF)</strong></a>
  </p>
  <p style="font-size: 0.85em; opacity: 0.72; margin-top: 0;">Public short version, without direct contact details (to avoid bots/scrapers). Full CV on request or via <a href="https://linktr.ee/AgasKhan" target="_blank" rel="noopener">Linktree</a>.</p>
</section>

<h2>{{ t.about.profile_heading }}</h2>
<div class="profile-block">
{{ cv.profile[lang] | markdownify }}
</div>

<h2>{{ t.about.skills_heading }}</h2>
<div class="skills">
  {% for grp in cv.skills %}
  <div class="skill-group">
    <h3 class="skill-group-title">{{ grp.group[lang] }}</h3>
    <div class="skill-pills">
      {% for item in grp.items %}<span class="pill">{{ item }}</span>{% endfor %}
    </div>
  </div>
  {% endfor %}
</div>

<h2>{{ t.about.way_of_working_heading }}</h2>
<div class="way-of-working">
{{ cv.way_of_working[lang] | markdownify }}
</div>

<h2>{{ t.about.education_heading }}</h2>
<ul class="education-list">
  {% for edu in cv.education %}
  <li class="education-item">
    <div class="education-head">
      <span class="education-title">{{ edu.title[lang] }}</span>
      <span class="education-period">{{ edu.period }}</span>
    </div>
    <div class="education-institution">{{ edu.institution }}{% if edu.location %} · {{ edu.location }}{% endif %}</div>
    {% if edu.note[lang] != "" %}<div class="education-note">{{ edu.note[lang] | markdownify | remove: "<p>" | remove: "</p>" }}</div>{% endif %}
  </li>
  {% endfor %}
</ul>

<h2>{{ t.about.languages_heading }}</h2>
<ul class="languages-list">
  {% for lng in cv.languages %}
  <li><strong>{{ lng.name[lang] }}:</strong> {{ lng.level[lang] }}</li>
  {% endfor %}
</ul>
