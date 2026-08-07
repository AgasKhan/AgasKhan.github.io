---
title: "Nexio — Plataforma SaaS (Tech Lead)"
description: "Plataforma SaaS multi-tenant en producción para inteligencia y gestión de comunidades digitales a través de múltiples canales de mensajería. Tech Lead / Product Engineer: arquitectura y construcción end-to-end."
permalink: /es/projects/nexio-saas-platform/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Nexio — Plataforma SaaS <span class="tag active">activo</span></h1>
  <p class="lead">Producto <strong>SaaS multi-tenant en producción</strong> para analizar y gestionar comunidades digitales a través de <strong>múltiples canales de mensajería</strong> (Discord, Telegram, WhatsApp). Trabajo como <strong>Tech Lead / Product Engineer</strong>: lidero la arquitectura y la construcción end-to-end, del frontend al backend serverless y las integraciones de IA.</p>
  <div class="chip-row">
    <span class="tag">TypeScript</span><span class="tag">React</span><span class="tag">Supabase</span>
    <span class="tag">PostgreSQL</span><span class="tag">Edge Functions (Deno)</span><span class="tag">Node.js</span><span class="tag">IA (Gemini)</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Encuadre</p>
  <p>Nexio es el trabajo principal de mi actividad profesional y un producto en vivo (<a href="https://nexio.land" target="_blank" rel="noopener">nexio.land</a>). Este write-up describe la arquitectura y mi contribución en términos transferibles; no expone datos de negocio, métricas internas ni detalles confidenciales.</p>
</div>

## Arquitectura multi-canal

La plataforma integra tres canales de mensajería (Discord, Telegram, WhatsApp) mediante **adaptadores por canal** que convergen en un mismo modelo de normalización. La consecuencia de diseño importa: **agregar un canal no reescribe el pipeline de análisis** — el pipeline trabaja sobre el modelo normalizado, no sobre las particularidades de cada API.

## Backend serverless multi-tenant

El backend es serverless sobre **Supabase**: PostgreSQL con **Row-Level Security por tenant**, Edge Functions en **Deno** como frontera de autorización, canal Realtime y migraciones versionadas. El aislamiento entre clientes se garantiza **a nivel de base de datos**, no de código de aplicación — la propiedad de seguridad no depende de que cada consulta se acuerde de filtrar.

## Frontera de datos por capas

Definí y hago cumplir una arquitectura de acceso a datos por capas: el frontend **nunca** consulta la base directamente, sino que pasa por un wrapper tipado → edge function → helper de query compartido. Las reglas están **verificadas por lint y CI**: la frontera de autorización queda codificada y el sistema resiste el drift a medida que crece.

## IA con límites auditables

Integré generación de contenido con IA (**Google Gemini**) bajo límites contractuales y auditables. La separación es deliberada: **la IA interpreta y contextualiza, pero las métricas base se calculan de forma determinista en código**. Migré de un gateway legacy a integración directa con el proveedor.

## Proceso y despliegue

- **Despliegue continuo** disciplinado: feature → staging → producción, con promote/backport controlado.
- **Contract-first**: especificaciones versionadas e inmutables — una spec estable no se edita in-place, se versiona. Esto elimina el drift entre documentación y sistema.
- **Gobierno de tareas y specs**: un protocolo liviano con ciclo de vida de estados y gobernanza de ramas, integrado con la documentación del equipo, para que decisiones de arquitectura y trabajo en curso queden trazables.

## Qué demuestra

- **Arquitectura de producto SaaS** multi-tenant en producción, no una prueba de concepto.
- **Tech leadership**: no solo escribir código, sino definir fronteras (seguridad, datos, IA) y hacer que el sistema las mantenga a medida que crece.
- **Full-stack + DevOps**: frontend tipado, backend serverless, integraciones de mensajería e IA, y el pipeline de despliegue que las sostiene.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://nexio.land" target="_blank" rel="noopener">Producto en vivo · nexio.land →</a>
  <span>producto de empleador · en producción</span>
</div>
