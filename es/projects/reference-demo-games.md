---
title: "Juegos-demo de referencia"
description: "Juegos-demo completos, de autoría propia, que construyo como implementaciones de referencia para enseñar arquitectura y patrones: action-adventure, tácticas por turnos multiplayer y un demo 3D."
permalink: /es/projects/reference-demo-games/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Juegos-demo de referencia <span class="tag active">activo</span></h1>
  <p class="lead">Juegos-demo completos, de <strong>autoría propia</strong>, que construyo de punta a punta como implementaciones de referencia para enseñar arquitectura y patrones en cursos avanzados de Unity: base jugable y código modelo del que parten los alumnos.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Netcode for GameObjects</span>
    <span class="tag">Unity Relay</span><span class="tag">NavMesh</span><span class="tag">ScriptableObjects</span>
  </div>
</section>

## Las demos

<div class="module-grid">
  <div class="module">
    <h4>Action-adventure top-down</h4>
    <p>Estilo Zelda: FSM de enemigos (Patrol / Wander / Chase), patrón Memento para el guardado de estado, save system binario sobre ScriptableObjects, gestor de idiomas y sistemas de cámara.</p>
  </div>
  <div class="module">
    <h4>Tácticas por turnos multiplayer</h4>
    <p>Juego de tácticas sobre grid con multiplayer: <strong>Netcode for GameObjects + Unity Relay</strong>, sistema de turnos, tropas y HP.</p>
  </div>
  <div class="module">
    <h4>Demo 3D de acción</h4>
    <p>IA de enemigos sobre NavMesh (perseguidores, guerreros, torretas y proyectiles), knockback, checkpoints y barra de vitalidad.</p>
  </div>
</div>

Todas se apoyan en mi librería reusable de sistemas Unity (ver <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a>), reforzando en clase el valor de una base de código compartida y bien arquitecturada.

## Multiplayer cross-stack

Entre estas demos y el resto de mis proyectos, el multiplayer cubre varios stacks según el caso: **Netcode for GameObjects + Unity Relay** acá, **Photon Fusion 2** en el <a href="{{ '/es/projects/stealth-multiplayer/' | relative_url }}">juego de sigilo</a> y en la <a href="{{ '/es/projects/unity-consulting-audits/' | relative_url }}">consultoría</a>, y **Photon Fusion 1** en un <a href="{{ '/es/projects/fusion-multiplayer-game/' | relative_url }}">final de Redes</a>.

## Qué demuestra

- **Amplitud**: distintos géneros y sistemas (action-adventure, tácticas por turnos, acción 3D) resueltos de punta a punta.
- **Arquitectura de calidad de referencia**: código pensado para ser leído y estudiado.
- Enseñar **con código modelo**, no solo con teoría.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/projects/common-package/' | relative_url }}">Ver Common-Package →</a>
  <span>material didáctico interno · sin build público</span>
</div>
