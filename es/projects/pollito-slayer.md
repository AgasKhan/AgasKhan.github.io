---
title: Pollito Slayer
description: "Boss-rush brawler publicado en s&box (Source 2 / C#), con build jugable pública y diez versiones en producción. Un cardumen de 47.000 sardinas dibujadas por instancia, cuatro jefes, y trece sistemas de la biblioteca AgasKhan portados de Unity a otro motor."
permalink: /es/projects/pollito-slayer/
---

<p class="crumbs"><a href="{{ '/es/projects/' | relative_url }}">← Volver a proyectos</a></p>

<section class="hero">
  <h1>Pollito Slayer <span class="tag active">publicado</span></h1>
  <p class="lead">Boss-rush brawler de un jugador, desarrollado para la s&amp;box Game Jam III sobre el tema <em>"One More Round"</em>. Es mi primer título publicado fuera de Unity, y el proyecto del que más orgulloso estoy: un juego entero, jugándose en público, construido y corregido a la vista de la gente.</p>
  <p><a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener"><strong>▶ Jugar en s&amp;box (gratis) →</strong></a></p>
  <div class="chip-row">
    <span class="tag">s&amp;box</span><span class="tag">Source 2</span><span class="tag">C# / .NET</span><span class="tag">Boss-rush</span><span class="tag">Game jam</span><span class="tag">Rendimiento</span><span class="tag">Shaders</span>
  </div>
</section>

<figure class="shot">
  <img src="{{ '/assets/img/pollito-slayer/orca-escala.webp' | relative_url }}"
       width="1600" height="900" decoding="async" fetchpriority="high"
       alt="Una orca con sombrero fedora ocupa media pantalla. Sobre la arena, diminuto en comparación, el pollito con su guante de boxeo rojo. Al fondo, la valla con la tribuna de sardinas y el mar.">
  <figcaption>Orca Nostra. El pollito está abajo, con el guante rojo.</figcaption>
</figure>

## Qué es

Un pollito recién nacido se calza guantes de boxeo y devuelve al mar oleadas de mamíferos acuáticos. Los dinosaurios los expulsaron al océano hace eras; ellos se adaptaron y esperaron. El pollito es lo que queda de aquella estirpe.

El chiste es que el pollito se toma completamente en serio, y el juego también: nada en la presentación guiña. Esa fue la regla de tono que sostuve todo el desarrollo, porque en el momento en que el juego se ríe de sí mismo el pollito deja de ser un guerrero y pasa a ser una mascota.

Juego completo de un jugador: combate cuerpo a cuerpo, trece rondas, cuatro jefes que vuelven transformados, desbloqueables, logros y tabla de posiciones. Dieciocho días de jam, del 7 al 25 de septiembre de 2026, y las versiones que siguieron: **diez publicadas hasta la 0.4.1 del 28 de septiembre**. Único programador del proyecto.

## El motor no era el mío

s&box es el motor de Facepunch (los de Garry's Mod y Rust): C#/.NET sobre Source 2. No comparte API, unidades ni convenciones con Unity: las distancias van en pulgadas, el eje vertical es Z y el sandbox restringe qué partes de .NET se pueden usar: `System.IO` y `Console` no existen, y todo pasa por las APIs del motor.

Es el segundo proyecto que hago ahí, y el primero que se publica.

## Publicar mientras se construye, no después

La jam se vota con nominaciones que se acumulan **mientras se construye**: un juego jugable subido temprano junta nominaciones durante semanas, y uno subido el último día junta cero. Eso no es un detalle del reglamento: es lo que decidió cómo construí el juego.

Elegí subir algo jugable pronto e iterar en público. Ante la duda entre agregar una feature y dejar jugable lo que ya había, gana lo jugable, siempre. En cuatro días publiqué siete entradas de changelog cubriendo diez versiones, cada una con lo que cambió y por qué.

Lo que aprendí ahí y no esperaba: **el changelog es lo primero que lee el que llega**, y decir lo que no se cumplió es lo que lo hace creíble. Una de las entradas abre reconociendo que la anterior había dado por arreglado algo que no lo estaba. Dos llevan el nombre del jugador cuyo reporte las originó. Varias mejoras salieron directo de ahí: el volumen de la campana, la caída de cuadros, la duración de la ronda final, el parry que no daba respuesta.

## El juego se trababa el 12 % del tiempo y el contador de cuadros decía que todo estaba bien

Este es el problema que más me enseñó del proyecto, porque el instrumento obvio decía que no existía.

Cubrirse contra el cardumen se sentía mal. El contador de fps no mostraba nada: **no se perdía un solo cuadro**.

Lo que pasaba es que cada golpe que la guardia aguantaba disparaba un *hitstop* de 0,03 segundos, que es el freno de tiempo que le da peso a un impacto. El cardumen puede meter hasta cuatro impactos por segundo, y el freno no se acumula pero **se renueva**: cada impacto vuelve a poner el resto entero. Cubrirse dejaba el mundo corriendo frenado **el 12 % del tiempo**.

El fps estaba perfecto porque los cuadros se dibujaban todos. Lo que se había ido al suelo era el tiempo del juego, no el del render. Medirlo pedía preguntarle otra cosa: no cuántos cuadros por segundo, sino **a qué porcentaje de la velocidad real avanzaba el mundo**.

El arreglo de fondo fue decidir que **bloquear no congela nada**: ese freno quedó en cero. Un golpe que la guardia aguanta es precisamente el que no tiene por qué interrumpir el juego.

Y de paso le cambié la naturaleza al efecto en todos los demás. La escala del freno estaba en 0,05, el 5 % de la velocidad normal, que no es un freno sino una pausa; pasó a 0,35, la misma del arco del jefe volando al mar. Lo contraintuitivo es que **cuesta menos, no más**: en el peor caso el juego pasó de correr al 84,8 % de su velocidad al 89,6 %. Y el golpe recibido sin guardia, que es el que sí tiene que doler, bajó de 0,08 a 0,04 segundos: del 32 % del tiempo frenado al 16 %.

Me quedó una regla de eso: **cuando algo se siente mal y el instrumento dice que está bien, el instrumento está midiendo otra cosa.**

## El mar contestaba cuarenta y seis mil veces por cuadro

Desde la ronda 5 el juego caía a 36 fps en cualquier PC, incluso en máquinas a las que debería sobrarles.

La causa estaba en el cardumen. Cada sardina que viajaba desde el mar hacia la tribuna le preguntaba al mar su altura y su borde, y **cada una de esas preguntas reconstruía una transformación y una rotación desde cero**. Con decenas de miles de sardinas en viaje, eran unas 46.000 consultas por cuadro para responder algo que es idéntico para todas: el mar, en un cuadro dado, está donde está.

Pasé a calcular el estado del mar **una vez por cuadro** y que todos lean ese resultado. De 29,3 ms a 18,6 ms por cuadro. Los cuadros que pasaban de 33 ms, el umbral donde el tirón se nota, bajaron **de 42 a 2**, y la medición se hizo con más carga de la que el juego llega a tener jugando.

## Cuarenta y siete mil sardinas, dibujadas por instancia

La tribuna se llena de sardinas que vienen a mirar la pelea, y se duplica con cada jefe que cae: 2.937, después 5.874, 11.747, 23.494, y **46.988 en la ronda final**. Eso no se hace con copias de un prefab.

El sistema quedó partido en cuatro piezas, y el reparto es la decisión que importa:

- **El movimiento es una función, no un estado.** La pose de cada sardina se calcula a partir del tiempo y de una semilla, en C# puro. Nadie guarda la posición de cuarenta y siete mil peces.
- **La animación de nado se hornea en el editor a una textura** de 787 vértices por 32 cuadros, 400 KB. La máquina del jugador no la calcula nunca.
- **El shader lee 32 bytes por instancia**: asiento, escala, giro, clip, fase e inicio. Con eso arma el resto.
- **El dibujado va por lotes**, con descarte por caja en cuatro grupos según el lado del ring.

Verificarlo pidió instrumentar el comportamiento, no la sensación: cuadro a cuadro durante 96 segundos, **ningún salto de altura mayor a media unidad**, ninguna sardina desapareciendo entre cuadros con la cámara quieta, y el 99 % de ellas dentro de los 20 grados del rumbo esperado. Con vsync y las 47.000 en pantalla, el percentil 99 quedó entre 17 y 24,5 ms.

<figure class="shot shot-pair">
  <img src="{{ '/assets/img/pollito-slayer/cardumen-ring-1.webp' | relative_url }}"
       width="1400" height="676" loading="lazy" decoding="async"
       alt="Vista cenital de la arena: columnas de sardinas azules convergen desde los bordes hacia el pollito, diminuto en el centro con su guante rojo.">
  <img src="{{ '/assets/img/pollito-slayer/cardumen-ring-2.webp' | relative_url }}"
       width="1400" height="676" loading="lazy" decoding="async"
       alt="La misma arena instantes después, con la arena cubierta de sardinas de borde a borde y el pollito apenas visible entre ellas.">
  <figcaption>La ronda final, la única sin jefe: todas las sardinas bajan al ring a la vez. Se dibujan con el mismo sistema que las de la tribuna.</figcaption>
</figure>

## El ataque que te seguía mientras lo esquivabas

Los cuatro jefes tienen dieciséis ataques entre todos. Quince fijan el punto donde van a caer en el momento en que aparece la marca de anticipo, y eso es lo que le da al jugador la ventana para leerlo y salir.

Uno no: el embate de la orca seguía apuntando al pollito **durante todo el anticipo**. Con el pollito caminando 300 unidades mientras duraba, el golpe caía donde el pollito terminaba, no donde estaba cuando la marca apareció.

Lo que eso rompía no era la dificultad del ataque, sino **que existiera más de una respuesta**. El embate es imbloqueable, pero imbloqueable no es imparriable: el parry es justamente lo que se le opone, con la misma ventana de 0,30 segundos que el resto de los ataques de la orca. Perseguir durante el anticipo dejaba el parry como única salida, y el parry es la lectura más difícil del juego. Un ataque que tenía dos respuestas se había quedado con una, sin que nadie lo hubiera decidido.

No era un bug: cada pieza, por separado, estaba bien. Era el cruce de dos decisiones correctas lo que le sacaba al jugador la alternativa. Ahora el embate fija su punto al empezar el anticipo, y vuelve a poder esquivarse además de atajarse.

<figure class="shot">
  <img src="{{ '/assets/img/pollito-slayer/telegrafiado.webp' | relative_url }}"
       width="1600" height="900" loading="lazy" decoding="async"
       alt="Una franja roja sale de la orca y se extiende por la arena hasta el pollito, marcando el punto donde va a caer el golpe.">
  <figcaption>La franja roja marca dónde va a caer el golpe. Esa es la ventana para salir.</figcaption>
</figure>

## Nada se calcula en la máquina del jugador si se puede calcular antes

Esto fue una regla, no una optimización puntual: **todo lo que se pueda hornear en el editor viaja como asset**. Tablas precalculadas, texturas generadas, layouts, la animación de nado del cardumen. Así no le exijo nada a ninguna PC.

Lo que no se puede preparar de antemano, como los pipelines que arma el driver de video la primera vez que ve un material, no se patea para cuando se usa, porque ahí es justo cuando se nota. Se precalienta antes, repartido en una **cola de carga con presupuesto de tiempo por cuadro**: corre lo que entre en el presupuesto y sigue en el cuadro siguiente.

El tirón de arranque, que antes hacía todo el calentamiento en un solo cuadro, **medía 196 ms**. Ese trabajo son las pieles de los cuatro jefes y del pollito, once prefabs de efectos, los sonidos y tres dibujos del cielo, y ahora está repartido hasta que el jugador no lo siente.

## La biblioteca cruzó de motor

Trece sistemas de <a href="{{ '/es/projects/common-package/' | relative_url }}">Common-Package</a>, mi biblioteca escrita para Unity, entraron a este proyecto y sostienen el juego que se publicó: percepción de agentes, IA de enemigos, máquina de estados, pooling de objetos, temporizadores, bus de eventos, estructuras de datos, la pila de cámara y utilidades de logging y de fundido.

Eso es lo que este proyecto demuestra mejor que cualquier explicación de arquitectura: **el núcleo escrito en C# puro, con el motor en el borde, transfiere.** No hubo que reescribir la lógica de decisión de los enemigos ni la de percepción para cambiar de Unity a Source 2; hubo que escribir la capa delgada que los conecta al motor nuevo.

El port se hizo archivo por archivo, **sin aprovechar el viaje para mejorar nada**: un port que además refactoriza no se puede verificar, porque cuando algo falla no se sabe si falló el port o la mejora. Las diferencias de motor quedaron anotadas en el comentario de cada clase.

Adentro del juego apliqué el mismo patrón: vida, combate, cadena de golpes, HUD, impulso, rondas y desbloqueables son objetos propios en C# plano, y el componente del motor queda de cáscara. Es lo que hace que la mayor parte del juego se pueda probar sin abrir el editor.

Otros tres sistemas se extrajeron a packages propios durante este desarrollo, con su origen en proyectos anteriores: percepción de agentes, el cerebro intercambiable del personaje y la FSM de enemigos por bandas de distancia. El bucle va en las dos direcciones: la biblioteca sostiene al juego, y el juego empuja a la biblioteca.

## Siete pruebas quedan en rojo a propósito

El repositorio corre **1.193 pruebas unitarias repartidas en 133 archivos, en cinco segundos, sin abrir el editor ni el juego**. Es la contrapartida práctica de tener el núcleo desacoplado del motor: la lógica de percepción, de decisión y de temporización se verifica en segundos, y el tiempo de jam se gasta en jugar el juego.

De esas 1.193, **1.186 están en verde y siete están en rojo a propósito**, con el motivo escrito adentro del mensaje de fallo.

Seis verifican la *firma* de cada especie: que la foca salte desde media distancia y no desde el otro lado del ring, que solo el lobo marino te empuje contra las cuerdas, que cada jefe se plante mirándote con un ataque al alcance. Un rebalanceo de dificultad movió los rangos y esas firmas quedaron suspendidas. Podría haberlas puesto en verde ajustando el número esperado. No lo hice: **en verde no quedaría ningún rastro de que la firma está suspendida**, y la decisión de si el diseño vuelve atrás se perdería en silencio. El rojo es el registro.

La séptima dice que el hueco que abre el esquive se vuelve a llenar en el mismo cuadro. Es cierto, y está decidido que siga siéndolo: el dash barre 34 unidades y las sardinas deciden saltar desde 100, así que las del medio no se enteran del esquive. Comprar ese espacio pedía casi triplicar el barrido, y el dash se siente bien como está. Ponerla en verde afirmaría que el hueco no se llena, y se llena.

También uso las pruebas al revés: para verificar una regla nueva **rompo el código a propósito y miro que la prueba caiga**. Una prueba que compara un cálculo contra el dato del que sale pasa siempre, y no verifica nada.

## Qué demuestra

- **Un juego completo publicado en un motor que no era el mío**, con diez versiones en producción y el ciclo de reporte, corrección y publicación corriendo en público.
- **Diagnóstico sobre sistemas en vivo**: encontrar por qué algo se siente mal cuando el instrumento obvio dice que está bien, y elegir la medición que sí lo muestra.
- **Rendimiento como decisión de arquitectura**, no como optimización tardía: qué se hornea en el editor, qué se reparte por cuadro y qué se paga cada cuadro, decidido de antemano y medido.
- **Un núcleo agnóstico del motor que efectivamente cruzó de motor**, con la cobertura de pruebas que eso habilita.
- **Criterio de verificación**: pruebas que caen cuando se rompe la regla que cuidan, y pruebas que se dejan en rojo cuando el rojo es la información.

<div class="card-meta" style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-soft);">
  <a href="https://sbox.game/dbg/pollito_slayer/" target="_blank" rel="noopener">Jugar en s&amp;box →</a>
  <span>trabajo por contrato para Del Bueno Games | repo privado</span>
</div>
