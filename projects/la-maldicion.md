---
title: La Maldición
description: Esta página se movió. This page moved.
permalink: /projects/la-maldicion/
sitemap: false
---

{% comment %} Legacy language-neutral URL kept as a redirect so old links don't break.
Canonical pages are now bilingual: /es/projects/la-maldicion/ and /en/projects/la-maldicion/. {% endcomment %}

<section class="hero">
  <h1>La Maldición: Héroes de Lorthar</h1>
  <p class="lead">Esta página se movió · This page moved.</p>
  <p>
    <a href="{{ '/es/projects/la-maldicion/' | relative_url }}">Ver en español →</a> ·
    <a href="{{ '/en/projects/la-maldicion/' | relative_url }}">View in English →</a>
  </p>
</section>

<script>
  (function () {
    var lang = 'es';
    try { lang = (window.localStorage.getItem('lang') || (navigator.language || 'es')).slice(0, 2); } catch (e) {}
    if (lang !== 'en') { lang = 'es'; }
    window.location.replace('{{ '/' | relative_url }}' + lang + '/projects/la-maldicion/');
  })();
</script>
