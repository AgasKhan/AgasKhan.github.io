---
title: "Plataforma web full-stack en PHP (diagnóstico automotor)"
description: "Años de desarrollo full-stack PHP/MySQL/Apache en producción para una empresa de equipos de diagnóstico automotor: sitio institucional, back-office, gestión de servicio, auth propio y mensajería en tiempo real."
permalink: /es/projects/php-web-platform-automotive/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Plataforma web full-stack en PHP <span class="tag done">terminado</span></h1>
  <p class="lead">Desarrollo <strong>full-stack PHP/MySQL</strong>, a lo largo de <strong>varios años en producción</strong>, del sitio institucional y los sistemas internos de una empresa de equipos de diagnóstico automotor: catálogo, back-office de administración, gestión de servicio técnico, autenticación propia y mensajería en tiempo real.</p>
  <div class="chip-row">
    <span class="tag">PHP 7</span><span class="tag">MySQL (PDO)</span><span class="tag">JavaScript</span>
    <span class="tag">jQuery / AJAX</span><span class="tag">Bootstrap</span><span class="tag">Apache / cPanel</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Encuadre</p>
  <p>Trabajo para un cliente privado (empresa de diagnóstico automotor); este write-up describe solo mi contribución técnica y no expone al cliente ni sus datos de negocio. La señal es concreta: <strong>años reales de PHP/MySQL/Apache sobre un sistema en producción</strong> — el sustrato que respalda mi profundidad web (React, en cambio, es reciente).</p>
</div>

## Sitio institucional y catálogo

Construí y mantuve por años la cara pública y el catálogo: catálogo multiproducto, listas de precios **multi-idioma (ES/EN)**, portal de descargas de software y manuales técnicos, formularios de contacto y de alta de redistribuidores.

## Autenticación propia

Desarrollé un módulo de **auth propio en PHP/MySQL**: registro con activación por email, login, recuperación de contraseña, gestión de sesiones, control de acceso y validaciones de cuenta.

## Back-office de administración

Implementé un back-office para operar el negocio **sin tocar código**: ABM de productos e imágenes, administración de precios y de usuarios, y **gestión de servicio técnico** (seguimiento de reparaciones por técnico, con estados de aceptación y cobro).

## Mensajería en tiempo real

Armé un sistema de **mensajería en tiempo real** en PHP/JavaScript (servidor con polling, envío y lectura de mensajes) para comunicación entre usuarios internos y clientes.

## Base de conocimiento e infraestructura

- Modelé una **base de conocimiento técnico** automotor (fichas de conexionados, base de ECUs, notas técnicas y cursos), sirviendo cientos de documentos y descargas.
- Configuré **tareas programadas (cron)** para envío de mails segmentados y limpieza de datos.
- Administré la infraestructura web: dominios, cPanel, CNAME y subdominios.

## Qué demuestra

- **Web full-stack en producción durante años** — no una prueba de concepto.
- Backend, auth, panel de administración y tiempo real construidos a mano sobre PHP/MySQL.
- El contrapeso concreto a que el stack moderno (React) sea reciente: la base web es de largo recorrido.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <span>cliente privado · sistema interno (no público)</span>
</div>
