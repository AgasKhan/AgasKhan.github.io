---
title: "Pantano Musgoso — demo de juego HTML5 (vendida)"
description: "Demo jugable de un plataformas de acción 2D hecha en Construct 2 y exportada a HTML5, de autoría propia. Validación comercial: la demo fue vendida."
permalink: /es/projects/pantano-musgoso/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Pantano Musgoso <span class="tag done">terminado</span></h1>
  <p class="lead">Demo jugable de un juego de <strong>acción y plataformas 2D</strong> con temática de pantano oscuro, de autoría propia. La construí con <strong>Construct 2</strong> y la exporté como paquete <strong>HTML5</strong> autocontenido, listo para móvil y con soporte offline.</p>
  <div class="chip-row">
    <span class="tag">Construct 2</span><span class="tag">HTML5</span><span class="tag">JavaScript</span>
    <span class="tag">Canvas 2D</span><span class="tag">PWA</span><span class="tag">Game AI</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Validación comercial</p>
  <p>No es un experimento: la demo fue <strong>vendida</strong>. Es prueba concreta de que un juego propio, de concepto a demo terminada, llegó a estado entregable y con valor de mercado. (Juego, diseño y armado son míos; no es consultoría ni código de terceros.)</p>
</div>

## El juego

Un plataformas de acción 2D (run-and-gun) ambientado en un pantano musgoso. La demo trae menú propio (jugar, donaciones, créditos, salir) y un flujo de niveles con transiciones de fundido — una demo acotada de un juego mayor.

## Mecánicas

Implementé las mecánicas centrales en Construct 2:

- **Personaje con estados animados**: idle, correr, saltar, caer y atacar.
- **Combate a distancia**: disparo con gestión de munición.
- **Enemigos con IA de línea de visión** (incluidas arañas), sistema de vida y HUD.

## Ambientación y presentación

- **Iluminación dinámica** de pantano oscuro: luces y sombras con ShadowCaster y penumbra.
- **Física, cámara con scroll** y diseño de sonido (pasos, disparos, loop de fondo y efectos).

## Empaquetado

Exporté el proyecto como paquete **HTML5/JavaScript autocontenido**, corriendo sobre el runtime de Construct 2:

- Preparado para **móvil** en orientación landscape.
- **Soporte offline** vía Web App Manifest + service worker (PWA).

## Qué demuestra

- **Gamedev de autoría propia**, de concepto a demo terminada.
- **Validación comercial real**: la demo fue vendida.
- Manejo del **pipeline web de juegos**: export HTML5, empaquetado para móvil y distribución offline.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>proyecto propio · demo vendida</span>
</div>
