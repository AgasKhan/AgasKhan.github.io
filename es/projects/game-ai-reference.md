---
title: "Game AI — implementaciones de referencia"
description: "Trabajo freelance de Game AI: FSM genérica reutilizable, pathfinding any-angle (Theta*) y steering behaviours, con implementaciones de referencia limpias."
permalink: /es/projects/game-ai-reference/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Game AI — implementaciones de referencia <span class="tag active">activo</span></h1>
  <p class="lead">Trabajo freelance de <strong>Game AI en Unity</strong>: diseñé una progresión (fundamentos → steering → máquinas de estado → pathfinding → proyecto integrador) y construí las implementaciones de referencia — código limpio y atento a performance como base de estudio.</p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3 LTS</span><span class="tag">C#</span><span class="tag">FSM genérica</span>
    <span class="tag">Theta* (any-angle)</span><span class="tag">Steering</span><span class="tag">Corrutinas</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Encuadre</p>
  <p>Trabajo para un cliente privado. Este write-up describe la capacidad técnica y las implementaciones, sin exponer datos del cliente. Los bloques descritos son de Game AI reutilizable, alineados con mi librería propia (ver <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a>).</p>
</div>

## Los bloques

- **FSM genérica reutilizable.** Parametrizada por el enum de estado y por el tipo de avatar, desacopla la lógica de cada estado del agente. La misma máquina sirve para un personaje controlable y para NPCs autónomos.
- **Pathfinding any-angle (Theta*).** Sobre una grilla generada proceduralmente con detección de obstáculos. Corre asíncrono por corrutinas para no bloquear el frame, con fallback al nodo transitable más cercano cuando el destino no es alcanzable.
- **Agentes autónomos atentos a performance.** Percepción por cono de visión, persecución, ataque con cooldown, huida a bajo HP y evasión de obstáculos. El escaneo de enemigos y el cálculo de huida se **cachean por intervalo** en vez de recalcularse cada frame.
- **Librería de steering behaviours.** Seek / Flee / Arrive / Pursuit / Evade sobre una abstracción de movimiento con varios backends (CharacterController / Rigidbody / Transform) y un service-locator reactivo con valores observables.

## Qué demuestra

- **Game AI clásica bien implementada**: FSM, pathfinding any-angle y steering, no como recetas sueltas sino como bloques reutilizables.
- **Diseño atento a performance**: cachear percepción por intervalo, pathfinding asíncrono para no frenar el frame.
- Código de **calidad de referencia**: pensado para que otro lo lea y aprenda de él.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/projects/common-package/' | relative_url }}">Ver Common-Package →</a>
  <span>cliente freelance · repo privado</span>
</div>
