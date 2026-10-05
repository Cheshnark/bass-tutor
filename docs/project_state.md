# Estado del proyecto

_Última actualización: 2026-10-05_

## Identidad: más carácter (hecho, 2026-10-05) y nombre nuevo (pendiente)

Implementadas las cinco ideas de las maquetas ([maquetas/identidad.html](maquetas/identidad.html)):
- **Logotipo** (nombre + cuatro cuerdas, enlace al curso) en lugar de la placa con caja; Ajustes relleno; piloto
  apagado que parece un piloto.
- **Rótulo de panel** con tira crema y tornillos; es el `h1` de cada vista. **Título de pestaña por vista.**
- **Ámbar solo para lo encendido**: botón principal en crema; en el índice, solo brilla la lección por la que vas.
- **Metrónomo como frontal**: ventana de BPM iluminada, pilotos de pulso, pote de tempo y de volumen (con teclado,
  arrastre, ± y entrada numérica) e interruptor de palanca.
- **Texto en Atkinson Hyperlegible Next** (autoalojada).
- **Tolex por itinerario** en el índice y en las lecciones.

Detalle y motivos en [decisions.md](decisions.md). Tests: 226 unitarios (5 nuevos del pote) y 184 e2e
(nuevos: pote de tempo y de volumen, títulos por vista), axe sin infracciones en los dos temas.

**Nombre:** el autor quiere uno en español con gancho; la primera tanda (Retumba, Bajo Cero, Sube el Bajo, Grave) no
le convenció. Cambiarlo es una línea (`APP_NAME` en src/brand.ts) más el subtítulo de los ejercicios. Pendiente.

## Guía visual en la partitura (2026-10-04)

Al reproducir un ejercicio no se veía por dónde iba la reproducción. Era un olvido: alphaTab crea los cursores pero
no los pinta. Ahora el **compás que suena** va sombreado, una **línea marca el pulso** y la **nota actual** se
resalta; el bucle A-B se ve en azul. Un e2e lo comprueba (cursor visible, avanza y la nota se marca).
En partituras largas la **vista sigue al cursor** (ya lo hacía alphaTab) y ahora lo deja con 80 px de margen por
arriba en vez de pegado al borde. Se comprobó con la canción de 31 compases (e2e `playback-guide.spec.ts`), también en
modo atril, donde los estilos del cursor ya aplican porque son globales al visor.

## Índice del curso en acordeón (2026-10-04)

El índice mostraba todo desplegado (26 módulos). Ahora cada **bloque** (tronco común, ampliación común y cada
itinerario por estilo) es plegable, con su contador de lecciones completadas y la descripción siempre visible. Por
defecto se abre el que tienes a medias; si no has empezado nada, el tronco común. Se recuerda lo que abres o cierras
en el dispositivo. Los módulos dentro de un bloque no se pliegan. Un itinerario sin módulos no es plegable.

## Afinador: entrada, nivel y ganancia (2026-10-04)

Al probar el afinador con un bajo real (Amplug 3 → entrada de línea de un sobremesa con Windows 10) la app no
recogía la señal. El código solo abría la entrada **predeterminada** del sistema y, con el control automático de
ganancia desactivado, una señal floja caía bajo el umbral de silencio sin avisar. Ahora el afinador tiene:
- **Selector de entrada** (se rellena al activar el micrófono y se mantiene al día con `devicechange`). Se recuerda la
  elegida; si ya no existe, se vuelve a la predeterminada.
- **Medidor de nivel** (−60 a 0 dBFS) y **ganancia por software** de 0 a +30 dB (se recuerda).
- **Probado con el bajo real** (4 cuerdas, Amplug 3 → línea, Windows 10, Chrome en `localhost`): notas bien detectadas
  y afinación coincidente con un afinador Korg, con ganancia 0 dB y el medidor al ~80 % con slap. Resultado y límites
  en [afinador-pruebas.md](afinador-pruebas.md).

## Fases 0–6 cerradas; Fase 7 (contenido) escrita, pendiente de tu revisión

### Fase 7 (contenido restante): escrita

Todo el contenido está escrito: tronco común, ampliación común y los cuatro itinerarios (26 módulos, 78 lecciones,
121 ejercicios), todo en `borrador`. **Falta el criterio de la fase: tu revisión pedagógica por módulo.**


- Reparto del currículo original entre la nueva **ampliación común** y los itinerarios: [pedagogy.md](pedagogy.md).
- **Ampliación común** (nuevo apartado del índice, para cualquier estilo):
  - **Arpegios**: tríadas mayor y menor, arpegios sobre una progresión, cuatriadas maj7/7/m7 (3 lecciones, 5 ejercicios).
  - **Escalas**: mayor, menor natural y pentatónica menor, secuencias y notas de paso (3 lecciones, 5 ejercicios).
  - **Groove y feels**: contratiempo y anticipaciones, tresillos y shuffle, notas muertas, dinámica y acentos
    (3 lecciones, 6 ejercicios; el shuffle suena con batería en shuffle).
  - **Leer partitura**: clave de Fa, ritmo leído (puntillos, ligaduras), una línea entera con armadura (3 lecciones,
    6 ejercicios solo de partitura). **Ampliación común completa** (4 módulos, 12 lecciones).
  - Ejercicios con la digitación en la partitura y acompañamiento generado.
- **Itinerario rock/pop** (borrador, completo: 4 módulos, 12 lecciones): temario en [pedagogy.md](pedagogy.md).
  - **El pulso del rock**: corchea de rock (corta/larga), aproximaciones cromáticas y diatónicas, octavas y rellenos
    (3 lecciones, 5 ejercicios).
  - **Progresiones pop**: I–V–vi–IV, I–vi–IV–V con aproximación por la quinta, acordes con barra (3 lecciones,
    5 ejercicios).
  - **Riffs de rock**: riffs con la pentatónica menor y moverlos de acorde, el patrón de rock and roll
    (1-3-5-6-♭7) sobre un blues de doce compases, doblar el riff de la guitarra o sostener (3 lecciones,
    6 ejercicios; los de doblar suenan con guitarra y batería). Sin vídeo del patrón de rock and roll.
  - **La canción entera**: forma (verso, estribillo, puente), dinámica por secciones (duración de las notas, piano/
    forte, callar y volver con un relleno) y una canción original completa de 31 compases con batería y acordes
    (3 lecciones, 5 ejercicios; secciones rotuladas en la partitura). **Itinerario rock/pop completo.**
- **Itinerario blues/jazz** (borrador, completo: 4 módulos, 12 lecciones): temario en [pedagogy.md](pedagogy.md).
  - **El blues** (en La): forma de doce compases con cambio rápido y turnaround, 1-5-♭7-8, shuffle 1-5-6-♭7 por todo
    el blues, escala de blues y rellenos en los compases 4 y 12 (3 lecciones, 6 ejercicios, batería en shuffle).
  - **Walking bass** (en Fa): blancas, arpegio de séptima, aproximación cromática en el cuarto tiempo y un blues
    caminado de dos vueltas (3 lecciones, 4 ejercicios, batería en swing). Vídeos de TalkingBass.
  - **Armonía de jazz**: II–V–I con arpegios (Do y Fa), caminar sobre él, dos acordes por compás (I–vi–ii–V) y el
    blues de jazz en two-feel y caminado (3 lecciones, 6 ejercicios).
  - **Tocar jazz**: de two-feel a walking, la forma AABA de 32 compases (two-feel y caminada) y un tema original
    completo de 73 compases con intro, tema, solos y final (3 lecciones, 4 ejercicios).
  - El acompañamiento admite **dos acordes por compás** (`"Cm7 F7"`).
- **Itinerario funk/soul** (borrador, completo: 4 módulos, 12 lecciones): temario en [pedagogy.md](pedagogy.md).
  - **Semicorcheas y síncopa**: de negras a semicorcheas con alternancia, tocar en la "e", la "y" o la "a", el ritmo
    empujado (3+3+2) y notas muertas en el groove (3 lecciones, 6 ejercicios).
  - **Octavas y el uno**: octavas de disco y en la "a", el uno (acento y espacio) y los vamps Em7–A7 y E7
    (3 lecciones, 5 ejercicios).
  - **Motown y soul**: línea al estilo Motown (síncopa y cromatismo), dos pasos cromáticos entre acordes, notas
    cortas y espacio, balada en 12/8 y una canción soul completa (3 lecciones, 5 ejercicios).
  - **Slap**: pulgar en cuerdas al aire y con muertas, pop en octavas, octavas en semicorcheas y un groove con ligados
    (3 lecciones, 5 ejercicios; sonido de slap en la reproducción).

### Fase 6 (diseño "cabezal" y pulido): hecha

- **Tema "cabezal"**: tolex negro, placa crema con el nombre, rejilla, piloto ámbar que luce con el pulso del
  metrónomo en cualquier vista (y lleva a él) y afinador con **VU analógico**. Rótulos en Oswald.
- **Alto contraste** (negro, blanco, amarillo) y tema automático según el sistema.
- **Ajustes** en una página propia, accesible desde la cabecera en todas las vistas.
- **Modo atril**: sin cabecera, letra grande y todo el ancho; pensado para el móvil o la tableta en horizontal.
- **WCAG 2.2 AA**: axe sin infracciones en las 11 vistas, con los dos temas y en modo atril; controles principales
  ≥ 48 px comprobados. Lo que no se puede automatizar está en [accesibilidad.md](accesibilidad.md).

### Fase 5 (audio avanzado): hecha

- **Afinador (experimental)**, pestaña nueva: detección YIN por micrófono, automático o por cuerda, aguja de cents y
  tono de referencia para afinar de oído. Error con tono sintético < 0,7 cents (criterio: < 3). **Probado en bajo real por
  cable** (2026-10-04); falta el móvil con micrófono ambiente: protocolo y tabla en [afinador-pruebas.md](afinador-pruebas.md).
- **Backing tracks**: los ejercicios con armonía suenan con batería y acordes generados; se puede silenciar el bajo
  (tocar tú con la banda) o el acompañamiento.
- **Oído** (Práctica → Oído): reconocer intervalos en el registro del bajo, con repaso espaciado.
- **Grábate**: en cada ejercicio, grabar y escucharte (no se guarda).

### Fase 4 (práctica inteligente): hecha

- Nueva pestaña **Práctica** (`#/practica`):
  - **Repaso de hoy**: ejercicios cuyo repaso ha vencido, calculados del historial con Leitner por días (más
    atrasados primero), y notas del mástil pendientes. Cada uno se practica ahí mismo. Aviso en el índice del curso.
  - **Rutinas de 15, 30 y 45 min**: bloques que alternan calentamiento, técnica, mástil y groove, con los ejercicios
    ya practicados (primero los que tocan) y un temporizador por bloque. Pantalla encendida durante la rutina.
  - **Quiz de mástil**: nombrar la nota de una casilla o encontrarla en una cuerda; cuerdas graves o todas, solo
    naturales opcional. Cada nota tiene su repaso espaciado. Sin marcador: al final, aciertos, tiempo medio y lo que
    más cuesta.
- Corregido: varios pases limpios el mismo día ya no adelantan el repaso semanas.
- La copia de progreso incluye el quiz (versión 2; las copias anteriores se siguen importando).

### Fase 3 (progreso + PWA): hecha

- **Progreso** en el dispositivo (IndexedDB): intentos por ejercicio (tempo y pase limpio), mejor tempo limpio,
  tempo sugerido para el siguiente intento, lecciones completadas (exige un intento de cada ejercicio) y "Sigue en
  el paso N" en el índice. **Copia exportable/importable** (JSON).
- **Ajustes y metrónomo** se recuerdan al volver.
- **Sin conexión**: tras la primera visita funciona todo el curso, partitura y sonido incluidos (e2e en modo avión,
  también bajo `/bass-tutor/`). Instalable como app (manifest + iconos propios). Aviso de versión nueva.
- **Lighthouse (móvil)**: 98/100/100 portada, 97/100/100 lección (rendimiento/accesibilidad/buenas prácticas).
- **Publicación** en GitHub Pages (`.github/workflows/deploy.yml`): activada y lanzada a mano por el autor el 2026-10-04
  (Source: GitHub Actions); el workflow terminó bien. URL: https://cheshnark.github.io/bass-tutor/ Sin la variable `PAGES_ENABLED` solo se publica a mano.
- Tests: 217 unitarios y 164 e2e.

### Contenido

Tronco común: 6 módulos, 18 lecciones, 20 ejercicios, todo en borrador (ver [pedagogy.md](pedagogy.md)).

**Itinerario metal/punk** (borrador): temario de 4 módulos en [pedagogy.md](pedagogy.md). Escritos:
- **Módulo 1 · Púa**: coger la púa y tocar hacia abajo, púa alterna y cambios de cuerda, palm mute y la corchea punk
  (3 lecciones, 4 ejercicios con notación de púa ⊓/V y P.M.).
- **Módulo 2 · Galope y semicorcheas**: semicorcheas con púa alterna, el galope y el galope inverso (con golpe al
  aire), resistencia sin tensión (3 lecciones, 4 ejercicios).
- **Módulo 3 · Riffs graves** (todo en drop D): afinar en drop D y nota pedal, fundamental-quinta-octava en el
  mismo traste, frigio (♭2) y tritono (3 lecciones, 4 ejercicios). Los mástiles de lección pueden fijar su
  afinación (`<Fretboard tuning="drop-d-4">`).
- **Módulo 4 · Tocar con la banda**: con el bombo, doblar el riff o sostener la fundamental, punk rápido, cortes y
  bajo de cinco cuerdas (opcional) (3 lecciones, 5 ejercicios). **Los ejercicios suenan con batería** (y uno con
  guitarra) y la reproducción sigue tu tempo de práctica (selector en BPM).

Fuentes y vídeos verificados en pedagogy.md.
En el índice, los módulos de un itinerario se numeran 1, 2, 3… (las carpetas usan bloques: metal/punk = 40–49).

### Pendiente de ti

- ~~Activar GitHub Pages~~ (hecho el 2026-10-04). Falta comprobar la versión publicada en el móvil: instalarla como app y
  probar el modo sin conexión.
- Probar el tronco común como alumno y en tu móvil (instalada como app).
- Probar el itinerario rock/pop, sobre todo la canción completa del módulo 4.
- Probar el itinerario blues/jazz, sobre todo el tema completo del módulo 4.
- Probar el itinerario funk/soul; el slap, con cuidado de la muñeca (poca fuerza).
- Probar el itinerario metal/punk y decir si prefieres púa o dedos, y metal o punk como foco (se eligió púa y una
  mezcla de ambos sin poder preguntarte).

## Siguiente paso

Opciones, por orden de recomendación:
1. **Tú**: probar el afinador con tu bajo en tu móvil y rellenar [afinador-pruebas.md](afinador-pruebas.md); y usar
   el curso y la Práctica unos días.
2. **Tú**: revisión pedagógica de la Fase 7, módulo a módulo (tocarlo, corregir y pasar a `revisada`). Puedo
   ayudarte con lo que encuentres.
3. Opcional: II–V–I menor (blues/jazz), buscar los vídeos que faltan, o la Fase 8 (multiusuario) si decides publicar.
4. Revisión manual de accesibilidad (lista en [accesibilidad.md](accesibilidad.md)).
