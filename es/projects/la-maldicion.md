---
title: La Maldición
description: "Card game competitivo en desarrollo, con build jugable pública en itch.io. Uno de los principales consumidores de los packages de AgasKhan."
permalink: /es/projects/la-maldicion/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>La Maldición: Héroes de Lorthar <span class="tag active">en desarrollo</span></h1>
  <p class="lead">Card game competitivo por turnos, en desarrollo activo. Uno de los principales consumidores de los packages de la biblioteca AgasKhan.</p>
  <p><a href="https://riassogna.itch.io/la-maldicin-hroes-de-lorthar" target="_blank" rel="noopener"><strong>▶ Jugar en itch.io (build WebGL, gratis) ↗</strong></a></p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3</span><span class="tag">C#</span><span class="tag">WebGL</span><span class="tag">Card game</span>
  </div>
</section>

## Estado

En desarrollo activo. Es la adaptación digital oficial de un juego de cartas argentino (juego físico vendido en 40+ tiendas, premio "Mejor juego rompe-amistades" 2022): hasta 4 jugadores, 8 héroes con habilidades asimétricas, modos 1v1 / free-for-all / 2v2. Hay una build WebGL jugable pública en itch.io.

## Relación con los packages

La Maldición es **uno de los consumidores más intensivos** de <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a> — al ser la build más reciente, ejercita las últimas versiones de los packages: valida la biblioteca contra un juego real y consume sólo los necesarios, referenciados por Git URL + tag en `Packages/manifest.json` a medida que se estabilizan. La biblioteca da soporte a **varios proyectos** —no sólo a este—; acá el bucle de feedback entre la biblioteca y un producto jugable en producción se ve especialmente claro.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://riassogna.itch.io/la-maldicin-hroes-de-lorthar" target="_blank" rel="noopener">itch.io ↗</a>
  <span>proyecto de equipo · repo privado</span>
</div>
