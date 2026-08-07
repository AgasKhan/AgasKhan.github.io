---
title: "Multiplayer de sigilo (freelance)"
description: "Juego multiplayer de sigilo en Unity entregado en ~1 mes. Case study: netcode sobre Photon Fusion 2 + IA de sigilo por sospecha (percepción visual y auditiva)."
permalink: /es/projects/stealth-multiplayer/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Multiplayer de sigilo <span class="tag done">terminado</span></h1>
  <p class="lead">Juego multiplayer de sigilo en tiempo real, hecho para un cliente freelance. Aporté la capa de networking sobre <strong>Photon Fusion 2</strong>, la <strong>IA de enemigos por sospecha</strong> (percepción visual y auditiva) y los sistemas de personaje, percepción e interacción — proyecto completo en aproximadamente un mes.</p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3 LTS</span><span class="tag">C#</span><span class="tag">Photon Fusion 2</span>
    <span class="tag">Jobs / Burst</span><span class="tag">URP</span><span class="tag">Game AI</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Encuadre</p>
  <p>Trabajo para un cliente privado. Este write-up describe solo mi contribución técnica; no expone al cliente ni la temática del juego. Pude entregar el proyecto completo en ~1 mes apoyándome en mi propia librería de sistemas Unity (ver <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a>) — un ejemplo concreto del ROI de tener una base reusable.</p>
</div>

## Netcode sobre Photon Fusion 2

- **Sesiones y lobby:** browser de partidas, modo host/cliente y mínimo de jugadores para arrancar.
- **Jugadores en red:** spawn y sincronización de jugadores, con el input ruteado por los callbacks del network runner.
- **Sincronización de escena con autoridad:** la escena activa se sincroniza en red con autoridad de escena, manteniendo a todos los clientes en el mismo estado de juego.

## Case study: IA de sigilo por sospecha

El corazón del gameplay es una IA de enemigos que **decide cuánto sospecha del jugador** en vez de "verlo o no verlo". Dos piezas la hacen funcionar:

- **Máquina de estados jerárquica.** Super-estados `Relax` / `Alert`, cada uno con sub-estados (patrulla, curiosidad, persecución, evasión, ataque). La jerarquía permite compartir comportamiento entre estados relacionados y transicionar de rama de forma limpia, reutilizando la FSM jerárquica de mi framework.
- **Sistema de sospecha con dos sentidos.** La sospecha se alimenta de:
  - **Percepción visual:** cono de visión con zonas central y periférica, multiplicador según la velocidad del objetivo y umbral por distancia.
  - **Percepción auditiva:** detección de sonidos con memoria y decaimiento, de modo que un ruido reciente sigue pesando un rato aunque ya no suene.

  El nivel de sospecha resultante es el que dispara las transiciones de la máquina de estados: sube con evidencia, decae con el tiempo, y cruza umbrales que llevan al enemigo de patrullar a investigar, perseguir o atacar.

## Sistemas de personaje

El personaje desacopla el **input de la lógica** mediante un mediador de input y un sistema de eventos: sobre esa base implementé levantar y arrojar objetos, y la carga y apuntado de ataque. Reutilicé mi librería (detección de campo de visión, event manager, timers, movimiento/locomoción, object pool) como base común para moverme rápido.

## Qué demuestra

- **Multiplayer / networking** de gameplay en tiempo real con Photon Fusion 2 (sesiones, sincronización, autoridad de escena).
- **Gameplay AI**: percepción multi-sentido (visual + auditiva) alimentando una máquina de estados jerárquica.
- **Velocidad de entrega** apalancada en una arquitectura reusable propia — un proyecto completo en ~1 mes.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/projects/common-package/' | relative_url }}">Ver Common-Package →</a>
  <span>cliente freelance · repo privado</span>
</div>
