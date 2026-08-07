---
title: "Arrange the Heaven"
description: "RPG procedural en Unity (proyecto final de carrera). Case study: miles de objetos en escena sin caídas de framerate, con cómputo en paralelo (Jobs) + GPU instancing."
permalink: /es/projects/arrange-the-heaven/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Arrange the Heaven <span class="tag done">terminado</span></h1>
  <p class="lead">RPG procedural en Unity, proyecto final de la carrera (Da Vinci), desarrollado en equipo. Integra generación procedural, IA modular (FSM / Steering / GOAP) y rendering custom URP como showcase de arquitecturas reusables propias.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">URP</span>
    <span class="tag">Jobs System</span><span class="tag">GOAP / FSM / Steering</span>
  </div>
</section>

## Contexto

Proyecto final de carrera, hecho en equipo (rol de Lucas: programador y diseñador). El juego reúne generación procedural, IA modular y rendering custom, pero su valor técnico no está tanto en el juego como en las **arquitecturas reusables** que se desarrollaron en paralelo durante la carrera y que fueron su banco de pruebas. Muchas de esas piezas viven hoy consolidadas en <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a>. El concepto tampoco nació con la tesis: tiene un precursor mobile, <a href="{{ '/es/projects/conquerhex/' | relative_url }}">Conquerhex</a>, iterado antes en la carrera.

## Case study: miles de objetos en escena sin caídas de framerate

El desafío: mostrar y manejar **miles de objetos** en pantalla a la vez, cada frame, sin que el framerate se caiga. Hacerlo de la forma ingenua —recorrer todo en el hilo principal— frena el juego apenas escala la cantidad.

La solución reparte el trabajo según lo que cada parte permite:

- **Cómputo en paralelo (Jobs System):** decidir el estado de cada objeto es puro cálculo sobre datos, sin tocar la API de Unity, así que se reparte entre todos los núcleos del CPU.
- **Render masivo con GPU instancing:** los objetos que comparten malla y material se dibujan en lote, bajando la carga de rendering.
- **Solo lo imprescindible en el main thread:** la API de `Transform`/`GameObject` de Unity **no es thread-safe**, así que la operación atada al motor (activar/desactivar cada objeto con `SetActive`) queda en el hilo principal — y nada más.

En números concretos, esto sostiene el encendido/apagado de **4.096 GameObjects** por frame: el cálculo pesado corre en paralelo, el render se apoya en GPU instancing, y el hilo principal hace solo lo que está obligado a hacer, en vez de resolver todo secuencialmente.

## Qué demuestra

- **Performance engineering a escala** en escenas masivas.
- Manejo consciente de las **restricciones de thread-safety** de Unity: qué se puede paralelizar y qué no.
- Diseño de **arquitecturas modulares reusables** (FSM / Steering / GOAP, rendering custom) pensadas para vivir más allá de un solo proyecto.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/projects/common-package/' | relative_url }}">Ver Common-Package →</a>
  <span>proyecto de equipo · repo privado</span>
</div>
