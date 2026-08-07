---
title: "Conquerhex — tooling de editor"
description: "Juego de estrategia hexagonal (Da Vinci, en equipo). Aporte de Lucas: el tooling de editor, incluido un editor visual de nodos (UIElements GraphView) y extensiones reusables."
permalink: /es/projects/conquerhex/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Conquerhex — precursor mobile de la tesis <span class="tag academic">académico</span></h1>
  <p class="lead">Un juego hex-based para <strong>mobile</strong>, desarrollado como proyecto de carrera <strong>en equipo</strong>. Es el <strong>precursor de la tesis <a href="{{ '/es/projects/arrange-the-heaven/' | relative_url }}">Arrange the Heaven</a></strong>: el mismo concepto, iterado más tarde en el proyecto final. Mi aporte fue técnico: el <strong>tooling de editor</strong>, incluido un editor visual de nodos con UIElements GraphView, más una base de arquitectura reusable.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Mobile</span>
    <span class="tag">UIElements</span><span class="tag">GraphView</span><span class="tag">URP</span><span class="tag">ScriptableObjects</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Proyecto académico · en equipo</p>
  <p>Trabajo de carrera (Da Vinci) hecho en equipo: hubo colaboradores a cargo del arte y el contenido. Mi rol fue de <strong>programador</strong>, con el peso puesto en la arquitectura y el tooling de editor — no en el arte ni el diseño de niveles. Conquerhex es la <strong>versión anterior, para mobile</strong>, del concepto que más tarde se convirtió en la tesis <a href="{{ '/es/projects/arrange-the-heaven/' | relative_url }}">Arrange the Heaven</a>: muestra la iteración sobre una misma idea a lo largo de la carrera.</p>
</div>

## Editor visual de nodos (UIElements GraphView)

La pieza técnica más visible es un **editor de grafo** para autorear lógica de forma gráfica, construido sobre UIElements GraphView: ventana propia, vista de grafo, nodos y buscador. En vez de configurar lógica a mano en el inspector, el equipo la arma conectando nodos.

## Extensiones de editor y arquitectura

- **Batería de extensiones de editor reusables:** property drawers custom, inspectores por tipo, resaltado de jerarquía, post-procesado de assets y shaders, y una render feature URP a cámara — todo pensado para acelerar el trabajo del equipo.
- **Base de arquitectura:** una FSM abstracta con contenedores y estados reusables, separando la arquitectura del contenido concreto del juego.

> El proyecto usa el package de terceros CrashKonijn (GOAP) además del código propio; el editor de nodos y las extensiones de editor son desarrollo propio.

## Qué demuestra

- **Dominio del editor de Unity**: UI Toolkit / GraphView, property drawers, ventanas y post-procesado de assets.
- **DevEx para un equipo**: herramientas que le ahorran trabajo a los demás integrantes.
- **Trabajo en equipo** con un rol técnico claro y acotado.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/projects/arrange-the-heaven/' | relative_url }}">Ver la evolución: Arrange the Heaven →</a>
  <span>proyecto de carrera en equipo (Da Vinci) · repo privado</span>
</div>
