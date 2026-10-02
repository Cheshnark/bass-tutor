# Estado del proyecto

_Última actualización: 2026-10-02_

## Fases 0–6 cerradas; Fase 7 (contenido) en curso

### Fase 7 (contenido restante): en curso

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
- **Itinerario blues/jazz** (borrador): temario de 4 módulos en [pedagogy.md](pedagogy.md). Escritos:
  - **El blues** (en La): forma de doce compases con cambio rápido y turnaround, 1-5-♭7-8, shuffle 1-5-6-♭7 por todo
    el blues, escala de blues y rellenos en los compases 4 y 12 (3 lecciones, 6 ejercicios, batería en shuffle).
  - **Walking bass** (en Fa): blancas, arpegio de séptima, aproximación cromática en el cuarto tiempo y un blues
    caminado de dos vueltas (3 lecciones, 4 ejercicios, batería en swing). Vídeos de TalkingBass.
- Pendiente: blues/jazz módulos 3–4 (II–V–I, blues de jazz, two-feel, AABA); itinerario funk/soul.

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
  tono de referencia para afinar de oído. Error con tono sintético < 0,7 cents (criterio: < 3). **Falta la prueba en
  bajo real** por dispositivo: protocolo y tabla en [afinador-pruebas.md](afinador-pruebas.md).
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
- **Publicación** en GitHub Pages preparada (`.github/workflows/deploy.yml`); falta que la actives tú.
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

- **Activar GitHub Pages** (Settings → Pages → Source: GitHub Actions) y lanzar el workflow "Publicar en GitHub Pages".
- Probar el tronco común como alumno y en tu móvil (instalada como app).
- Probar el itinerario rock/pop, sobre todo la canción completa del módulo 4.
- Probar los módulos de blues y walking del itinerario blues/jazz.
- Probar el itinerario metal/punk y decir si prefieres púa o dedos, y metal o punk como foco (se eligió púa y una
  mezcla de ambos sin poder preguntarte).

## Siguiente paso

Opciones, por orden de recomendación:
1. **Tú**: probar el afinador con tu bajo en tu móvil y rellenar [afinador-pruebas.md](afinador-pruebas.md); y usar
   el curso y la Práctica unos días.
2. Seguir la Fase 7: blues/jazz módulos 3–4 (armonía de jazz; tocar jazz), después funk/soul.
3. Revisión manual de accesibilidad (lista en [accesibilidad.md](accesibilidad.md)).
