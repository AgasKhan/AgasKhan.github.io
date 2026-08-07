---
title: "Nexio — Plataforma SaaS multi-capa (Tech Lead)"
description: "Plataforma SaaS multi-tenant en producción para inteligencia y gestión de comunidades digitales a través de múltiples canales de mensajería. Tech Lead / Product Engineer: arquitectura y construcción end-to-end de un sistema multi-capa (SPA + backend serverless + capa de runtime Node.js a medida + harness de pruebas + simulador de tráfico)."
permalink: /es/projects/nexio-saas-platform/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Nexio — Plataforma SaaS multi-capa <span class="tag active">activo</span></h1>
  <p class="lead">Producto <strong>SaaS multi-tenant en producción</strong> para analizar y gestionar comunidades digitales a través de <strong>múltiples canales de mensajería</strong> (Discord, Telegram, WhatsApp). Trabajo como <strong>Tech Lead / Product Engineer</strong>: lidero la arquitectura y la construcción end-to-end de un <strong>sistema multi-capa</strong> — SPA frontend, backend serverless, una <strong>capa de runtime Node.js a medida</strong>, un harness de pruebas multi-técnica y un simulador de tráfico con ground-truth.</p>
  <div class="chip-row">
    <span class="tag">TypeScript</span><span class="tag">React</span><span class="tag">Supabase</span>
    <span class="tag">PostgreSQL / RLS</span><span class="tag">Edge Functions (Deno)</span><span class="tag">Node.js</span><span class="tag">Baileys / WebSockets</span>
    <span class="tag">IA multi-modelo</span><span class="tag">Playwright</span><span class="tag">DevOps</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Encuadre</p>
  <p>Nexio es el trabajo principal de mi actividad profesional y un producto en vivo (<a href="https://nexio.land" target="_blank" rel="noopener">nexio.land</a>). Este write-up describe la arquitectura y mi contribución en términos transferibles; no expone datos de negocio, métricas internas ni detalles confidenciales.</p>
</div>

## Un sistema multi-capa, no solo un frontend + BaaS

La forma de la arquitectura es lo que la hace interesante. No es una SPA hablando con un backend-as-a-service: es un sistema de varias capas, cada una elegida por lo que sabe sostener y separada de las demás por fronteras explícitas.

- **SPA frontend** tipada (TypeScript / React).
- **Backend serverless** sobre Supabase (PostgreSQL con Row-Level Security, Edge Functions en Deno, Realtime).
- **Una capa de runtime Node.js a medida**, en repo aparte y en host always-on, para lo que un backend serverless no puede sostener.
- **Un harness de pruebas multi-técnica** organizado en lanes.
- **Un simulador de tráfico** que fabrica comunidades sintéticas con ground-truth.
- **Una metodología de proceso propia** que orquesta el trabajo (humano y de agentes de IA) contra contratos versionados.

## Arquitectura multi-canal

La plataforma integra tres canales de mensajería (Discord, Telegram, WhatsApp) mediante **adaptadores por canal** que convergen en un mismo modelo de normalización. La consecuencia de diseño importa: **agregar un canal no reescribe el pipeline de análisis** — el pipeline trabaja sobre el modelo normalizado, no sobre las particularidades de cada API.

## Backend serverless multi-tenant

El backend es serverless sobre **Supabase**: PostgreSQL con **Row-Level Security por tenant**, Edge Functions en **Deno** como frontera de autorización, canal Realtime y migraciones versionadas. El aislamiento entre clientes se garantiza **a nivel de base de datos**, no de código de aplicación — la propiedad de seguridad no depende de que cada consulta se acuerde de filtrar.

## Frontera de datos por capas

Definí y hago cumplir una arquitectura de acceso a datos por capas: el frontend **nunca** consulta la base directamente, sino que pasa por un wrapper tipado → edge function → helper de query compartido. Las reglas están **verificadas por lint y CI**: la frontera de autorización queda codificada y el sistema resiste el drift a medida que crece.

## La capa de runtime Node.js: el porqué

Un backend serverless es de vida corta (request/response): no mantiene bien un **WebSocket persistente** hacia un canal de mensajería ni corre un trabajo de IA de **minutos** sin chocar contra sus límites. Por eso construí una **capa de runtime Node.js long-lived**, en repo aparte, sobre un host always-on (un Droplet de DigitalOcean con IP reservada, TLS por Caddy y supervisión por systemd).

El reparto de responsabilidades es deliberado: **la base de datos es el sistema de registro y el reloj; Node es el músculo.** El runtime ingiere los eventos del canal (WhatsApp vía **Baileys**, un cliente multidevice sobre WebSocket; y el segundo canal por su gateway), corre la detección y generación de IA de larga duración, y devuelve resultados sin ser nunca la autoridad sobre los datos.

## Invariantes verificados mecánicamente

En esta capa, las propiedades de seguridad no dependen de la disciplina de nadie: **están codificadas y las verifica la máquina.**

- **Cero-outbound, con doble barrera.** El runtime nunca emite un mensaje al canal — ni de confirmación ni ante error. Lo garantizan dos capas independientes que deben coexistir: una **regla de lint por selector AST** que falla el build si alguien escribe una llamada de envío, y un **guard en runtime (un Proxy sobre el socket)** que lanza si alguna se invoca de todos modos. El mismo patrón receive-only se aplica al segundo canal.
- **Sin credencial privilegiada en el host.** El runtime **no escribe tablas** y no tiene una credencial de escritura privilegiada: su único camino a la base es una **función-frontera autenticada por secreto compartido**. La validación de entorno es **fail-fast**: rechaza el arranque si detecta en ese host una credencial privilegiada que no debería vivir ahí. La amenaza que se diseñó para eliminar —esa credencial filtrándose en un host expuesto— deja de ser posible por construcción.

## Aislamiento staging / prod por topología

Staging y producción no se separan con flags de código, sino **por topología**: una app/host por rama, cableada por variables de entorno (nada hardcodeado) a su propio proyecto de base de datos. El host de staging solo puede hablar con la base de staging, y el de prod solo con la de prod. La promoción sigue el flujo del resto del sistema (staging → main).

## Disparo de trabajos: la base de datos como reloj

El trabajo de fondo se dispara por un **seam de niveles de cadencia**: un conjunto fijo de heartbeats de cron en la base de datos hace un **POST autenticado** a un único endpoint del runtime, que ejecuta todos los productores vencidos de ese nivel (detección de señales, generación de contenido, clasificación de identidad de miembros). Responde de inmediato y corre en background, para que un job lento con IA no reviente el timeout del cron, y los jobs son **idempotentes** para que un reintento sea un replay benigno. Es un patrón deliberado tras descartar un scheduler en proceso: un timer interno **deriva** en cada reinicio del host.

## IA: routing multi-modelo con fallback y circuit-breaker

Integré la IA como un **router multi-modelo** con fallback entre proveedores (Google Gemini, Anthropic Claude) y **circuit-breaker por modelo**. Las decisiones de diseño son las que importan:

- **La UI pasa solo la intención** de la operación; los **ids de modelo viven server-side** y nunca los ve el cliente.
- El fallback **preserva la calidad**: nunca degrada a un tier inferior para contenido o estrategia.
- Distingue errores **recuperables de no-recuperables** (no inventa una respuesta) y **cuenta el uso una sola vez**.
- La IA **interpreta y contextualiza, pero las métricas base se calculan de forma determinista en código** — la parte auditable no queda a merced del modelo.

## Harness de pruebas multi-técnica

Cada capa se valida con la técnica que le corresponde, organizada en lanes con un principio rector: **la salud del validador está separada de la calidad del producto** (detectar producto malo es un éxito del validador, no un fallo).

- **SQL transaccional (BEGIN/ROLLBACK)** para invariantes de esquema y aislamiento multi-tenant, sin ensuciar la base.
- **Eventos sintéticos (PowerShell)** para los contratos de las funciones-frontera.
- **Python + Playwright** para el E2E de onboarding real.
- **Auditorías de calidad** del contenido y de la narrativa generada por IA contra una **rúbrica versionada**.

## Simulador de tráfico con ground-truth

Para validar el motor de análisis sin operar decenas de cuentas reales, construí un **simulador de tráfico** que fabrica comunidades sintéticas: un **elenco persistente de miembros-arquetipo** alineados a las dimensiones reales que el producto detecta (tipo de usuario, valor estratégico, estados transitorios, intención del mensaje), con IA local (**llama.cpp**) opcional. Cada mensaje se **etiqueta con su intención y sentimiento esperados**, generando el **ground-truth** contra el cual se contrasta qué detectó el análisis.

## Metodología y context-engineering

Formalicé una **metodología de proceso propia**: un protocolo liviano de gobierno de tareas y specs (ciclo de vida de estados, especificaciones congeladas y versionadas —una spec estable no se edita in-place, se versiona— y gobernanza de ramas), integrado con la documentación del equipo para que las decisiones de arquitectura y el trabajo en curso queden trazables.

La extendí a **context-engineering para orquestar agentes de IA por capas**: un hilo orquestador reparte trabajo contra contratos y agentes por dominio devuelven evidencia contra su contrato, con un "estado vivo" del proyecto como primer read obligatorio. Y mantengo un **baseline visual versionado** —capturas fechadas paso a paso del onboarding, **3 canales × 2 idiomas**— para comparar histórico vs. actual y detectar regresiones de UI.

## Qué demuestra

- **Arquitectura multi-capa** de un producto SaaS en producción: elegir la herramienta correcta para cada capa y separarlas por fronteras explícitas, no un monolito ni una SPA + BaaS.
- **Fronteras de seguridad codificadas y verificadas por máquina**: cero-outbound con doble barrera, sin credencial privilegiada, aislamiento por topología — propiedades que no dependen de la disciplina de nadie.
- **Tech leadership**: definir invariantes (seguridad, datos, IA) y hacer que el sistema los mantenga a medida que crece.
- **Rigor de verificación**: un harness multi-técnica y un simulador con ground-truth, con la salud del validador separada de la calidad del producto.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://nexio.land" target="_blank" rel="noopener">Producto en vivo · nexio.land →</a>
  <span>producto de empleador · en producción</span>
</div>
