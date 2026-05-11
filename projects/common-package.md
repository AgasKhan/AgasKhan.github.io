---
title: Common-Package
description: Biblioteca personal de utilidades para Unity. Workshop desde el que se publican los packages individuales.
permalink: /projects/common-package/
---

<section class="hero">
  <h1>Common-Package <span class="tag active">activo</span></h1>
  <p class="lead">Biblioteca personal de utilidades para Unity. Es el <em>workshop</em> interno donde se desarrolla y mezcla trabajo en curso; cuando una utilidad madura, se publica como package individual en su propio repo.</p>
</section>

## Filosofía

- **Hybrid repo strategy.** Common-Package es un monorepo de trabajo (privado permanente). Los packages consumibles viven en repos GitHub aislados (`AgasKhan/<Module>`), versionados con semver y consumidos por otros proyectos vía Git URL en `manifest.json`.
- **`com.agaskhan.*` namespace** para todos los packages distribuibles.
- **Unity 2022.3** baseline. Algunos packages soportan Unity 6 con `#if UNITY_6000_0_OR_NEWER`.

## Stats actuales

- **{{ site.data.packages.size }} packages publicados** ([listado completo]({{ '/packages/' | relative_url }})).
- Categorías: Foundation, Engine, Systems, Serialization, Tooling.
- Consumidor principal: [La Maldición]({{ '/projects/la-maldicion/' | relative_url }}).

## Cómo se consumen los packages

En `Packages/manifest.json` del proyecto consumidor:

```json
{
  "dependencies": {
    "com.agaskhan.commoninterfaces": "https://github.com/AgasKhan/CommonInterfaces.git#0.1.0",
    "com.agaskhan.timersmanager": "https://github.com/AgasKhan/TimersManager.git#0.2.0"
  }
}
```

> Importante: UPM no resuelve dependencias transitivas en git URLs. Hay que listar **todas** las dependencias (incluyendo las transitivas) explícitamente en `manifest.json`.

## Roadmap

- Completar migración de los modulos restantes que viven sólo dentro de Common-Package (sin asmdef / package.json).
- Convergencia de namespaces hacia `AgasKhan.<Module>`.
- A futuro: publicación selectiva en Unity Asset Store de los packages más estables.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://github.com/AgasKhan/Common-Package" target="_blank" rel="noopener">github.com/AgasKhan/Common-Package ↗</a>
  <span>repo privado</span>
</div>
