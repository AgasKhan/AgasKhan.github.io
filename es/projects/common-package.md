---
title: Common-Package
description: "Suite de sistemas Unity de producción reusables (varios vendidos/licenciados a otros devs, con facturación recurrente). El workshop del que salen los sistemas individuales."
permalink: /es/projects/common-package/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Common-Package <span class="tag active">activo</span></h1>
  <p class="lead">Suite de sistemas Unity de <strong>producción</strong> reusables que construyo y mantengo desde 2021. Varios los <strong>vendo y licencio a otros desarrolladores</strong>, con facturación recurrente. Es el <em>workshop</em> interno del que se publican los sistemas individuales.</p>
  <div class="chip-row">
    <span class="tag">Unity 2022.3</span><span class="tag">C#</span><span class="tag">Burst</span>
    <span class="tag">Jobs</span><span class="tag">Source Generators</span><span class="tag">DirectX 11</span>
  </div>
</section>

<div class="callout">
  <p class="callout-title">Validación comercial</p>
  <p>No es un side project: varios de estos sistemas los vendo y licencio a otros desarrolladores, con <strong>facturación recurrente</strong> — por ejemplo, un <a href="{{ '/es/projects/event-system-level-designers/' | relative_url }}">sistema de eventos para level designers</a> que sigue facturando, entre otros. Otros profesionales pagan por esta tecnología y la usan en sus propios juegos.</p>
</div>

<div class="statline">
  <div class="stat"><span class="num">~36</span><span class="lbl">sistemas reusables</span></div>
  <div class="stat"><span class="num">18</span><span class="lbl">packages UPM publicados</span></div>
  <div class="stat"><span class="num">2021→</span><span class="lbl">en producción y mantenimiento</span></div>
  <div class="stat"><span class="num">100%</span><span class="lbl">autoría propia</span></div>
</div>

## Filosofía

- **Estrategia hybrid-repo.** Common-Package es un monorepo de trabajo (privado permanente). Los packages consumibles viven en repos GitHub aislados (`AgasKhan/<Módulo>`), versionados con semver y consumidos por otros proyectos vía Git URL en `manifest.json`.
- **Namespace `com.agaskhan.*`** para todos los packages distribuibles.
- **Unity 2022.3** como baseline; algunos packages soportan Unity 6 con `#if UNITY_6000_0_OR_NEWER`.
- Sistema de tareas **issues-first** (GitHub Issues + project board) e ingeniería de contexto propia en `Assets/Context/` (estado en issues, razonamiento en docs, convenciones en `memory/` tipada).

## Módulos destacados

De los ~36 sistemas, esta es una selección por profundidad técnica. Cada uno tiene su propio `.asmdef` y se publica como package independiente (18 ya publicados como packages UPM formales — semver, repos aislados, tests, licencia propietaria) cuando se estabiliza:

<div class="module-grid">
  <div class="module">
    <h4>SystemEngineUpdate</h4>
    <p>Player loop custom sobre el <code>PlayerLoop</code> nativo de Unity, con fases extendidas (Pre/Post Update, LateUpdate, FixedUpdate, EndUpdate) y auto-discovery de sub-systems vía atributo <code>[EngineSubSystem]</code> + reflection.</p>
  </div>
  <div class="module">
    <h4>GPUInstancing</h4>
    <p>Render batch de N instancias con <code>Graphics.RenderMeshInstanced</code>. El llenado del <code>NativeArray</code> combina <code>Parallel.For</code> + punteros <code>unsafe</code> + Jobs&nbsp;+&nbsp;Burst, y cruza a paralelo a partir de un threshold.</p>
  </div>
  <div class="module">
    <h4>FSM jerárquica</h4>
    <p>Máquina de estados clásica + jerárquica que computa el <strong>Lowest Common Ancestor</strong> en runtime para disparar <code>OnExit</code>/<code>OnEnter</code> en el orden correcto al cambiar de rama.</p>
  </div>
  <div class="module">
    <h4>DataStructure · Heap</h4>
    <p>Priority queue con mapa de índices interno que habilita <code>DecreaseKey</code>/<code>IncreaseKey</code> en O(log n) — lo que baja Dijkstra/A* a O(E&nbsp;log&nbsp;V). Más FastDictionary, Pictionarys serializables e intrusive linked lists.</p>
  </div>
  <div class="module">
    <h4>Lite-DependencyInjection</h4>
    <p>DI liviana por <strong>code generation</strong>: un <code>AssetPostprocessor</code> escanea el <code>AppDomain</code>, detecta <code>[DefaultDependency]</code> por reflection y emite las clases resueltas en <code>Generated/</code>.</p>
  </div>
  <div class="module">
    <h4>JobManager</h4>
    <p>Orquestador de <code>JobHandle</code> con callbacks de completado y dispose automático (soporta <code>IJob</code>, <code>IJobFor</code>, <code>IJobParallelFor</code>, <code>IJobParallelForTransform</code>), sin que el caller tenga que llamar <code>Complete()</code>.</p>
  </div>
  <div class="module">
    <h4>TypeSelector</h4>
    <p><code>System.Type</code> serializable con <code>PropertyDrawer</code> UI Toolkit sobre genéricos abiertos, más una variante que instancia un wrapper polimórfico por <code>SerializeReference</code>.</p>
  </div>
  <div class="module">
    <h4>CommonScaffolder</h4>
    <p>EditorWindow que genera la estructura completa de un módulo nuevo desde templates, con registry de generadores — incluido un meta-tool que genera generadores.</p>
  </div>
  <div class="module">
    <h4>Movement / Steerings</h4>
    <p>Locomotion uniforme sobre Transform/Rigidbody2D/3D/CharacterController + 7+ steering behaviours clásicos (Seek, Flee, Pursuit, Evade, Arrive, ObstacleAvoidance).</p>
  </div>
</div>

Otros módulos: <a href="{{ '/es/projects/event-system-level-designers/' | relative_url }}">EventManager</a> (bus de eventos ScriptableObject con parser de comandos, también vendido como producto), TimersManager, CameraPlus (stack de modificadores priorizado), ObjectPool circular, CrossSceneReference, DebugPrint / DebugDraw, AutoSaveSystem, LenguageSystem. El <a href="{{ '/es/packages/' | relative_url }}">listado de packages publicados</a> tiene el detalle instalable.

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

> UPM no resuelve dependencias transitivas en git URLs: hay que listar **todas** las dependencias (incluidas las transitivas) explícitamente en `manifest.json`.

## Consumo real y roadmap

- Consumidor principal: <a href="{{ '/es/projects/la-maldicion/' | relative_url }}">La Maldición</a>, que referencia sólo los packages que necesita a medida que se estabilizan.
- Roadmap: convergencia de namespaces hacia `AgasKhan.<Módulo>` y publicación selectiva en Unity Asset Store de los más estables.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/packages/' | relative_url }}">Ver packages publicados →</a>
  <span>repo privado</span>
</div>
