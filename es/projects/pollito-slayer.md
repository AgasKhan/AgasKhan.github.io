---
title: Pollito Slayer
description: "Boss-rush brawler publicado en s&box (Source 2 / C#), con build jugable pública. Trece sistemas de la biblioteca AgasKhan portados de Unity a otro motor sostienen el juego completo."
permalink: /es/projects/pollito-slayer/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Pollito Slayer <span class="tag active">publicado</span></h1>
  <p class="lead">Boss-rush brawler de un jugador, desarrollado para la s&amp;box Game Jam III sobre el tema <em>"One More Round"</em>. Es mi primer título publicado fuera de Unity.</p>
  <p><a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener"><strong>▶ Jugar en s&amp;box (gratis) ↗</strong></a></p>
  <div class="chip-row">
    <span class="tag">s&amp;box</span><span class="tag">Source 2</span><span class="tag">C# / .NET</span><span class="tag">Boss-rush</span><span class="tag">Game jam</span>
  </div>
</section>

## Qué es

Un pollito recién nacido se calza guantes de boxeo y devuelve al mar oleadas de mamíferos acuáticos. Los dinosaurios los expulsaron al océano hace eras; ellos se adaptaron y esperaron. El pollito es lo que queda de aquella estirpe.

Juego completo de un jugador: combate cuerpo a cuerpo, oleadas por rondas, jefes, desbloqueables y marcador. Desarrollado en dieciocho días, del 7 al 25 de septiembre de 2026, como único programador del proyecto.

## El motor no era el mío

s&box es el motor de Facepunch (los de Garry's Mod y Rust): C#/.NET sobre Source 2. No comparte API, unidades ni convenciones con Unity: las distancias van en pulgadas, el eje vertical es Z y el sandbox restringe qué partes de .NET se pueden usar.

Es el segundo proyecto que hago ahí, y el primero que se publica.

## La biblioteca cruzó de motor

Trece sistemas de <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a>, mi biblioteca escrita para Unity, entraron a este proyecto y sostienen el juego que se publicó: percepción de agentes, IA de enemigos, máquina de estados, pooling de objetos, temporizadores, bus de eventos, estructuras de datos y utilidades de logging y de fundido.

Eso es lo que este proyecto demuestra mejor que cualquier explicación de arquitectura: **el núcleo escrito en C# puro, con el motor en el borde, transfiere.** No hubo que reescribir la lógica de decisión de los enemigos ni la de percepción para cambiar de Unity a Source 2; hubo que escribir la capa delgada que los conecta al motor nuevo.

Otros tres sistemas se extrajeron a packages propios durante este desarrollo, con su origen en proyectos anteriores: percepción de agentes, el cerebro intercambiable del personaje y la FSM de enemigos por bandas de distancia. El bucle va en las dos direcciones: la biblioteca sostiene al juego, y el juego empuja a la biblioteca.

## Cómo se sostuvo el ritmo

El repositorio cierra con **126 archivos de tests unitarios** que corren sin abrir el editor ni el juego. Es la contrapartida práctica de tener el núcleo desacoplado del motor: la lógica de percepción, de decisión y de temporización se verifica en segundos, y el tiempo de jam se gasta en jugar el juego, no en volver a comprobar a mano lo que ya funcionaba.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener">Jugar en s&amp;box ↗</a>
  <span>trabajo por contrato para Del Bueno Games · repo privado</span>
</div>
