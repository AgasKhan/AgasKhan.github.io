---
title: "IA de NPCs: FSM por eventos + GOAP"
description: "Final de IA (Da Vinci): framework propio de FSM dirigida por eventos que evoluciona a agentes con planificación GOAP y pathfinding A* multihilo."
permalink: /es/projects/event-fsm-goap-planning/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>IA de NPCs: FSM por eventos + GOAP <span class="tag academic">académico</span></h1>
  <p class="lead">Trabajo final de la materia de IA de la carrera. Un framework propio de <strong>máquina de estados dirigida por eventos</strong> (EventFSM genérica) aplicado al comportamiento de NPCs, que luego evoluciona hacia agentes que combinan FSM, planificación <strong>GOAP</strong> y pathfinding <strong>A* resuelto en multihilo</strong>.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">FSM</span>
    <span class="tag">GOAP</span><span class="tag">A* multihilo</span><span class="tag">Unity.Collections / Mathematics</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Proyecto académico</p>
  <p>Trabajo de carrera (Da Vinci), no un producto comercial. Lo incluyo porque demuestra dominio de arquitecturas de IA de juego, de lo reactivo (FSM) a lo deliberativo (planificación).</p>
</div>

## EventFSM: la base reusable

La entrega base es una **FSM dirigida por eventos y genérica** (`EventFSM<T>`), pensada para reusarse entre proyectos:

- **Estados con ciclo de vida completo:** `Enter` / `Update` / `LateUpdate` / `FixedUpdate` / `Exit`.
- **Transiciones por input:** el estado reacciona a eventos, no a un `switch` gigante.
- **Configurador fluido de transiciones** (`StateConfigurer`): definir qué evento lleva de un estado a otro se lee como una frase, no como boilerplate.

## De reactivo a deliberativo: GOAP + A* multihilo

En un tramo posterior de la carrera, esa misma FSM se integra con un **planner GOAP** y una grilla de **pathfinding A\***: el agente deja de solo reaccionar y empieza a **planificar** cómo alcanzar un objetivo. El cálculo de rutas se resuelve en **multihilo** con `Unity.Collections` / `Unity.Mathematics` para no frenar el hilo principal.

Es el salto de una FSM simple a agentes que planifican, sobre la misma base arquitectónica.

## Qué demuestra

- **Arquitecturas de IA de juego**: FSM por eventos, GOAP y A*, no como recetas sueltas sino como capas que se integran.
- **Diseño reusable**: la FSM genérica es la base común de todo lo demás.
- **Multithreading** aplicado a pathfinding para no comprometer el frame.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>proyecto de carrera (Da Vinci) · repo privado</span>
</div>
