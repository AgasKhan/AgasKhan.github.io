---
title: "Compute shaders HLSL en DirectX 11"
description: "Librería C++ para Unity que compila compute shaders HLSL en runtime sobre DX11. Case study: debug de un fallo de GPU silencioso con 3 causas root."
permalink: /es/projects/compute-shaders-dx11/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Compute shaders HLSL en DirectX 11 <span class="tag done">terminado</span></h1>
  <p class="lead">Librería en C++ para Unity que compila <strong>compute shaders HLSL en runtime</strong> sobre DirectX 11, con bindings nativos C++ ↔ C#, un convertidor fragment → compute y build multi-arquitectura (x86 + x64).</p>
  <div class="chip-row">
    <span class="tag">C++</span><span class="tag">DirectX 11</span><span class="tag">HLSL (compute)</span>
    <span class="tag">Unity Native Plugin</span><span class="tag">P/Invoke</span><span class="tag">Reflection</span>
  </div>
</section>

## Contexto

Unity no expone una API estándar para **compilar HLSL en runtime**: los compute shaders se compilan en tiempo de build. Este proyecto resuelve esa limitación con un **plugin nativo en C++** que llama directamente al compilador de DirectX y expone el resultado a C# vía interop.

Se desarrolló como entregable personal en el marco de un curso introductorio de shaders (Image Campus), ampliando el temario. Es el proyecto hermano del <a href="{{ '/es/playground/' | relative_url }}">playground de shaders</a> de este mismo sitio: el descenso desde GLSL/HLSL de alto nivel hasta la API gráfica nativa.

## Arquitectura

- **Pipeline de compilación en runtime.** El plugin C++ recibe el fuente HLSL, invoca el compilador nativo de DirectX (emite `.cso`) y devuelve el bytecode a Unity. Un loader en C# lo levanta por Reflection y llena una `RenderTexture` durante el frame.
- **Convertidor fragment → compute.** Toma un fragment shader y genera automáticamente el compute equivalente con una plantilla (`RWTexture2D<float4> _Result`), de modo que un shader pensado para pantalla se puede correr como pasada de cómputo.
- **Bindings nativos C++ ↔ C#.** `DllImport` + marshalling manual + gestión explícita de memoria nativa. La capa de interop mantiene el ownership claro entre los dos runtimes.
- **Build multi-arquitectura.** Se compila para x86 y x64; la compilación queda restringida a Windows, pero la ejecución corre sobre cualquier GPU DX11/DX12.

## Case study: debug de un fallo de GPU "silencioso"

El síntoma era el peor posible: **pantalla negra intermitente, sin ningún error en el log**. La GPU no se queja cuando escribís a un recurso válido pero equivocado — simplemente produce basura o nada. Sin un mensaje que seguir, el camino fue **por hipótesis**: aislar cada sospecha, reproducir, descartar. Debajo de un único síntoma vivían tres causas independientes.

<ol class="rootcauses">
  <li class="rootcause">
    <h4>UAV recreados por frame</h4>
    <dl>
      <dt>Síntoma</dt><dd>La pasada de cómputo escribía, pero el resultado no aparecía de forma consistente.</dd>
      <dt>Causa</dt><dd>Los <em>Unordered Access Views</em> se recreaban en cada frame, invalidando el estado del pipeline enlazado: el <code>Dispatch</code> terminaba escribiendo contra una vista que ya no era la ligada.</dd>
      <dd class="fix"><strong>Fix:</strong> cachear los UAV entre frames y reusarlos, recreándolos solo cuando cambia el recurso subyacente.</dd>
    </dl>
  </li>
  <li class="rootcause">
    <h4>Race Main ↔ Render thread</h4>
    <dl>
      <dt>Síntoma</dt><dd>Negro que aparecía y desaparecía según el timing — el clásico bug dependiente de carrera.</dd>
      <dt>Causa</dt><dd>El rendering de Unity corre en un <em>render thread</em> propio. Setear las texturas desde el main thread sin sincronizar con el ciclo del render thread hacía que la GPU muestreara un recurso todavía no ligado.</dd>
      <dd class="fix"><strong>Fix:</strong> sincronizar la actualización de recursos con el ciclo del render thread, en vez de asumir que el main thread manda de inmediato.</dd>
    </dl>
  </li>
  <li class="rootcause">
    <h4>Misalignment de Constant Buffer (padding 16-byte)</h4>
    <dl>
      <dt>Síntoma</dt><dd>Parámetros que llegaban al shader en cero o corridos, sin error de compilación.</dd>
      <dt>Causa</dt><dd>Los constant buffers de HLSL empaquetan en registros de 16 bytes. El layout del struct C++/C# no respetaba ese límite, así que el shader leía los campos en offsets equivocados.</dd>
      <dd class="fix"><strong>Fix:</strong> alinear los CBuffers explícitamente para que el layout del lado CPU coincida byte a byte con el que espera la GPU.</dd>
    </dl>
  </li>
</ol>

Tres bugs, un solo síntoma, cero mensajes de error: cada uno era invisible por separado y ninguno se cruzaba con los otros en el log.

## Qué demuestra

- Trabajo a nivel de **API gráfica nativa** (DirectX 11) por debajo del motor.
- Modelo de **interop Unity ↔ código nativo**: marshalling, ownership de memoria, bindings.
- **Concurrencia y memory layout en GPU**: sincronización main/render thread y alineación de buffers.
- Método de debug **por hipótesis** cuando no hay stack trace ni log al que aferrarse.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="{{ '/es/playground/' | relative_url }}">Ver el playground de shaders →</a>
  <span>entregable personal de curso · sin repo público</span>
</div>
