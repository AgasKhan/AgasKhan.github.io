---
title: "Sistema de eventos para level designers"
description: "Producto propio: un sistema de eventos que deja a level designers disparar lógica de juego sin escribir código. Vendido y licenciado a otros desarrolladores."
permalink: /es/projects/event-system-level-designers/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Sistema de eventos para level designers <span class="tag active">producto</span></h1>
  <p class="lead">Sistema de eventos para Unity pensado para que los <strong>level designers definan y disparen lógica de juego sin escribir código</strong>. Es un producto propio, vendido y licenciado a otros desarrolladores.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">ScriptableObjects</span>
    <span class="tag">Editor tooling</span><span class="tag">Reflection</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Validación comercial</p>
  <p>No es un experimento: es un producto <strong>vendido y licenciado</strong> a otros desarrolladores, con <strong>facturación recurrente</strong>. Otros profesionales lo pagan y lo usan en sus propios juegos — la señal más directa de que la tecnología aguanta fuera de mi propio código.</p>
</div>

## Cómo funciona

- **Bus de eventos sobre ScriptableObjects.** Los eventos son assets: un level designer los conecta y dispara desde el editor, sin tocar el código del juego.
- **Comandos por string (consola in-game).** Los eventos se pueden disparar por nombre; el parseo de argumentos se resuelve por reflection sobre los tipos genéricos del evento (`int`, `float`, `bool`, `string`, `Vector2`, `Vector3`), lo que habilita una consola de comandos dentro del juego.
- **DI liviana interna.** Trae un mecanismo de inyección de dependencias simple para resolver las referencias que cada evento necesita.

## Contexto

Es uno de los ~36 sistemas de la suite <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a> (package UPM `com.agaskhan.eventsystem`), promovido a producto por su validación comercial. Empaqueta un patrón conocido (eventos por ScriptableObject) y le suma la capa de comandos que lo lleva a herramienta de diseño de niveles.

## Qué demuestra

- Diseño de **tooling para no-programadores** (DevEx / autoría por diseñadores).
- Un producto con **validación de mercado**: otros desarrolladores pagan por usarlo.
- Reflection y ScriptableObjects aplicados a un problema de autoría real.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/projects/common-package/' | relative_url }}">Ver Common-Package →</a>
  <span>parte de Common-Package · repo privado</span>
</div>
