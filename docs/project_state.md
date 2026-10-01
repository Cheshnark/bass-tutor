# Estado del proyecto

_Última actualización: 2026-10-01_

## Fases 0–4 cerradas; contenido: tronco común e itinerario metal/punk completos (borrador)

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
- Tests: 176 unitarios y 94 e2e.

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
1. **Tú**: probar el curso como alumno durante unos días (también la Práctica: la cola necesita días reales).
2. Fase 5 (audio avanzado: backing tracks, oído, afinador experimental). Los ejercicios con batería ya son un primer
   paso de backing tracks.
3. Otro itinerario (rock/pop es el más cercano a lo ya escrito).
