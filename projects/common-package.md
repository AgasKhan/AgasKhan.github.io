---
title: Common-Package
description: Esta página se movió. This page moved.
permalink: /projects/common-package/
sitemap: false
---

{% comment %} Legacy language-neutral URL kept as a redirect so old links don't break.
Canonical pages are now bilingual: /es/projects/common-package/ and /en/projects/common-package/. {% endcomment %}

<section class="hero">
  <h1>Common-Package</h1>
  <p class="lead">Esta página se movió · This page moved.</p>
  <p>
    <a href="{{ '/es/projects/common-package/' | relative_url }}">Ver en español →</a> ·
    <a href="{{ '/en/projects/common-package/' | relative_url }}">View in English →</a>
  </p>
</section>

<script>
  (function () {
    var lang = 'es';
    try { lang = (window.localStorage.getItem('lang') || (navigator.language || 'es')).slice(0, 2); } catch (e) {}
    if (lang !== 'en') { lang = 'es'; }
    window.location.replace('{{ '/' | relative_url }}' + lang + '/projects/common-package/');
  })();
</script>
