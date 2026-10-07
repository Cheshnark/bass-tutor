# Procedencia del contenido

_Fecha: 2026-10-07. Auditoría técnica, **no asesoramiento legal**. Generado con `npx tsx scripts/legal-provenance.ts`
(vuelve a ejecutarlo si cambia el contenido) y completado a mano._

## Resumen (hechos del repo)

- **79 lecciones (`.mdx`) en 26 módulos y 123 ejercicios (`.yaml` con alphaTex)**. Los docs decían 78 y 121: están
  desactualizados (se ha contado en disco; todos los ejercicios están referenciados por alguna lección).
- **Todo está en `status: borrador`** y fue **redactado por IA (Claude)** a partir de una tabla de fuentes
  (`docs/pedagogy.md`); el autor aún no lo ha revisado (`docs/decisions.md`, 2026-09-30). Por eso en todas las filas el
  origen es «redactado por IA, pendiente de revisión»: es lo único que el repo permite justificar.
- Los 123 ejercicios llevan el subtítulo `Ejercicio original · Basscraft` (comprobado). Es una **afirmación del autor/IA,
  no una prueba**: no se ha comparado ninguna melodía con obras reales.
- **No hay tablaturas, letras ni audio de canciones** en el repo (ver [legal-history-scan.md](legal-history-scan.md)).
- Ningún texto tiene frases copiadas detectables. **No se ha comparado frase a frase con las fuentes de pedagogy.md: NO VERIFICADO.**

## Elementos a vigilar (por orden de importancia)

| # | Elemento | Por qué | Acción propuesta |
|---|---|---|---|
| 1 | `exercises/riff-tritono.yaml` y lección `42-riffs/frigio-y-tritono.mdx` | Motivo corto de tritono en re vinculado en el texto con el primer disco de Black Sabbath. Probablemente genérico, pero es el único ejercicio con una referencia directa a una obra | El autor lo compara de oído; si se parece, cambiar el motivo o quitar la referencia |
| 2 | Texto de las lecciones | Redactado con IA a partir de fuentes con derechos (StudyBass, TalkingBass, No Treble, Premier Guitar, Wikipedia…). La IA puede reproducir expresiones cercanas sin que se note | Muestreo: buscar 2–3 frases de 5–10 lecciones entre comillas en un buscador; revisar las que usen metáforas muy concretas (p. ej. «como un pomo», «el gancho») |
| 3 | 56 enlaces de vídeo de terceros (URLs únicas, tabla abajo) | Se enlazan (no se incrustan ni se copian). Riesgo de copyright bajo; riesgo de enlace roto/cambio de contenido medio | Mantener como enlace; comprobar periódicamente; no alojar nada |
| 4 | Nombres de músicos reales (Jamerson, Graham, Harris, Butler) | Datos históricos de dominio común; sin imágenes ni obras | Mantener; añadir «sin vínculo con» en el aviso legal |
| 5 | Patrones de estilo (rock and roll 1-3-5-6-♭7, shuffle, galope, II–V–I, blues de 12) | Idea general / teoría; no protegible por sí misma | Ninguna |

## Vídeos externos enlazados (lista única)

| Fuente | Título (según la lección) | URL | Lecciones |
|---|---|---|---|
| BassBuzz | Basic Bass Plucking Technique (Beginner Bass Basics) | https://www.youtube.com/watch?v=CR8yQCZX2HQ | `00-arranque/cuerdas-al-aire.mdx`, `01-mano-derecha/pulsacion-alterna.mdx` |
| Fender | How to Tune a Guitar / Bass Tuning for Beginners | https://www.youtube.com/watch?v=ZX2_gxiDymE | `00-arranque/equipo-y-afinacion.mdx` |
| BassBuzz | Bass Straps (Beginner Bass Basics) | https://www.youtube.com/watch?v=Kui5LeiCcUI | `00-arranque/postura-y-salud.mdx` |
| StudyBass | How to Hold Your Bass & Posture | https://www.youtube.com/watch?v=tkAuilKYMJI | `00-arranque/postura-y-salud.mdx` |
| D'Addario and Co. | Adam Nitti's Moveable Anchor Technique | https://www.youtube.com/watch?v=hDzRqeS0ruQ | `01-mano-derecha/apagado-mano-derecha.mdx` |
| Scott's Bass Lessons | Right hand muting (floating thumb and more!) | https://www.youtube.com/watch?v=yDSAd29kJ0o | `01-mano-derecha/apagado-mano-derecha.mdx` |
| BassBuzz | Are You Plucking the Wrong Way? (Raking v. Alternating Showdown) | https://www.youtube.com/watch?v=VS0nUyMKYBQ | `01-mano-derecha/cambios-de-cuerda.mdx` |
| Dan Hawkins Bass Lessons | Beginner Bass Guitar Lesson: Rest Strokes & Free Strokes | https://www.youtube.com/watch?v=uyNzEChESv8 | `01-mano-derecha/pulsacion-alterna.mdx` |
| BassBuzz | Fix Your Plucking in 5 Minutes | https://www.youtube.com/watch?v=PWatGRe1iHI | `01-mano-derecha/pulsacion-alterna.mdx` |
| BassBuzz | Basic Bass Fretting Technique (Beginner Bass Basics) | https://www.youtube.com/watch?v=ux-i7FWOLzs | `02-mano-izquierda/posicion-y-presion.mdx` |
| Scott's Bass Lessons | 2 Great Tips For The Perfect Fretting Hand Technique | https://www.youtube.com/watch?v=8F0pVPr4VYw | `02-mano-izquierda/posicion-y-presion.mdx` |
| Dan Hawkins Bass Lessons | Quick & simple 1/8th note counting tip | https://www.youtube.com/watch?v=JUh7-hI_npQ | `03-ritmo/corcheas-y-silencios.mdx` |
| Mrs. Musical Pants | Counting rhythms: Whole, half, quarter, eighth notes and rests | https://www.youtube.com/watch?v=g1vFnQdRAdo | `03-ritmo/pulso-y-contar.mdx` |
| TalkingBass | Bass Octaves For Beginners | https://www.youtube.com/watch?v=q7ZuUBjUWlk | `04-ubicarse/la-octava.mdx` |
| Luke from Become A Bassist | Bass Tabs: Everything You Need To Know To Get Started Reading Bass Tabs | https://www.youtube.com/watch?v=Y1Gy5P7vgfw | `04-ubicarse/leer-tablatura.mdx` |
| TalkingBass | Beginners Guide To The Bass Fretboard - Learning The Notes (EASY METHOD) | https://www.youtube.com/watch?v=IJYxp5T4tLI | `04-ubicarse/notas-en-e-y-a.mdx` |
| Ryan Madora | Root–Fifth–Octave Bass Line: Fix Your Pinky Technique and Build Better Bass Lines | https://www.youtube.com/watch?v=HZjHtaidfjE | `05-primeras-lineas/uno-cinco-ocho.mdx` |
| TalkingBass | Using Approach Notes To Improve Your Bass Lines | https://www.youtube.com/watch?v=9PKpY-48lY4 | `10-pulso-rock/llegar-al-acorde.mdx` |
| TalkingBass | Easy Bass Fills For Beginners | https://www.youtube.com/watch?v=Cw04DRXhJic | `10-pulso-rock/octavas-y-rellenos.mdx` |
| TalkingBass | Music Theory For Bass Guitar - Slash Chords & Inversions | https://www.youtube.com/watch?v=emJTSEoWUhE | `11-progresiones-pop/acordes-con-barra.mdx` |
| Ryan Madora | Beginner Improvisation For Bass Players Vol. II: How To Play Through I-V-vi-IV Chord Progression | https://www.youtube.com/watch?v=3Levh-mS0jI | `11-progresiones-pop/i-v-vi-iv.mdx` |
| Ryan Madora | Beginner Improvisation For Bass Players: How To Play The I-vi-IV-V Chord Progression On Bass | https://www.youtube.com/watch?v=YVIhzIhzf3Y | `11-progresiones-pop/i-vi-iv-v.mdx` |
| Dan Hawkins Bass Lessons | Rock Bass - Learn How To Make Riffs | https://www.youtube.com/watch?v=pQCf47_kK5c | `12-riffs-rock/riffs-pentatonica.mdx`, `42-riffs/riffs-quinta-octava.mdx` |
| BassBuzz | How to Play Bass with a Drummer (Foolproof Beginner Blueprint) | https://www.youtube.com/watch?v=PSw5uqkTPzs | `13-cancion/cancion-completa.mdx`, `43-banda/con-la-bateria.mdx` |
| Scott's Bass Lessons | Groove Harder With These 3 Deadly Dynamics Exercises | https://www.youtube.com/watch?v=fa9jA08bYr4 | `13-cancion/dinamica-por-secciones.mdx`, `52-groove/notas-muertas-y-dinamica.mdx` |
| TalkingBass | How To Read Sixteenth Notes - The Heart Of Funk and Metal Bass Playing! | https://www.youtube.com/watch?v=eOSR_4GgPwI | `20-semicorcheas/semicorcheas-dedos.mdx`, `41-galope/semicorcheas-con-pua.mdx` |
| TalkingBass | The Most Important Funky Rhythm You'll Ever Learn | https://www.youtube.com/watch?v=rtqmJ3Z5-Q0 | `20-semicorcheas/sincopa-semicorcheas.mdx` |
| TalkingBass | The Perfect, Starter Slap Bass Riff For Beginners | https://www.youtube.com/watch?v=RkCyD-JgtV0 | `23-slap/slap-pop.mdx` |
| TalkingBass | How To Play Slap Bass #1 - Getting Started | https://www.youtube.com/watch?v=tGilCW0_Jf0 | `23-slap/slap-pulgar.mdx` |
| TalkingBass | Beginner Blues Bass Lesson | https://www.youtube.com/watch?v=GdAeCWAkt80 | `30-blues/forma-del-blues.mdx` |
| Scott's Bass Lessons | 2 Exercises To Develop a Great Shuffle Feel! | https://www.youtube.com/watch?v=xWfRxy9zEmE | `30-blues/shuffle-de-blues.mdx`, `52-groove/shuffle-y-swing.mdx` |
| TalkingBass | The Walking Bass Secret EVERY Beginner Needs To Know | https://www.youtube.com/watch?v=ZueIBKZtgWs | `31-walking/aproximacion-cromatica.mdx` |
| TalkingBass | Walking Bass Through a 12 Bar Blues | https://www.youtube.com/watch?v=AragQ0JzD6s | `31-walking/blues-caminado.mdx` |
| TalkingBass | The RIGHT Way To Start Walking Bass (NO Theory Needed) | https://www.youtube.com/watch?v=kNxOMOH7ioc | `31-walking/empezar-a-caminar.mdx` |
| TalkingBass | Jazz Blues  Bass in a 2 Feel | https://www.youtube.com/watch?v=J8-H5ci3WDA | `32-armonia-jazz/blues-de-jazz.mdx` |
| TalkingBass | 7 Things You NEED To Work On If You Want To Learn Walking Bass | https://www.youtube.com/watch?v=8KM2Uqa69tU | `33-tocar-jazz/tema-de-jazz.mdx` |
| TalkingBass | How To Play Bass With A Pick - Essential Tips | https://www.youtube.com/watch?v=LQANg6fX2kg | `40-pua/coger-la-pua.mdx` |
| BassBuzz | How to Play Bass With a Pick (from an ex-Pick Hater) | https://www.youtube.com/watch?v=vaQL21UL7Wc | `40-pua/coger-la-pua.mdx` |
| Dan Hawkins Bass Lessons | Master the Art of Bass Palm Muting – Groove Like a Pro | https://www.youtube.com/watch?v=wTqt4Uj8XL0 | `40-pua/palm-mute.mdx` |
| Scott's Bass Lessons | How to Play Bass with a PICK (Noob to Bad-Ass) | https://www.youtube.com/watch?v=R1gjqjaHpxU | `40-pua/pua-alterna.mdx` |
| Scott's Bass Lessons | 4 Killer Exercises To Whip Your Pick Playing Into Shape! | https://www.youtube.com/watch?v=tu7FlXKGXdY | `40-pua/pua-alterna.mdx` |
| Dan Hawkins Bass Lessons | Build Speed, Stamina, Strength & Excellent Bass Technique | https://www.youtube.com/watch?v=YKjO-0Y2MzA | `41-galope/resistencia.mdx` |
| TalkingBass | Modes For Bass Explained..In Record Time! | https://www.youtube.com/watch?v=x6mnPBMJWOc | `42-riffs/frigio-y-tritono.mdx` |
| TalkingBass | 5 String Bass For Beginners | https://www.youtube.com/watch?v=iP6YpObyWi4 | `43-banda/cinco-cuerdas.mdx` |
| Scott's Bass Lessons | How to SOUND AWESOME on the 5 STRING BASS… for 4 string players | https://www.youtube.com/watch?v=h3BGK3m7O_A | `43-banda/cinco-cuerdas.mdx` |
| TalkingBass | Creating Bass Lines #1 - Locking With The Bass Drum | https://www.youtube.com/watch?v=4Ty2gkdW8xw | `43-banda/con-la-bateria.mdx` |
| Scott's Bass Lessons | 'How to practice Arpeggios' Pt 1 - BASS LESSON (L#12) | https://www.youtube.com/watch?v=DChylf5mNNg | `50-arpegios/arpegios-en-progresion.mdx` |
| TalkingBass | Easy Bass Arpeggios For Beginners | https://www.youtube.com/watch?v=7vF_lcAc-L8 | `50-arpegios/triadas.mdx` |
| BassBuzz | How to Learn Bass Scales (Become a Better Bassist, Not a Robot) | https://www.youtube.com/watch?v=2PzUVcDkjX8 | `51-escalas/de-la-escala-a-la-linea.mdx` |
| TalkingBass | Major Scale For Bass Guitar | https://www.youtube.com/watch?v=uYf7RN_PHkk | `51-escalas/escala-mayor.mdx` |
| TalkingBass | The Minor Pentatonic Scale For Bass Guitar | https://www.youtube.com/watch?v=hhnf8nVUgDM | `51-escalas/menor-y-pentatonica.mdx` |
| TalkingBass | How To Play Funky Ghost Note Basslines | https://www.youtube.com/watch?v=s72wZ87tTxk | `52-groove/notas-muertas-y-dinamica.mdx` |
| Scott's Bass Lessons | The Ultimate Syncopation Exercise for Bassists | https://www.youtube.com/watch?v=mjDp-s3uBVo | `52-groove/sincopa.mdx` |
| TalkingBass | How To Read Music On Bass Guitar - Lesson 1 | https://www.youtube.com/watch?v=1GAEv__HYwo | `53-lectura/clave-de-fa.mdx` |
| Dan Hawkins Bass Lessons | Reading Music on Bass Guitar [With Play Along] | https://www.youtube.com/watch?v=OsEhzv72V0w | `53-lectura/leer-una-linea.mdx` |
| TalkingBass | How To Read Music On Bass Guitar - Basic Rhythms | https://www.youtube.com/watch?v=6tyHYup8muM | `53-lectura/ritmo-leido.mdx` |

Los títulos y canales se copiaron de las lecciones; `pedagogy.md` dice que se verificaron con oEmbed (2026-10-06 solo los de
TalkingBass). **El resto, NO VERIFICADO hoy**: comprobar que cada URL sigue viva y que el vídeo no enseña una canción con copyright.

## Tabla por módulo, lección y ejercicio

Columnas: _origen_ = lo que se puede justificar con el repo; _reproduce expresión_ = si se ha detectado material de
terceros; _revisado por el autor_ = vacío para que lo rellenes (sí/no/fecha).

### 00-arranque · Arranque (comun)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/00-arranque/equipo-y-afinacion.mdx` | Lección «Tu bajo, tu equipo y cómo afinar» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Fender (yt:ZX2_gxiDymE) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/afinar-y-escuchar.yaml` | Ejercicio «Afinar y escuchar cada cuerda» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/00-arranque/postura-y-salud.mdx` | Lección «Postura, correa y cómo no hacerte daño» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): BassBuzz (yt:Kui5LeiCcUI); StudyBass (yt:tkAuilKYMJI) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/postura-relajada.yaml` | Ejercicio «Negras relajadas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/00-arranque/cuerdas-al-aire.mdx` | Lección «Cuerdas al aire con metrónomo» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): BassBuzz (yt:CR8yQCZX2HQ) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/cuerdas-al-aire-negras.yaml` | Ejercicio «Cuerdas al aire en negras» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 01-mano-derecha · Mano derecha (comun)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/01-mano-derecha/pulsacion-alterna.mdx` | Lección «Pulsación alterna y apoyo» (borrador) | redactado por IA, pendiente de revisión | 3 vídeo(s) enlazado(s): Dan Hawkins Bass Lessons (yt:uyNzEChESv8); BassBuzz (yt:CR8yQCZX2HQ); BassBuzz (yt:PWatGRe1iHI) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/alternancia-corcheas.yaml` | Ejercicio «Alternancia en corcheas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/01-mano-derecha/cambios-de-cuerda.mdx` | Lección «Cambiar de cuerda sin perder la alternancia» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): BassBuzz (yt:VS0nUyMKYBQ) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/cruces-de-cuerda.yaml` | Ejercicio «Cruces de cuerda» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/01-mano-derecha/apagado-mano-derecha.mdx` | Lección «Apagar con la mano derecha» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): D'Addario and Co. (yt:hDzRqeS0ruQ); Scott's Bass Lessons (yt:yDSAd29kJ0o) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/apagado-derecha.yaml` | Ejercicio «Solo suena la cuerda que tocas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 02-mano-izquierda · Mano izquierda (comun)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/02-mano-izquierda/posicion-y-presion.mdx` | Lección «Posición de la mano izquierda y presión mínima» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): BassBuzz (yt:ux-i7FWOLzs); Scott's Bass Lessons (yt:8F0pVPr4VYw) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/primera-posicion-1-2-4.yaml` | Ejercicio «Primera posición con 1-2-4» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/02-mano-izquierda/ejercicio-cromatico.mdx` | Lección «El ejercicio cromático» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/cromatico-primera-posicion.yaml` | Ejercicio «Cromático en primera posición (1-2-4)» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/cromatico-quinta-posicion.yaml` | Ejercicio «Cromático en quinta posición (un dedo por traste)» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/02-mano-izquierda/coordinacion-y-apagado.mdx` | Lección «Coordinar las dos manos y apagar con la izquierda» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/notas-cortas-izquierda.yaml` | Ejercicio «Cortar notas con la mano izquierda» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 03-ritmo · Ritmo I (comun)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/03-ritmo/pulso-y-contar.mdx` | Lección «El pulso y cómo contarlo» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Mrs. Musical Pants (yt:g1vFnQdRAdo) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/redondas-blancas-negras.yaml` | Ejercicio «Redondas, blancas y negras» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/03-ritmo/corcheas-y-silencios.mdx` | Lección «Corcheas y silencios» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Dan Hawkins Bass Lessons (yt:JUh7-hI_npQ) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/corcheas-y-silencios.yaml` | Ejercicio «Corcheas y silencios» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/03-ritmo/como-practicar.mdx` | Lección «Cómo practicar para mejorar de verdad» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/primera-linea.yaml` | Ejercicio «Tu primera línea» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 04-ubicarse · Ubicarse en el mástil (comun)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/04-ubicarse/leer-tablatura.mdx` | Lección «Leer tablatura» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Luke from Become A Bassist (yt:Y1Gy5P7vgfw) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/leer-tab.yaml` | Ejercicio «Leer tablatura» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/04-ubicarse/notas-en-e-y-a.mdx` | Lección «Las 12 notas y dónde están en las cuerdas E y A» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:IJYxp5T4tLI) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/notas-naturales-e-a.yaml` | Ejercicio «Notas naturales en las cuerdas E y A» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/04-ubicarse/la-octava.mdx` | Lección «La forma de octava» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:q7ZuUBjUWlk) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/octavas.yaml` | Ejercicio «La forma de octava» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 05-primeras-lineas · Primeras líneas (comun)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/05-primeras-lineas/seguir-la-fundamental.mdx` | Lección «Acordes, cifrado y seguir la fundamental» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/fundamentales-i-iv-v.yaml` | Ejercicio «Fundamentales sobre G, C y D» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/05-primeras-lineas/fundamental-y-quinta.mdx` | Lección «Fundamental y quinta» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/fundamental-y-quinta.yaml` | Ejercicio «Fundamental y quinta en blancas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/05-primeras-lineas/uno-cinco-ocho.mdx` | Lección «Fundamental, quinta y octava (1-5-8)» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Ryan Madora (yt:HZjHtaidfjE) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/fundamental-quinta.yaml` | Ejercicio «Fundamental, quinta y octava» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/uno-cinco-ocho-i-iv-v.yaml` | Ejercicio «1-5-8 sobre G, C y D» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 10-pulso-rock · El pulso del rock (rock-pop)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/10-pulso-rock/corchea-de-rock.mdx` | Lección «La corchea de rock» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/corcheas-verso-estribillo.yaml` | Ejercicio «Corcheas: verso corto, estribillo largo» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/10-pulso-rock/llegar-al-acorde.mdx` | Lección «Llegar al acorde siguiente» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:9PKpY-48lY4) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/aproximacion-cromatica.yaml` | Ejercicio «Aproximación cromática» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/aproximacion-diatonica.yaml` | Ejercicio «Aproximación por la escala» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/10-pulso-rock/octavas-y-rellenos.mdx` | Lección «Octavas y rellenos» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:Cw04DRXhJic) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/octavas-rock.yaml` | Ejercicio «Octavas en corcheas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/relleno-fin-de-frase.yaml` | Ejercicio «Un relleno al final de la frase» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 11-progresiones-pop · Progresiones pop (rock-pop)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/11-progresiones-pop/i-v-vi-iv.mdx` | Lección «La progresión I–V–vi–IV» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Ryan Madora (yt:3Levh-mS0jI) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/i-v-vi-iv-sol.yaml` | Ejercicio «I–V–vi–IV en Sol» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/11-progresiones-pop/i-vi-iv-v.mdx` | Lección «I–vi–IV–V y la quinta del acorde siguiente» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Ryan Madora (yt:YVIhzIhzf3Y) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/i-vi-iv-v-do.yaml` | Ejercicio «I–vi–IV–V en Do» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/i-vi-iv-v-quintas.yaml` | Ejercicio «Llegar por la quinta: I–vi–IV–V» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/11-progresiones-pop/acordes-con-barra.mdx` | Lección «Acordes con barra» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:emJTSEoWUhE) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/bajo-descendente.yaml` | Ejercicio «Un bajo que baja: acordes con barra» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/bajo-ascendente.yaml` | Ejercicio «Un bajo que sube: G, G/B, C» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 12-riffs-rock · Riffs de rock (rock-pop)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/12-riffs-rock/riffs-pentatonica.mdx` | Lección «Riffs con la pentatónica» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Dan Hawkins Bass Lessons (yt:pQCf47_kK5c) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/riff-pentatonica-la.yaml` | Ejercicio «Un riff con la pentatónica de La» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/riff-pentatonica-mover.yaml` | Ejercicio «Mover el riff con los acordes» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/12-riffs-rock/patron-rock-and-roll.mdx` | Lección «El patrón de rock and roll (1-3-5-6-♭7)» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/rock-and-roll-la.yaml` | Ejercicio «El patrón de rock and roll en La» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/rock-and-roll-doce-compases.yaml` | Ejercicio «Rock and roll sobre un blues de doce compases» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/12-riffs-rock/doblar-el-riff.mdx` | Lección «Doblar el riff o sostener» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/doblar-riff-rock.yaml` | Ejercicio «Doblar el riff de la guitarra o sostener» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/unirse-al-riff.yaml` | Ejercicio «Sostener y unirse al final del riff» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 13-cancion · La canción entera (rock-pop)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/13-cancion/estructura-cancion.mdx` | Lección «Estructura: verso, estribillo y puente» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/verso-y-estribillo.yaml` | Ejercicio «Verso y estribillo» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/forma-con-puente.yaml` | Ejercicio «Verso, estribillo y puente» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/13-cancion/dinamica-por-secciones.mdx` | Lección «Dinámica por secciones» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Scott's Bass Lessons (yt:fa9jA08bYr4) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/crecer-por-secciones.yaml` | Ejercicio «Crecer por secciones» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/parar-y-volver.yaml` | Ejercicio «Parar y volver» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/13-cancion/cancion-completa.mdx` | Lección «Una canción completa con la banda» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): BassBuzz (yt:PSw5uqkTPzs) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/cancion-completa.yaml` | Ejercicio «Una canción completa» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 20-semicorcheas · Semicorcheas y síncopa (funk-soul)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/20-semicorcheas/semicorcheas-dedos.mdx` | Lección «Semicorcheas con dedos» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:eOSR_4GgPwI) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/negras-a-semicorcheas.yaml` | Ejercicio «De negras a semicorcheas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/semicorcheas-con-cambios.yaml` | Ejercicio «Semicorcheas con cambio de acorde» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/20-semicorcheas/sincopa-semicorcheas.mdx` | Lección «Síncopa en semicorcheas» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:rtqmJ3Z5-Q0) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/semicorcheas-e-y-a.yaml` | Ejercicio «En la "e", en la "y" y en la "a"» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/ritmo-empujado.yaml` | Ejercicio «El ritmo empujado (3 + 3 + 2)» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/20-semicorcheas/muertas-funk.mdx` | Lección «Notas muertas en el groove» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/muertas-semicorcheas.yaml` | Ejercicio «Notas muertas en semicorcheas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/groove-con-muertas.yaml` | Ejercicio «Un groove de funk con notas muertas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 21-octavas-funk · Octavas y el uno (funk-soul)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/21-octavas-funk/octavas-disco.mdx` | Lección «Octavas de disco y funk» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/octavas-disco-corcheas.yaml` | Ejercicio «Octavas de disco» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/octavas-semicorcheas.yaml` | Ejercicio «Octavas en la "a"» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/21-octavas-funk/el-uno.mdx` | Lección «El uno» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/el-uno-groove.yaml` | Ejercicio «Todo hacia el uno» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/21-octavas-funk/vamp-de-funk.mdx` | Lección «El vamp de funk» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/vamp-dorico.yaml` | Ejercicio «El vamp Em7 – A7» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/vamp-dominante.yaml` | Ejercicio «Un vamp sobre E7» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 22-motown-soul · Motown y soul (funk-soul)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/22-motown-soul/linea-motown.mdx` | Lección «Líneas al estilo Motown» (borrador) | redactado por IA, pendiente de revisión | menciona: Jamerson (dato histórico) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/motown-progresion.yaml` | Ejercicio «Una línea al estilo Motown» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/motown-cromatica.yaml` | Ejercicio «Pasos cromáticos entre acordes» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/22-motown-soul/notas-cortas-soul.mdx` | Lección «Soul: notas cortas, espacio y 12/8» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/soul-espacio.yaml` | Ejercicio «Notas cortas y espacio» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/soul-doce-octavos.yaml` | Ejercicio «Balada soul en 12/8» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/22-motown-soul/cancion-soul.mdx` | Lección «Una canción soul completa» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/soul-completa.yaml` | Ejercicio «Una canción soul completa» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 23-slap · Slap (funk-soul)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/23-slap/slap-pulgar.mdx` | Lección «Slap: el golpe de pulgar» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:tGilCW0_Jf0) — menciona: Larry Graham, Sly and the Family (dato histórico) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/pulgar-cuerdas-al-aire.yaml` | Ejercicio «El golpe de pulgar en cuerdas al aire» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/pulgar-y-muertas.yaml` | Ejercicio «Pulgar y notas muertas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/23-slap/slap-pop.mdx` | Lección «Slap: el pop» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:RkCyD-JgtV0) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/pulgar-y-pop-octavas.yaml` | Ejercicio «Pulgar y pop en octavas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/octavas-slap-groove.yaml` | Ejercicio «Octavas en semicorcheas con slap» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/23-slap/groove-de-slap.mdx` | Lección «Un groove de slap» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/groove-slap.yaml` | Ejercicio «Un groove de slap completo» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 30-blues · El blues (blues-jazz)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/30-blues/forma-del-blues.mdx` | Lección «El blues de doce compases» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:GdAeCWAkt80) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/blues-fundamentales.yaml` | Ejercicio «El blues de doce compases con fundamentales» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/blues-cambio-rapido.yaml` | Ejercicio «Cambio rápido y turnaround con 1-5-♭7-8» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/30-blues/shuffle-de-blues.mdx` | Lección «El shuffle de blues» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Scott's Bass Lessons (yt:xWfRxy9zEmE) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/shuffle-1-5-6-b7.yaml` | Ejercicio «Shuffle con 1-5-6-♭7» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/blues-en-shuffle.yaml` | Ejercicio «Un blues entero en shuffle» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/30-blues/escala-de-blues.mdx` | Lección «La escala de blues y los rellenos» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/escala-de-blues-la.yaml` | Ejercicio «La escala de blues de La» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/relleno-escala-de-blues.yaml` | Ejercicio «Rellenos con la escala de blues» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 31-walking · Walking bass (blues-jazz)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/31-walking/empezar-a-caminar.mdx` | Lección «Empezar a caminar» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:kNxOMOH7ioc) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/walking-blancas.yaml` | Ejercicio «Antes de caminar: fundamental y quinta en blancas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/walking-arpegios.yaml` | Ejercicio «Caminar con el arpegio de séptima» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/31-walking/aproximacion-cromatica.mdx` | Lección «Notas de aproximación en el walking» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:ZueIBKZtgWs) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/walking-aproximacion.yaml` | Ejercicio «Llegar por medio tono» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/31-walking/blues-caminado.mdx` | Lección «Un blues caminado» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:AragQ0JzD6s) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/walking-dos-vueltas.yaml` | Ejercicio «Un blues caminado, dos vueltas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 32-armonia-jazz · Armonía de jazz (blues-jazz)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/32-armonia-jazz/ii-v-i.mdx` | Lección «El II–V–I» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/ii-v-i-arpegios.yaml` | Ejercicio «El II–V–I en Do con arpegios» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/ii-v-i-dos-tonos.yaml` | Ejercicio «El II–V–I en Do y en Fa» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/32-armonia-jazz/walking-ii-v-i.mdx` | Lección «Caminar sobre el II–V–I» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/walking-ii-v-i.yaml` | Ejercicio «Caminar sobre el II–V–I» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/ii-v-en-un-compas.yaml` | Ejercicio «Dos acordes por compás (I–vi–ii–V)» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/32-armonia-jazz/ii-v-i-menor.mdx` | Lección «El II–V–I menor» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/ii-v-i-menor-arpegios.yaml` | Ejercicio «El II–V–I menor en Do con arpegios» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/ii-v-i-menor-walking.yaml` | Ejercicio «Caminar sobre el II–V–I menor» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/32-armonia-jazz/blues-de-jazz.mdx` | Lección «El blues de jazz» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:J8-H5ci3WDA) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/blues-de-jazz-dos.yaml` | Ejercicio «El blues de jazz en two-feel» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/blues-de-jazz-walking.yaml` | Ejercicio «El blues de jazz caminado» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 33-tocar-jazz · Tocar jazz (blues-jazz)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/33-tocar-jazz/two-feel.mdx` | Lección «Two-feel y pasar a walking» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/two-feel-a-walking.yaml` | Ejercicio «De two-feel a walking» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/33-tocar-jazz/forma-aaba.mdx` | Lección «La forma AABA de 32 compases» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/aaba-two-feel.yaml` | Ejercicio «La forma AABA en two-feel» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/aaba-walking.yaml` | Ejercicio «La forma AABA caminada» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/33-tocar-jazz/tema-de-jazz.mdx` | Lección «Un tema de jazz completo» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:8KM2Uqa69tU) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/tema-completo.yaml` | Ejercicio «Un tema de jazz completo» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 40-pua · Púa (metal-punk)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/40-pua/coger-la-pua.mdx` | Lección «Coger la púa y tocar hacia abajo» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): TalkingBass (yt:LQANg6fX2kg); BassBuzz (yt:vaQL21UL7Wc) — menciona: Steve Harris, Geezer Butler, Black Sabbath (dato histórico) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/pua-abajo-corcheas.yaml` | Ejercicio «Púa hacia abajo en corcheas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/40-pua/pua-alterna.mdx` | Lección «Púa alterna y cambios de cuerda» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): Scott's Bass Lessons (yt:R1gjqjaHpxU); Scott's Bass Lessons (yt:tu7FlXKGXdY) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/pua-alterna-cambios.yaml` | Ejercicio «Púa alterna y cambios de cuerda» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/40-pua/palm-mute.mdx` | Lección «Palm mute y la corchea punk» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Dan Hawkins Bass Lessons (yt:wTqt4Uj8XL0) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/palm-mute-on-off.yaml` | Ejercicio «Palm mute, sí y no» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/corcheas-punk.yaml` | Ejercicio «Corcheas punk en la fundamental» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 41-galope · Galope y semicorcheas (metal-punk)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/41-galope/semicorcheas-con-pua.mdx` | Lección «Semicorcheas con púa alterna» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:eOSR_4GgPwI) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/semicorcheas-pua.yaml` | Ejercicio «Semicorcheas con púa alterna» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/41-galope/galope.mdx` | Lección «El galope y el galope inverso» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/galope.yaml` | Ejercicio «El galope» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/galope-inverso.yaml` | Ejercicio «Galope y galope inverso» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/41-galope/resistencia.mdx` | Lección «Resistencia: rápido sin tensión» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Dan Hawkins Bass Lessons (yt:YKjO-0Y2MzA) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/resistencia-semicorcheas.yaml` | Ejercicio «Resistencia en semicorcheas» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 42-riffs · Riffs graves (metal-punk)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/42-riffs/drop-d.mdx` | Lección «Drop D: la cuerda grave en D» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/drop-d-pedal.yaml` | Ejercicio «Nota pedal en drop D» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/42-riffs/riffs-quinta-octava.mdx` | Lección «Fundamental, quinta y octava en riffs» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Dan Hawkins Bass Lessons (yt:pQCf47_kK5c) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/riff-1-5-8-drop-d.yaml` | Ejercicio «Riff con fundamental, quinta y octava» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/42-riffs/frigio-y-tritono.mdx` | Lección «Sonidos oscuros: frigio y tritono» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:x6mnPBMJWOc) — menciona: Black Sabbath (dato histórico) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/riff-frigio.yaml` | Ejercicio «Riff frigio en D» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/riff-tritono.yaml` | Ejercicio «Riff con tritono en D» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 43-banda · Tocar con la banda (metal-punk)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/43-banda/con-la-bateria.mdx` | Lección «Con la batería y la guitarra» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): TalkingBass (yt:4Ty2gkdW8xw); BassBuzz (yt:PSw5uqkTPzs) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/con-el-bombo.yaml` | Ejercicio «Con el bombo» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/doblar-o-sostener.yaml` | Ejercicio «Doblar el riff o sostener la fundamental» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/43-banda/punk-rapido-y-cortes.mdx` | Lección «Punk rápido y cortes» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/punk-rapido.yaml` | Ejercicio «Punk rápido» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/cortes.yaml` | Ejercicio «Cortes con la banda» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/43-banda/cinco-cuerdas.mdx` | Lección «El bajo de cinco cuerdas (opcional)» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): TalkingBass (yt:iP6YpObyWi4); Scott's Bass Lessons (yt:h3BGK3m7O_A) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/cinco-cuerdas-b.yaml` | Ejercicio «La cuerda B grave» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 50-arpegios · Arpegios (ampliacion)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/50-arpegios/triadas.mdx` | Lección «Tríadas: mayor y menor» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:7vF_lcAc-L8) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/triadas-la-mayor-menor.yaml` | Ejercicio «Tríadas de La mayor y La menor» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/50-arpegios/arpegios-en-progresion.mdx` | Lección «Arpegios sobre una progresión» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Scott's Bass Lessons (yt:DChylf5mNNg) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/arpegios-i-iv-v.yaml` | Ejercicio «Arpegios sobre A, D y E» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/arpegios-con-ritmo.yaml` | Ejercicio «Una línea con las notas del acorde» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/50-arpegios/cuatriadas.mdx` | Lección «Cuatriadas: maj7, 7 y m7» (borrador) | redactado por IA, pendiente de revisión | — | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor | |
| `exercises/tres-cuatriadas-la.yaml` | Ejercicio «Amaj7, A7 y Am7» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/dominantes-i-iv-v.yaml` | Ejercicio «Séptimas de dominante: A7, D7 y E7» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 51-escalas · Escalas (ampliacion)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/51-escalas/escala-mayor.mdx` | Lección «La escala mayor» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:uYf7RN_PHkk) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/escala-mayor-la.yaml` | Ejercicio «La escala mayor en La y en Re» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/51-escalas/menor-y-pentatonica.mdx` | Lección «Menor natural y pentatónica menor» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:hhnf8nVUgDM) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/menor-natural-la.yaml` | Ejercicio «La menor natural» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/pentatonica-menor-la.yaml` | Ejercicio «Pentatónica menor de La» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/51-escalas/de-la-escala-a-la-linea.mdx` | Lección «De la escala a la línea» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): BassBuzz (yt:2PzUVcDkjX8) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/secuencias-escala-mayor.yaml` | Ejercicio «Secuencias de la escala mayor» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/linea-notas-de-paso.yaml` | Ejercicio «Notas de paso entre notas del acorde» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 52-groove · Groove y feels (ampliacion)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/52-groove/sincopa.mdx` | Lección «Síncopa: tocar entre los tiempos» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Scott's Bass Lessons (yt:mjDp-s3uBVo) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/contratiempos.yaml` | Ejercicio «A tiempo y a contratiempo» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/anticipaciones.yaml` | Ejercicio «Anticipar el cambio de acorde» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/52-groove/shuffle-y-swing.mdx` | Lección «Shuffle y swing» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Scott's Bass Lessons (yt:xWfRxy9zEmE) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/tresillos-a-shuffle.yaml` | Ejercicio «De tresillos a shuffle» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/shuffle-1-5-6.yaml` | Ejercicio «Shuffle con fundamental, quinta y sexta» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/52-groove/notas-muertas-y-dinamica.mdx` | Lección «Notas muertas y dinámica» (borrador) | redactado por IA, pendiente de revisión | 2 vídeo(s) enlazado(s): TalkingBass (yt:s72wZ87tTxk); Scott's Bass Lessons (yt:fa9jA08bYr4) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/notas-muertas.yaml` | Ejercicio «Notas muertas entre fundamentales» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/acentos-y-dinamica.yaml` | Ejercicio «Suave, fuerte y con acentos» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |

### 53-lectura · Leer partitura (ampliacion)

| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |
|---|---|---|---|---|---|---|---|
| `modules/53-lectura/clave-de-fa.mdx` | Lección «La clave de Fa» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:1GAEv__HYwo) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/leer-cuerdas-al-aire.yaml` | Ejercicio «Leer las cuerdas al aire» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/leer-primera-posicion.yaml` | Ejercicio «Notas naturales en primera posición» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/53-lectura/ritmo-leido.mdx` | Lección «El ritmo en la partitura» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): TalkingBass (yt:6tyHYup8muM) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/leer-ritmo-puntillo.yaml` | Ejercicio «Puntillos y silencios» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/leer-ritmo-ligaduras.yaml` | Ejercicio «Ligaduras» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `modules/53-lectura/leer-una-linea.mdx` | Lección «Leer una línea entera» (borrador) | redactado por IA, pendiente de revisión | 1 vídeo(s) enlazado(s): Dan Hawkins Bass Lessons (yt:OsEhzv72V0w) | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor; comprobar que los enlaces siguen vigentes | |
| `exercises/lectura-linea-do.yaml` | Ejercicio «Una línea en Do mayor» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
| `exercises/lectura-linea-sol.yaml` | Ejercicio «Una línea en Sol mayor (con armadura)» (borrador) | redactado por IA, pendiente de revisión; subtítulo «Ejercicio original» | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |
