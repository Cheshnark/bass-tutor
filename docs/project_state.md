# Estado del proyecto

_Última actualización: 2026-10-01_

## Fases 0–6 cerradas (falta probar el afinador en bajo real); contenido: tronco común y metal/punk (borrador)

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
- Tests: 216 unitarios y 162 e2e.

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
- Probar el itinerario metal/punk y decir si prefieres púa o dedos, y metal o punk como foco (se eligió púa y una
  mezcla de ambos sin poder preguntarte).

## Siguiente paso

Opciones, por orden de recomendación:
1. **Tú**: probar el afinador con tu bajo en tu móvil y rellenar [afinador-pruebas.md](afinador-pruebas.md); y usar
   el curso y la Práctica unos días.
2. Revisión manual de accesibilidad (teclado, zoom, lector de pantalla): lista en [accesibilidad.md](accesibilidad.md).
3. Fase 7 (contenido restante) u otro itinerario (rock/pop es el más cercano a lo ya escrito).
