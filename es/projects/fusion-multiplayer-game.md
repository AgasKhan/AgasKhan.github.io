---
title: "Juego 2D multiplayer (Photon Fusion 1)"
description: "Final de Redes (Da Vinci): juego 2D de acción llevado a multiplayer con Photon Fusion 1 (modo Shared), más un pipeline data-driven para autorear ataques y jefes."
permalink: /es/projects/fusion-multiplayer-game/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Juego 2D multiplayer (Photon Fusion 1) <span class="tag academic">académico</span></h1>
  <p class="lead">Trabajo final de la materia Redes: un juego 2D de acción top-down con combate contra jefes, llevado a <strong>multiplayer sobre Photon Fusion 1 en modo Shared</strong>. Demuestra netcode aplicado junto a tooling de editor propio para autorear contenido de forma data-driven.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Photon Fusion 1</span>
    <span class="tag">ScriptableObjects</span><span class="tag">ParrelSync</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Proyecto académico</p>
  <p>Trabajo de carrera (Da Vinci); el objetivo pedagógico era llevar un juego single-player a multiplayer con un framework de networking real. Construí la capa de red y la arquitectura de contenido.</p>
</div>

## Netcode sobre Photon Fusion 1 (Shared mode)

- **Arranque y sesión:** inicialización del `NetworkRunner` en modo Shared y spawn de jugadores con **input authority**.
- **Sincronización de física:** movimiento resuelto con `NetworkRigidbody2D` dentro de `FixedUpdateNetwork`, con separación de **state authority** para que cada cliente mande sobre lo que le corresponde.
- **Pruebas locales:** validación del multiplayer con ParrelSync, clonando el proyecto para correr varias instancias en la misma máquina.

## Pipeline data-driven para diseñadores

Diseñé un pipeline para autorear **ataques, hechizos y patrones de jefes como ScriptableObjects**, con inspectores custom (`CustomEditor`) que le dan al diseñador una interfaz de edición sin tocar código. Sumé además los sistemas de soporte del juego (diálogo, audio, dash, barras de vida).

## Multiplayer cross-stack

Este proyecto aporta **Photon Fusion 1** al abanico de multiplayer que cubro: Fusion 1 acá, <a href="{{ '/es/projects/stealth-multiplayer/' | relative_url }}">Photon Fusion 2</a> en trabajo freelance, y <a href="{{ '/es/projects/reference-demo-games/' | relative_url }}">Netcode for GameObjects + Unity Relay</a> en las demos de referencia.

## Qué demuestra

- **Netcode aplicado**: autoridad de estado/input y sincronización de física en un framework de red real.
- **Tooling de autoría**: contenido data-driven editable por diseñadores.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>proyecto de carrera (Da Vinci) · repo privado</span>
</div>
