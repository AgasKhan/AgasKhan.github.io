---
title: "Launcher con auto-actualización"
description: "Trabajo de carrera (Da Vinci): launcher/patcher que instala, actualiza y lanza una build de juego — manifiesto de versión remoto, descarga, descompresión y ejecución."
permalink: /es/projects/game-launcher-autoupdater/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Launcher con auto-actualización <span class="tag academic">académico</span></h1>
  <p class="lead">Aplicación Unity tipo <strong>launcher/patcher</strong> que instala, actualiza y ejecuta una build de juego para el usuario final. Resuelve el ciclo completo de distribución: consulta la versión publicada, la compara con la instalada, descarga el paquete, lo descomprime, ubica el ejecutable y lo lanza.</p>
  <div class="chip-row">
    <span class="tag">Unity</span><span class="tag">C#</span><span class="tag">UnityWebRequest</span>
    <span class="tag">System.IO.Compression</span><span class="tag">Coroutines</span><span class="tag">PlayerPrefs</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Proyecto académico</p>
  <p>Trabajo de carrera (Da Vinci). Aborda un problema real —distribuir builds a jugadores sin infraestructura propia— con una solución pragmática. Es distinto al resto de mis proyectos: no es gameplay, es tooling de distribución (I/O, red y ciclo de vida de instalación).</p>
</div>

## Qué hace

- **Auto-actualización por manifiesto.** Compara la versión local contra un manifiesto remoto y solo baja el paquete cuando hay update pendiente, persistiendo ruta, versión y ejecutable con `PlayerPrefs`.
- **Ciclo de instalación completo.** Descarga a `%AppData%`, descompresión del zip a una carpeta versionada, búsqueda recursiva del ejecutable y lanzamiento del proceso — con acciones de instalar / actualizar / desinstalar / jugar en la UI.
- **Descarga desde Google Drive.** Convierte el link de archivo en link directo y parsea el formulario de confirmación de Drive para obtener la URL real del binario, sorteando la pantalla intermedia de descarga.

> El manifiesto y el paquete se alojaron en Google Drive por practicidad del contexto académico. El scraping del formulario de Drive es una solución pragmática, frágil ante cambios de Drive — no infraestructura de producción, y así está encuadrado.

## Qué demuestra

- **I/O y red de bajo nivel** en cliente: descargas, descompresión, manejo de archivos y lanzamiento de procesos.
- Pensar el **ciclo de vida de instalación** completo, no solo la descarga.
- Una **solución pragmática** a un problema de distribución real, con sus límites explícitos.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>proyecto de carrera (Da Vinci) · repo privado</span>
</div>
