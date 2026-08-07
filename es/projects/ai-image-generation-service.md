---
title: "Servicio de generación de imágenes por IA — orquestación de GPU local + pipeline de LoRA"
description: "Servicio multiusuario de generación de imágenes por IA: orquestación de un motor de difusión local sobre una sola GPU, cola por GPU, ciclo de vida del proceso de inferencia, pipeline de entrenamiento de LoRA y bot de Discord como gateway. Montado de punta a punta."
permalink: /es/projects/ai-image-generation-service/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Servicio de generación de imágenes por IA <span class="tag active">activo</span></h1>
  <p class="lead">Diseñé, monté y opero un <strong>servicio multiusuario de generación de imágenes por IA</strong> que corre <strong>100% local sobre una sola GPU</strong>. Un <strong>bot de Discord</strong> actúa como gateway a un motor de difusión, con cola por GPU, gestión del ciclo de vida del proceso de inferencia y un <strong>pipeline de entrenamiento de LoRA</strong> por personaje. Monté toda la estructura de punta a punta, yo solo.</p>
  <div class="chip-row">
    <span class="tag">Node.js</span><span class="tag">discord.js v14</span><span class="tag">stable-diffusion.cpp (CUDA)</span>
    <span class="tag">Python / PyTorch</span><span class="tag">kohya-ss (LoRA)</span><span class="tag">RTX 3090</span><span class="tag">Orquestación</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Encuadre</p>
  <p>Lo mostrable acá es la <strong>ingeniería</strong>: convertir una PC con una única GPU en un servicio de generación compartido y multiusuario, con la orquestación, el pipeline y el tooling que eso exige. El dominio es la generación de imágenes de personajes de contenido para adultos. Monté toda la estructura solo — infraestructura, orquestación y sistema de tareas — de la idea al servicio en operación. No se muestra output ni se linkea el repo (privado).</p>
</div>

## Orquestación de GPU local

El bot es la capa de orquestación; la IA corre **100% local**, sin depender de APIs de terceros. Sobre una única placa (**RTX 3090**) construí:

- **Cola FIFO de un solo slot** ajustada a una sola GPU: serializa el trabajo pesado para que la placa nunca se sature.
- **Rate-limiting por usuario** (token bucket), para repartir el recurso compartido de forma justa.
- **Composición de prompt por capas** (personaje + escenario + defaults) y **archivo de cada generación** con metadata completa en sidecar JSON.

## Ciclo de vida del proceso de inferencia

El motor de difusión corre como **proceso hijo**, y su ciclo de vida es donde vive la robustez del servicio:

- **Spawn / reuse / kill** del servidor de inferencia según demanda.
- **Health-check por HTTP** antes de rutear trabajo.
- **Timeouts con `AbortController`** para no colgar la cola.
- **Detección de procesos huérfanos** al arrancar (Windows) y **apagado ordenado** ante señales.

## Pipeline de entrenamiento de LoRA

Para lograr **identidad consistente** entre generaciones, monté un pipeline de entrenamiento de LoRA por personaje:

- **kohya-ss / sd-scripts** sobre PyTorch/CUDA, con setup reproducible.
- Verificación de que el build corre en **GPU y no en CPU** (un error silencioso caro de detectar).

## Generador de datasets de identidad consistente

Escribí un generador de **datasets sintéticos**: fija la identidad de un personaje vía **embedding de rostro (IP-Adapter FaceID)** y varía pose, escena y encuadre para producir la diversidad que un LoRA necesita — emitiendo progreso parseable por el proceso orquestador.

## Multi-arquitectura

Soporté múltiples arquitecturas de difusión (**SD1.5, SDXL, Flux**) usando pesos **cuantizados (gguf)** para entrar en la VRAM disponible.

## Ingeniería de proceso

Todo el trabajo se organiza con un **sistema de tareas por issues** (GitHub), issues-first. La estructura completa — infra, orquestación, pipeline y tooling — la levanté solo.

## Qué demuestra

- **Orquestación de sistemas** sobre recursos escasos: convertir una sola GPU en un servicio compartido y multiusuario, estable.
- **Ciclo de vida de procesos** y robustez operativa (spawn/reuse/kill, health-check, timeouts, huérfanos, apagado ordenado).
- **Pipeline de ML aplicado**: entrenamiento de LoRA + generación de datasets, integrados en un flujo automatizado.
- **Ownership de punta a punta**: de la idea al servicio en operación, montado en solitario.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>proyecto personal · repo privado</span>
</div>
