---
title: "Consultoría y auditorías Unity"
description: "Consultor técnico sobre ~10 proyectos Unity de otros desarrolladores: auditorías de código, sistemas transversales reutilizables y refactors. La contribución es propia; los juegos son de terceros."
permalink: /es/projects/unity-consulting-audits/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Consultoría y auditorías Unity <span class="tag active">activo</span></h1>
  <p class="lead">Consultor técnico sobre <strong>~10 proyectos Unity de otros desarrolladores</strong>: audito codebases ajenos, implemento sistemas transversales reutilizables y hago fixes y refactors puntuales dentro del código de cada equipo.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">Photon Fusion 2</span>
    <span class="tag">ParrelSync</span><span class="tag">Addressables</span><span class="tag">Editor tooling</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Encuadre</p>
  <p>Todo el material es <strong>código de terceros</strong> (juegos de otros desarrolladores). No soy autor de los juegos: entro como consultor/auditor y contribuyo sistemas, correcciones y documentación dentro del código de cada equipo. Este write-up describe mi contribución, no la IP ajena — no se exponen nombres de juegos ni de sus autores.</p>
</div>

## Qué aporto

- **Sistemas transversales reutilizables**, aplicados en varios proyectos: carga de escenas asincrónica y aditiva con fade y barra de progreso, guardado local, gestión de audio global y localización multi-idioma.
- **Multiplayer con Photon Fusion 2** y flujo de pruebas local con ParrelSync (clon del proyecto para testear en la misma máquina), en proyectos de cartas.
- **Arquitectura y patrones sobre codebases ajenos**: inyección de dependencias, máquinas de estado, sistema de eventos/UI y utilidades reusables; refactors de player/vida y trabajo de concurrencia y paralelismo.
- **Tooling de editor y pipeline**: editor de reproducción de audio, sistema de referencias por bake, configuración de builds Android y shaders.

## El caso más profundo: sistemas + auditoría de un juego en producción

En el engagement más profundo (un juego móvil ya publicado en Android, de otro desarrollador) pasé de consultor puntual a co-desarrollar su capa de servicios y a producir su auditoría técnica canónica:

- **Capa de servicios sobre un codebase ajeno:** carga de escenas aditiva y asincrónica en cola con pantalla de carga y fade, guardado local con soporte de skins, reproductor de audio global e inyección de dependencias.
- **Fixes estructurales de producción:** sincronización y escala de canvas entre escenas, duplicación de audio, carga de niveles desde el game over, visibilidad de partículas y configuración de build Android.
- **Auditoría técnica como entregable:** análisis por capas y patrones, referencia completa de los scripts, inventario de contenido, historial de commits y un plan de fixes priorizado — pensada como onboarding y fuente de verdad del equipo. La documentación se apoyó, honestamente, en mi propio proceso/tooling de análisis.

## Qué demuestra

- Rol de **tech lead / consultor** sobre código que no escribí: leer una arquitectura ajena, mejorarla y dejarla documentada.
- **Sistemas reusables** que resuelven los mismos problemas (carga, guardado, audio, i18n, multiplayer) en varios proyectos distintos.
- La **auditoría técnica** como producto en sí, no solo el código.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>proyectos de clientes/terceros · repos privados</span>
</div>
