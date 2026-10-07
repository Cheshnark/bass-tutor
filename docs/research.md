# Profesor de bajo en web: evaluación, especificación y hoja de ruta para Claude Code

**Sí tiene sentido hacerlo como app web/PWA. Lo que conviene cambiar es la idea de que sea "principalmente pasiva".** Para aprender un instrumento hay que tocar y repetir con intención. La app puede ser tranquila, sin juegos ni puntuaciones y fácil de seguir desde el móvil. Pero cada lección debe acabar en algo que tocas con el metrónomo y que después repasas. Lo más costoso no será el código sino escribir las lecciones. Por eso la hoja de ruta empieza por las herramientas (mástil, metrónomo) y por un formato de contenido bien definido, y deja el afinador por micrófono como función experimental.

## TL;DR

- **Tu planteamiento vale si cambias una pieza.** Una guía web sin corrección automática es viable y hasta recomendable para empezar. Pero "pasiva" no puede significar solo leer y mirar: cada lección tiene que cerrar con una práctica activa (tempo objetivo, bucle, autoevaluación y repaso espaciado). La evidencia sobre práctica deliberada indica que la práctica estructurada importa, aunque no lo explica todo: en música explica en torno al 21 % de la varianza del rendimiento según el metaanálisis de Macnamara et al. (2014).\[1\]
- **Web/PWA es la opción correcta para este producto.** El metrónomo es preciso en web si se programa con el reloj de Web Audio. Tablatura y notación están cubiertas por alphaTab y la teoría por Tonal.js. El punto débil es el afinador y cualquier detección por micrófono. El Mi grave del bajo está en 41,2 Hz, los algoritmos de autocorrelación necesitan al menos dos periodos de señal y en iOS no se puede desactivar todo el procesado de audio.\[2\] Por eso el afinador va en una fase posterior y marcado como experimental.
- **Identidad visual: que recuerde a "cabezal de ampli", no a Orange.** Evita la combinación que identifica a Orange: tolex naranja dominante, marco "picture frame", pictogramas en los controles, escudo y rotulación redondeada. La marca ORANGE está registrada para amplificadores e instrumentos.\[3\] Sí puedes usar rasgos comunes a todo el género: rejilla, piloto luminoso, potes con escala, VU y placa metálica. Con tu propia paleta y tu tipografía, y siempre priorizando que se lea bien mientras tocas.

---

## 0. Supuestos de partida (explícitos)

- **Público:** de principiante a intermedio. Bajo de 4 cuerdas como caso base; 5 y 6 cuerdas como configuración.
- **Uso:** personal al principio, con posible ampliación a más usuarios más adelante. Esto justifica empezar sin backend.
- **Desarrollo:** con Claude Code, trabajando por fases con especificaciones escritas en el repositorio.
- **Idioma:** interfaz y contenido en español, con la nomenclatura latina (Do-Re-Mi) y la anglosajona (C-D-E) conmutables.
- **Convención del documento:** **[Hecho]** = verificado con fuente. **[Inferencia]** = deducido de hechos. **[Hipótesis]** = por validar. **[Opinión]** = recomendación mía.

---

## 1. Evaluación crítica del planteamiento

### 1.1 ¿Una guía "principalmente pasiva" sirve para aprender bajo?

**[Hecho]** El metaanálisis de Macnamara, Hambrick y Oswald (2014, *Psychological Science*) concluyó que la práctica deliberada explica "26 % de la varianza en el rendimiento en juegos, 21 % en música, 18 % en deportes, 4 % en educación y menos del 1 % en profesiones". Su conclusión: la práctica deliberada "es importante, pero no tanto como se ha defendido".\[1\]
**[Hecho]** Ericsson y Harwell (2019, *Frontiers in Psychology*) lo rebatieron: con una definición más estricta de práctica deliberada, se quedaron con 14 de los 88 estudios de Macnamara et al. y obtuvieron r = 0,54 (IC 95 %: 0,44–0,63), "en torno al 29 % de la varianza", frente al 14 % del análisis original.
**[Inferencia]** Las dos partes del debate están de acuerdo en algo: la práctica estructurada y con objetivos concretos influye de forma sustancial. Leer o ver lecciones sin tocar no es práctica. Una app "pasiva" en sentido literal no enseñaría a tocar el bajo.

**[Hecho]** Sobre cómo organizar la práctica:
- Carter y Grahn (2016, *Frontiers in Psychology*) estudiaron el "efecto de interferencia contextual" en música: practicar alternando tareas (interleaved) da mejor retención que practicar en bloques.\[4\]
- Wiseheart et al. (2017, *PLOS ONE*) no encontraron efecto de espaciado en principiantes de piano con intervalos cortos (0–15 minutos).\[5\]
- **[Inferencia]** El espaciado y la alternancia son recomendables, pero su evidencia en música es más escasa que en aprendizaje verbal. Conviene aplicarlos con intervalos de días, no de minutos, y sin prometer milagros.

**[Opinión] Reformulación propuesta: "guía de baja fricción" en vez de "guía pasiva".**
- La app no exige micrófono, no puntúa y no gamifica. Tú la sigues.
- Cada lección tiene explicación breve → demostración (audio o diagrama) → ejercicio con metrónomo y tempo objetivo → autoevaluación (¿limpio, a tiempo, sin tensión?) → programación del repaso.
- El feedback que la app no puede darte se sustituye por tres cosas:
  1. Autoevaluación guiada con criterios concretos.
  2. Grabarte y escucharte (con otra app o la del sistema en el MVP).
  3. "Escaleras de tempo": subir 4–5 BPM solo cuando pasas el criterio.

### 1.2 ¿Web/PWA o nativa?

| Función | Web/PWA en 2026 | Veredicto |
|---|---|---|
| Lecciones, diagramas, tablatura | Sin limitaciones relevantes | Web ideal |
| Metrónomo preciso | Precisión de muestra si se programa sobre el reloj de audio | Web válida |
| Reproducción de ejemplos y backing tracks con cambio de tempo | Viable. La calidad del time-stretch de audio grabado depende de la librería **[Hipótesis]** | Web válida, con pruebas |
| Afinador por micrófono (41 Hz) | Posible pero delicado. Procesado de iOS solo parcialmente desactivable | Experimental |
| Corrección en tiempo real estilo Yousician | Difícil y con mucho riesgo en web | Fuera de alcance |
| Offline | Sí, con service worker. En iOS con matices | Web válida |

**[Opinión]** La web encaja porque el núcleo del producto es contenido más herramientas deterministas. La opción nativa solo compensaría si el objetivo fuera la corrección automática por audio, que es justo lo que propongo no hacer.

### 1.3 El mayor riesgo real: el contenido

**[Hecho]** El curso *Beginner to Badass* de BassBuzz tiene "30 horas", "107 lecciones y 86 canciones (con backing tracks)".\[6\] El libro 1 del Hal Leonard Bass Method tiene 48 páginas e incluye "más de 100 canciones, riffs y ejemplos" y "44 pistas de banda completa".\[7\]
**[Inferencia]** Un currículo de principiante con calidad comparable supone cientos de ejercicios y decenas de pistas de acompañamiento. Programar el visor es la parte fácil.
**[Opinión]** Una alternativa seria sería que la app fuera un **compañero de práctica** (mástil, metrónomo, rutinas, registro y repaso) que acompaña a un método ya existente, como el libro de Hal Leonard o un curso online. Eso reduce mucho el esfuerzo. Aun así, mi recomendación es un término medio: herramientas completas más un currículo propio corto y bien hecho (unas 30 lecciones), ampliable después.

---

## 2. Pedagogía del bajo: qué enseñan los métodos reconocidos

**[Hecho] Hal Leonard Bass Method, libro 1 (Ed Friedland, 2.ª ed.).** Afinación, posición, símbolos musicales, notas en los cinco primeros trastes, líneas de bajo, patrones y ritmos habituales, ritmos hasta corcheas y consejos técnicos.\[7\] Los libros 2 y 3 existen también en una edición completa.\[8\]
**[Inferencia]** La progresión es lenta, empieza por lectura en posición y usa mucho repertorio.

**[Hecho] BassBuzz, *Beginner to Badass*.** La lista oficial de temas incluye:
- Afinación, el sistema de 12 notas, mano derecha con pulsación alterna y "moveable anchor", y técnica de mano izquierda.
- Ritmo (redondas a corcheas, silencios), síncopa, lectura de tablatura, lectura de partitura (clave de Fa, ligaduras, repeticiones) y compases de 4/4, 3/4, 6/8 y 12/8.
- Notas del mástil, shuffle, "two-beat feel" y blues de 12 compases.
- Escalas cromática, de blues, mayor, menor y pentatónicas, e intervalos.
- Creación de líneas, notas de paso cromáticas, fundamentales, arpegios y tríadas, progresiones, números Nashville y progresiones diatónicas.
- Walking bass, apagado de cuerdas, tresillos, octavas, slap y pop, armaduras, púa, entrenamiento auditivo y transcripción.
- Articulación, dinámica, tocar con batería y "Practicing Made Unboring" (rutinas de práctica).\[6\]

**[Inferencia] Patrón común de los métodos modernos:**
1. La técnica y el ritmo van antes que la teoría.
2. La teoría se introduce aplicada a líneas de bajo (fundamental → quinta/octava → arpegios → escalas → notas de paso), no como materia aislada.
3. La tablatura primero y la notación después, de forma progresiva.
4. Los estilos (blues, rock, funk, country, walking) sirven de vehículo para aprender *feels* rítmicos.
5. Las rutinas de práctica y el oído se enseñan de forma explícita.

**[Opinión] Papel de los acordes en el bajo.** El bajo rara vez toca acordes plenos. Lo que tiene que saber es qué notas los forman (arpegios, "chord tones") y cómo moverse entre ellos. La sección "Acordes" de la app debe llamarse y funcionar como **arpegios y notas del acorde**, con los acordes armónicos como contexto.

**Currículo propuesto [Opinión, basado en lo anterior]**

| Módulo | Contenido | Práctica clave |
|---|---|---|
| 0. Arranque | Partes del bajo, afinación, postura (sentado/de pie), altura de la correa, ampli/EQ básico | Afinar; pulsar cuerdas al aire con metrónomo a 60 |
| 1. Mano derecha | Pulsación alterna, apoyo, apagado con mano derecha | Negras y corcheas en cuerdas al aire, cambios de cuerda |
| 2. Mano izquierda | Un dedo por traste, presión mínima, cromático 1-2-3-4 | Ejercicios cromáticos, coordinación |
| 3. Ritmo I | Pulso, subdivisión, negra/corchea/silencios, contar en voz alta | Palmas + bajo, escalera de tempo |
| 4. Lectura | Tablatura; introducción a la clave de Fa | Leer 8 compases en tab y en partitura |
| 5. Mástil | Notas en cuerdas E y A, octavas, patrón de 12 trastes | Encontrar notas contra reloj (quiz de mástil) |
| 6. Intervalos y fundamentales | Fundamental, quinta, octava | Líneas R-5-8 sobre progresiones I-IV-V |
| 7. Arpegios | Tríadas mayor y menor, luego cuatriadas (maj7, m7, 7) | Arpegios sobre backing, en dos posiciones |
| 8. Escalas | Mayor, menor natural, pentatónicas y blues | Escalas en patrón y aplicadas a una línea |
| 9. Groove y feels | Síncopa, shuffle, two-beat, 12/8, muting, dinámica | Grooves por estilo con batería |
| 10. Blues y walking | Blues de 12 compases, notas de paso cromáticas, walking básico | Walking de negras sobre blues en F y Bb |
| 11. Oído | Intervalos, identificar fundamentales, transcribir líneas sencillas | Ejercicios de oído y transcripción |
| 12. Técnicas extra (intermedio) | Octavas funk, slap y pop, púa, armónicos | Grooves específicos |

---

## 3. Análisis competitivo

| Producto | Qué hace bien | Debilidad relevante para ti | Fuente/nota |
|---|---|---|---|
| **Yousician** | Detección por micrófono con feedback de nota y tiempo, motivación | Su centro de ayuda indica que funciona "con cualquier bajo real de 4 cuerdas" en afinación estándar E-A-D-G y avisa de problemas de reconocimiento si afinas con otro afinador que no sea el suyo. El reconocimiento sufre con ruido y efectos. Enfoque de juego | Soporte oficial de Yousician y reseñas **[Hecho]** |
| **Fender Play** | Ruta guiada, lecciones cortas; guitarra, bajo y ukelele | Guitar Chalk le da la nota más baja en calidad educativa entre los programas que analizó **[Hecho, fuente secundaria con opinión]**\[9\] | Guitar Chalk |
| **Rocksmith+** (Ubisoft) | Aprender con canciones, bajo incluido, micrófono del móvil vía app Connect\[10\] | Juego basado en canciones con licencia; poca teoría y técnica guiada **[Opinión de reseñas]**\[11\]\[12\] | Nota de prensa de Ubisoft (2021) |
| **BassBuzz** | Currículo lineal y completo para principiantes, humor, backing tracks | Es vídeo más PDF: sin herramientas interactivas ni repaso espaciado **[Inferencia]** | Web oficial |
| **Scott's Bass Lessons / TalkingBass** | Profundidad en teoría, *chord tones* y lectura (TalkingBass destaca por sus cursos de escalas y de notas del acorde) | Más densos para el principiante absoluto, según usuarios de TalkBass **[Opinión de foro]** | Hilo de TalkBass |\[13\]
| **Songsterr / visores de Guitar Pro** | Tablatura reproducible, bucles | Repertorio con licencia; no es un curso | — |

**[Inferencia] Huecos que puede cubrir tu app:**
1. En español, con ambas nomenclaturas.
2. Currículo más herramientas integradas en la misma pantalla: la lección *es* el mástil interactivo y el metrónomo, no un vídeo con un PDF.
3. Repaso espaciado de ejercicios de técnica y mástil, algo que no aparece en ninguno de los productos analizados.
4. Configuración real de 4, 5 y 6 cuerdas y modo zurdo desde el diseño.
5. Uso offline y sin cuenta.

---

## 4. Funciones priorizadas

### MVP (Fases 1–3)

1. **Motor de lecciones.** Lecciones en MDX con componentes incrustados. Navegación por módulos. Modo "siguiendo la clase" con pantalla siempre encendida si el navegador lo permite **[Hipótesis: Wake Lock API, verificar soporte]**, texto grande y un botón "siguiente paso".
2. **Mástil interactivo (SVG).**
   - Escalas, arpegios, intervalos y notas.
   - 4, 5 y 6 cuerdas; afinaciones estándar y alternativas (drop D, etc.); zurdo (espejo horizontal).
   - Etiquetas por nota, grado o intervalo; resaltado de fundamental; 12 a 24 trastes.
   - Sonido al pulsar una nota.
3. **Metrónomo preciso.**
   - Rango de BPM, compases y subdivisiones, acentos, tap tempo.
   - Escalera de tempo automática: sube X BPM cada N compases o después de marcar un "pase".
   - Indicador visual grande del pulso.
4. **Visor de tablatura y notación con reproducción.** Bucle A-B y control de tempo (alphaTab).
5. **Ejercicios con criterio de superación.** Tempo objetivo más una lista de autoevaluación.
6. **Progreso local.** Lecciones completadas, tempo máximo limpio por ejercicio, registro de sesiones.
7. **PWA offline.** Todo el contenido del curso cacheado.
8. **Diccionario de teoría.** Escalas y arpegios generados con Tonal.js y mostrados en el mástil.

### Posterior (Fases 4–6)

- **Repaso espaciado.** Cola diaria de ejercicios y tarjetas de mástil e intervalos. Un algoritmo simple tipo Leitner basta.
- **Rutinas de práctica.** Plantillas de 15, 30 y 45 minutos (calentamiento → técnica → mástil → groove → repertorio), con alternancia de tareas.
- **Entrenamiento auditivo.** Intervalos, identificación de fundamentales, dictado rítmico.
- **Backing tracks y baterías.** Generadas por síntesis y samples propios.
- **Afinador por micrófono (experimental)** con aviso de precisión; como alternativa, tono de referencia para afinar de oído.
- **Grabarse y escucharse dentro de la app.**
- **Sincronización opcional en la nube** si se amplía a varios usuarios.

### Fuera de alcance, explícitamente

- Corrección automática de interpretación, repertorio comercial con licencia, vídeo propio a gran escala y funciones sociales.

---

## 5. Viabilidad técnica y stack

### 5.1 Hechos técnicos clave

**Metrónomo [Hecho].**
- El artículo "A Tale of Two Clocks" (Chris Wilson, web.dev) explica que Web Audio da acceso al reloj de hardware de audio.\[14\]
- La técnica correcta combina un temporizador JavaScript que se dispara "cada cierto tiempo" con la programación anticipada de cada nota sobre `AudioContext.currentTime`.\[14\]
- El propio artículo propone empezar con "100 ms de lookahead" e intervalos de 25 ms, los mismos valores que usa el ejemplo de secuenciación de MDN (`lookahead = 25.0` ms y `scheduleAheadTime = 0.1` s). `setInterval` por sí solo produce deriva acumulada.
- **Criterio de aceptación:** cero uso de `setTimeout` o `setInterval` para disparar sonidos.

**Afinador [Hecho].**
- Cuerdas al aire del bajo: E1 41,20 Hz · A1 55,00 · D2 73,42 · G2 98,00\[15\] (la B0 del 5 cuerdas está a unos 30,87 Hz).
- Los métodos por autocorrelación (YIN, MPM) "necesitan al menos dos periodos" y sufren "errores de octava".\[16\]
- **[Inferencia, cálculo propio]** Un periodo de E1 dura unos 24,3 ms, así que dos periodos son unos 48,5 ms. A 48 kHz, una ventana de 2048 muestras (42,7 ms) no basta. Hacen falta 4096 o más (unos 85 ms), y para B0 más aún. Resultado: más latencia y más sensibilidad a los armónicos, que en el bajo suelen ser más fuertes que la fundamental cuando se capta con el micrófono del móvil.
- **Recomendación:** YIN o MPM con ventana adaptativa, bloqueo de rango por cuerda seleccionada y comprobación de octava.

**iOS/iPadOS [Hecho, fuentes primarias de WebKit].**
- `getUserMedia` funciona en web apps instaladas en pantalla de inicio desde **iOS/iPadOS 13.4** (bug 185448 de WebKit, "RESOLVED FIXED").\[17\]
- Almacenamiento: desde Safari 17 / iOS 17, una web app en modo standalone "tiene la misma cuota de origen y cuota global que cuando se abre en un navegador". `navigator.storage.persist()` se concede "según heurísticas como si el sitio está abierto como Home Screen Web App" (WebKit, "Updates to Storage Policy", 2023).\[18\]
- El límite de 7 días de ITP para almacenamiento escrito por scripts **no se aplica** al dominio propio de una web app de pantalla de inicio (WebKit, "Tracking Prevention").\[19\]
- **[Conflicto de fuentes]** Varios blogs de 2026 siguen repitiendo que iOS impone "50 MB" y "borra a los 7 días".\[20\]\[21\] Eso contradice la documentación primaria de WebKit citada arriba. Doy prioridad a WebKit, pero hay que probarlo en un dispositivo real.
- **Procesado de audio en iOS:** con `echoCancellation: false` Safari desactiva también el control automático de ganancia (WebKit bug 179411).\[22\] `autoGainControl` como restricción independiente sigue sin implementar (bug 204444, estado NEW).\[23\] No encontré fuente primaria sobre filtros paso-alto que afecten a unos 41 Hz; **hay que medirlo en un dispositivo real**.
- **[Conflicto resuelto con fuente primaria]** Algunas fuentes secundarias afirman que en la UE las PWA no se abren en modo standalone desde iOS 17.4. La fuente primaria lo desmiente: en la página "Update on apps distributed in the European Union" de Apple Developer (1 de marzo de 2024), Apple anunció que seguiría ofreciendo en la UE las web apps de pantalla de inicio y que su funcionalidad volvería "con la disponibilidad de iOS 17.4". Aun así te afecta directamente si vives en España: pruébalo en tu iPhone.

**Notación, tablatura y teoría [Hecho].**
- **alphaTab** renderiza notación y tablatura y las reproduce en el navegador (sintetizador alphaSynth sobre Web Audio). Lee Guitar Pro 3–7, MusicXML y su propio formato de texto **alphaTex**.\[24\]\[25\] Licencia MPL-2.0.\[26\]
- **Tonal.js** (paquete `tonal`, v6.x en npm) es TypeScript con funciones puras para notas, intervalos, acordes, escalas, modos y tonalidades. "Trabaja con abstracciones, no con sonido".\[27\]\[28\]
- **[No verificado en esta investigación]** VexFlow y OpenSheetMusicDisplay (alternativas de notación) y Tone.js (síntesis y secuenciación). Son opciones conocidas; evalúalas en la Fase 0 si alphaTab no encaja.

**Accesibilidad [Hecho].** WCAG 2.2, criterio 2.5.8 (nivel AA): objetivos táctiles de al menos 24×24 px CSS. El 2.5.5 (AAA) pide 44×44.\[29\]
**[Opinión]** Para una app que usas con el bajo colgado y a un metro del móvil, apunta a 48 px o más en los controles principales.

### 5.2 Stack recomendado [Opinión]

| Capa | Recomendación | Alternativa | Por qué |
|---|---|---|---|
| Lenguaje | TypeScript estricto | — | Modelo de contenido tipado; Claude Code rinde mejor con tipos |
| Framework | **Vite + React** (SPA) | Astro + islas React (colecciones de contenido con esquema) · SvelteKit | Estado de app persistente entre pantallas (metrónomo sonando mientras navegas). React tiene el ecosistema más amplio |
| Contenido | **MDX** para lecciones + **frontmatter validado con Zod** + ejercicios en **alphaTex** dentro del repo | JSON puro | MDX permite prosa con `<Fretboard/>`, `<Metronome/>` o `<Tab/>` incrustados; alphaTex es texto y se versiona en git |
| Teoría | Tonal.js | Código propio | Probado; evita errores de enarmonía |
| Tab/notación + reproducción | alphaTab | VexFlow (solo render) | Tab más partitura más reproducción en una sola librería |
| Audio | Web Audio nativo (metrónomo, tonos) + samples propios | Tone.js | Menos dependencias en el núcleo más crítico |
| Estado/persistencia | Zustand + IndexedDB (con wrapper tipo Dexie) | localStorage (solo ajustes) | Progreso y registro de sesiones sin backend |
| PWA | Service worker con precache del curso (Workbox o equivalente) | — | Offline |
| Estilos | CSS con variables (tokens de diseño) + CSS Modules o Tailwind | — | Temas (ampli oscuro, alto contraste) |
| Tests | Vitest (lógica de teoría, scheduler) + Playwright (flujos, móvil) | — | Criterios de aceptación automatizables |
| Backend | **Ninguno** en el MVP; más adelante, sincronización opcional | Supabase/Firebase | Uso personal; menos superficie de fallo |

---

## 6. Dirección visual: "cabezal de ampli" sin parecerse a Orange

### 6.1 Qué hace reconocible a Orange (lo que hay que evitar combinar)

**[Hecho]**
- **Palabra ORANGE:** registrada para amplificación en la clase 9 (amplificadores) y la clase 15 (instrumentos) (Lexology).\[3\]
- **Escudo:** creado en 1970 por Cliff Cooper y hoy "parte esencial de la librea de la marca" (web oficial de Orange).\[30\]
- **Marco y color:** el diseño "picture frame" de las fundas y cajas, junto con el color, fue su seña de identidad desde 1968.\[31\]\[32\]
- **Pictogramas:** desde 1971 usan símbolos gráficos en los controles en lugar de texto (el ampli "Pics Only").\[33\]
- **Logotipo:** es rotulación personalizada, no una fuente descargable.\[34\]
- **Color:** según un análisis de un abogado de marcas (fuente secundaria), en EE. UU. Orange no tiene registrado el color naranja como marca para amplificadores. **[Hecho, secundario]**\[35\]

**[Inferencia, no es asesoramiento legal]**
- El riesgo no está en un elemento suelto, sino en **combinar** varios: naranja dominante + marco tipo picture frame + pictogramas en los potes + tipografía redondeada o psicodélica + escudo heráldico. Esa combinación sugeriría afiliación.
- La doctrina del *trade dress* protege la "imagen global" si es distintiva y no funcional, y el criterio central es la probabilidad de confusión.\[36\]\[37\]
- Para uso personal el riesgo práctico es muy bajo. Si la app se publica o se monetiza, sube.

### 6.2 Propuesta de identidad propia [Opinión]

**Concepto: "cabezal de bajo a válvulas", genérico del género.**
- **Estructura de pantalla = frontal de un cabezal:**
  - Barra superior como "panel" metálico cepillado con el nombre de la app en una placa.
  - Contenido sobre fondo "tolex" oscuro con textura sutil.
  - Rejilla (grill cloth) solo como decoración en cabeceras o en la pantalla de inicio, nunca detrás del texto.
- **Controles:**
  - Potes con escala 0–10 solo donde un pote es la interacción natural: BPM, volumen de clic, tempo del backing.
  - Siempre con alternativa de botones ±, entrada numérica y arrastre vertical accesible.
  - Interruptores de palanca para on/off (metrónomo, bucle).
- **Piloto (jewel light):** LED rojo o ámbar que parpadea con el pulso del metrónomo. Es funcional, no solo decorativo.
- **VU/aguja:** para el afinador (aguja de cents) y como indicador de tiempo del metrónomo.
- **Paleta:** para diferenciarte de Orange, evita el naranja saturado como color de marca. Opciones:
  - **"Crema y negro"** (tolex negro, panel crema, acentos ámbar). **[Nota: recuerda a la estética clásica de otros fabricantes; úsala genérica, sin logotipos ni formas de placa concretas]**
  - **"Verde quirófano"** (verde azulado apagado con blanco roto).
  - **"Burdeos"** (tolex granate, panel metálico, rotulación blanca).
  - Si quieres naranja, úsalo **solo como acento** (piloto, estado activo), no como fondo.
- **Tipografía:** sans condensada industrial para rótulos de panel y una sans muy legible para el cuerpo del texto. Nada de rotulación psicodélica redondeada.
- **Iconografía de controles:** texto claro (en español) y no pictogramas crípticos. Además de alejarte de Orange, es más usable.

**Equilibrio entre skeuomorfismo y usabilidad [Opinión].** Aplica el skeuomorfismo en el *marco* (cabecera, metrónomo, afinador) y usa un diseño plano y legible en el *contenido* (lecciones, mástil, tablatura). Hay que evitar potes giratorios como único control en móvil, texturas bajo el texto y bajo contraste "vintage".

**Accesibilidad mientras tocas:**
- Texto base de 18 px o más en modo clase y botón "siguiente" de 48 px o más.
- Contraste AA como mínimo.
- Modo "atril" horizontal en tablet.
- Toda interacción crítica con una sola pulsación, sin gestos finos.
- El pulso del metrónomo también en visual, para quien toque con cascos o en entornos ruidosos.

### 6.3 Alternativas estilísticas

1. **"Pedalera/stompbox":** módulos como pedales, con un pedal por herramienta. Encaja muy bien con el móvil.
2. **"Estudio de grabación":** consola, cinta, VU.
3. **"Cuaderno de músico":** papel pautado y tinta. Muy legible, menos espectacular.

**[Opinión]** El cabezal para la estructura general y los "pedales" para las herramientas es una combinación con carácter que funciona bien en móvil.

---

## 7. Modelo de datos del contenido

```ts
// src/content/schema.ts (validado con Zod en build)
type Tuning = { id: string; name: string; strings: string[] }; // ["B0","E1","A1","D2","G2"]
type Level = "principiante" | "intermedio";

interface Module { id: string; order: number; title: string; summary: string; lessons: string[] }

interface Lesson {
  id: string; moduleId: string; order: number; title: string;
  level: Level; durationMin: number;
  objectives: string[];              // qué sabrás hacer al terminar
  prerequisites: string[];           // ids de lecciones
  concepts: string[];                // "fundamental", "quinta", "corchea"...
  steps: Step[];                     // modo "siguiendo la clase"
  exercises: string[];               // ids de ejercicios
  review: { afterDays: number[] };   // p. ej. [1, 3, 7, 21]
}

type Step =
  | { kind: "text"; mdx: string }
  | { kind: "fretboard"; view: FretboardView }
  | { kind: "tab"; alphaTex: string; loop?: [number, number] }
  | { kind: "audio"; src: string; caption?: string }
  | { kind: "exercise"; exerciseId: string };

interface Exercise {
  id: string; title: string; instructions: string;
  notation: { alphaTex: string };    // tab + partitura
  tempo: { start: number; target: number; step: number };
  timeSignature: string; feel?: "straight" | "swing" | "shuffle";
  backing?: { drums?: string; harmony?: string[] }; // p. ej. ["F7","Bb7",...]
  passCriteria: string[];            // "sin trastear", "a tiempo con el clic", "sin tensión"
  tags: string[];                    // para rutinas e interleaving
}

interface FretboardView {
  mode: "scale" | "arpeggio" | "interval" | "notes";
  root: string; type?: string;       // tipo en nomenclatura de Tonal.js
  frets: [number, number]; labels: "note" | "degree" | "interval";
}

// Estado del usuario (IndexedDB)
interface ExerciseProgress { exerciseId: string; bestCleanBpm: number; lastPracticed: string; box: number; history: {date: string; bpm: number; passed: boolean}[] }
interface Settings { tuningId: string; leftHanded: boolean; notation: "latina" | "anglo"; clickSound: string; theme: string }
```

**[Opinión]** Guardar ejercicios como alphaTex (texto) y lecciones como MDX significa que el contenido se versiona en git, Claude Code puede generarlo y validarlo, y tú puedes revisarlo en diffs.

---

## 8. Hoja de ruta por fases

| Fase | Entregables | Criterios de aceptación |
|---|---|---|
| **0. Especificación y andamiaje** (1 semana) | `CLAUDE.md`, `docs/spec.md`, `docs/design-tokens.md`, repositorio Vite+React+TS, lint, Vitest, Playwright, CI; prueba de concepto de alphaTab con un ejercicio alphaTex | `npm test` y `npm run build` en verde; la PoC renderiza tab más partitura y suena en Chrome Android y Safari iOS |
| **1. Herramientas núcleo** | Mástil SVG (4/5/6 cuerdas, zurdo, etiquetas), metrónomo con lookahead, diccionario de escalas y arpegios con Tonal.js | Tests unitarios de notas por traste y afinación; metrónomo sin deriva medible en 10 minutos (test con `OfflineAudioContext` o registro de tiempos programados); la versión zurda es el espejo exacto |
| **2. Motor de lecciones** | Esquema Zod, render MDX con componentes, modo "siguiendo la clase", **módulos 0–3 completos (unas 10 lecciones)** | Un build falla si el contenido no cumple el esquema; cada lección tiene objetivos, ejercicio y criterio; se puede usar a un metro de distancia (revisión manual en móvil) |
| **3. Progreso + PWA offline** | IndexedDB, registro de tempo limpio, `persist()`, service worker, manifest, iconos | Modo avión: todo el curso funciona; el progreso sobrevive a reinicios; Lighthouse PWA/accesibilidad ≥ 90 **[Opinión: umbral]** |
| **4. Práctica inteligente** | Repaso espaciado (Leitner), rutinas con alternancia, escaleras de tempo, quiz de mástil | La cola diaria se genera a partir del historial; tests del algoritmo |
| **5. Audio avanzado** | Backing tracks (batería más línea armónica), entrenamiento auditivo, afinador experimental | Afinador: error < ±3 cents con tono de referencia sintético; en bajo real, test documentado por dispositivo **[Opinión: umbral]** |
| **6. Diseño "cabezal" y pulido** | Tema completo, pilotos, VU, modo atril, alto contraste | WCAG 2.2 AA; objetivos ≥ 24 px (≥ 48 px en controles principales) |
| **7. Contenido restante** | Módulos 4–12 | Revisión pedagógica por módulo (ver §10) |
| **8. (Opcional) Multiusuario** | Autenticación y sincronización | Solo si se decide publicar |

**[Opinión]** El diseño visual completo va en la Fase 6 a propósito. Antes basta con tokens de diseño y una estructura de cabezal sencilla. Así evitas pulir pantallas que todavía van a cambiar.

---

## 9. Cómo organizar el trabajo con Claude Code

**[Hecho, documentación oficial de Claude Code]**
- `CLAUDE.md` se carga al inicio de cada sesión. La documentación recomienda "menos de 200 líneas por archivo" porque los archivos largos "reducen la adherencia".\[38\]
- Se pueden importar otros archivos con `@ruta` y crear reglas por ruta en `.claude/rules/`.\[38\]
- `/init` genera un borrador.\[38\]
- Claude trata `CLAUDE.md` "como contexto, no como configuración impuesta". Para bloquear acciones de verdad hay que usar *hooks*.\[38\]
- Las instrucciones deben ser verificables ("Ejecuta `npm test` antes de hacer commit" en lugar de "prueba tus cambios").\[38\]

**Estructura de repositorio propuesta**

```
/CLAUDE.md                 ← <200 líneas: propósito, comandos, reglas
/docs/spec.md              ← este documento, resumido como especificación
/docs/roadmap.md           ← fases y criterios de aceptación
/docs/content-guide.md     ← cómo escribir una lección (plantilla)
/docs/design-tokens.md
/.claude/rules/content.md  ← reglas solo para src/content/**
/.claude/rules/audio.md    ← reglas solo para src/audio/**
/src/audio/                ← scheduler, click, tuner (aislado, testeado)
/src/theory/               ← wrappers de Tonal.js, afinaciones, mapeo de mástil
/src/components/           ← Fretboard, Metronome, TabView, Knob, Pilot...
/src/content/modules/*/    ← lessons/*.mdx, exercises/*.atex, schema.ts
/src/state/                ← stores, IndexedDB
/tests/ , /e2e/
```

**Borrador de `CLAUDE.md`**

```md
# Bajo·Lab — profesor de bajo (PWA)
Profesor de bajo eléctrico, en español, offline, sin backend.
Especificación: @docs/spec.md · Hoja de ruta: @docs/roadmap.md

## Comandos
- npm run dev · npm test · npm run test:e2e · npm run build · npm run content:check

## Reglas
- TypeScript strict; sin `any`.
- Audio: NUNCA disparar sonidos con setTimeout/setInterval; programar sobre AudioContext.currentTime (lookahead ~25 ms, margen ~100 ms).
- AudioContext se crea/reanuda solo tras un gesto del usuario (requisito iOS).\[39\]
- Teoría musical siempre vía src/theory (Tonal.js); no calcular notas a mano en componentes.
- Mástil: debe soportar 4/5/6 cuerdas, afinaciones arbitrarias y zurdo.
- Contenido: toda lección cumple src/content/schema.ts; `npm run content:check` debe pasar.
- No incluir tablaturas, letras ni audio de canciones con copyright; solo ejercicios originales o de dominio público.
- UI: objetivos táctiles ≥ 48 px en controles principales; contraste WCAG AA.
- Trabaja por fase: lee docs/roadmap.md, implementa SOLO la fase indicada, ejecuta tests y resume qué criterios cumple.
```

**Flujo de trabajo [Opinión]:**
1. Una sesión o rama por entregable de fase.
2. Pídele primero un plan (modo plan) contrastado con los criterios de aceptación y después la implementación.
3. Nunca le pidas "haz la app". Pídele "implementa la Fase 1, entregable 'metrónomo', con estos tests".
4. Revisa tú el contenido pedagógico. Claude Code puede redactar borradores de lecciones y ejercicios en alphaTex, pero **debes tocarlos todos** antes de darlos por buenos.
5. Si repite errores, añade la regla a `CLAUDE.md` o `.claude/rules/`, como recomienda la documentación.\[38\]

---

## 10. Contenido pedagógico y derechos de autor

**Creación de contenido [Opinión]:**
- **Plantilla fija por lección:** objetivo → por qué importa → demostración → ejercicio (tempo inicial y objetivo) → errores comunes → autoevaluación → repaso.
- **Ejercicios originales**, generados o paramétricos cuando se pueda. Una línea R-5-8 se puede generar para cualquier progresión con Tonal.js, lo que multiplica el contenido sin escribirlo a mano.
- **Audio:** usa síntesis o samples propios para la demostración; grabarte tú aporta mucho y no plantea problemas de derechos.
- **Validación:** toca tú cada ejercicio y, si puedes, pide a un profesor de bajo que revise los módulos 0–3 antes de escribir el resto.
- **Ritmo realista:** 1–2 lecciones de calidad por semana si las escribes tú. **[Hipótesis]**

**Derechos de autor [Hecho]:**
- En 2006, la NMPA y la MPA amenazaron con acciones legales a webs de tablaturas; Guitar Tab Universe publicó el aviso el 17 de julio de 2006.\[40\]\[41\]
- La MPA sostiene que las tablaturas "no eluden el copyright por ser interpretaciones personales".\[42\]
- Después llegaron las licencias: Musicnotes y la Harry Fox Agency (2007, MXTabs); Ultimate Guitar y la Harry Fox Agency (10 de abril de 2010).\[43\]\[44\]
- **[Inferencia]** Transcribir una línea de bajo de una canción con copyright y distribuirla requiere licencia de la editorial. Para uso estrictamente personal el riesgo es mínimo, pero no la metas en un repositorio público ni en una app publicada.
- **[Opinión]** Usa ejercicios originales "al estilo de" (un groove motown genérico, un blues en F) y enlaza a fuentes con licencia (Songsterr, libros) para las canciones reales.
- **[Nota]** No soy abogado. Si publicas o monetizas, consulta a un profesional sobre marcas (§6) y derechos musicales.

---

## 11. Riesgos y decisiones abiertas

| Riesgo | Prob./Impacto | Mitigación |
|---|---|---|
| El contenido no se termina | Alta/Alta | MVP con módulos 0–3; ejercicios paramétricos; opción de "compañero de un método existente" |
| La app se vuelve pasiva de verdad (lees, no tocas) | Media/Alta | Cada lección bloquea "completar" hasta registrar un intento con tempo |
| Afinador poco fiable en iOS o micrófonos de móvil | Alta/Media | Fase 5, marcado experimental; tono de referencia; recomendar afinador de pinza |
| Almacenamiento o standalone en iOS (UE) | Media/Media | Probar en dispositivo en la Fase 0; `persist()`; exportar e importar el progreso a JSON |
| Skeuomorfismo que perjudica la usabilidad | Media/Media | Regla: decoración solo en el marco; tests de objetivos táctiles |
| Parecido excesivo con Orange | Baja (uso personal)/Alta (si se publica) | Lista de "no combinar" (§6.1); paleta propia |
| Calidad del sintetizador de alphaTab | Media/Baja | Soundfont propio más ligero **[Hipótesis]**; samples propios para demos clave |

**Decisiones abiertas que debes tomar tú:**
1. ¿Currículo propio completo o compañero de un método existente? (Recomiendo: híbrido, con 30 lecciones propias.)
2. ¿Nomenclatura por defecto, latina o anglosajona?
3. ¿Paleta: crema/negro, verde, burdeos o naranja solo como acento?
4. ¿Se publicará algún día? Eso cambia las decisiones de marca, licencias y backend.
5. ¿Grabas tú los audios de demostración o se usa solo síntesis?

---

## 12. Recomendación final

1. **Sigue adelante con la web/PWA**, pero redefine "pasiva" como "guiada y sin fricción, con práctica activa obligatoria".
2. **Fase 0 esta semana:** crea el repositorio, `CLAUDE.md` y la prueba de concepto de alphaTab y del metrónomo **probada en tu propio móvil**. Si tienes iPhone, prueba también el micrófono y el modo standalone.
3. **Escribe tú las 3 primeras lecciones a mano** con la plantilla antes de pedir a Claude Code que genere más. Serán el patrón de calidad.
4. **Diseño:** cabezal genérico con paleta propia; deja el pulido para la Fase 6.

---

## Caveats

- Las cifras de práctica deliberada son correlacionales y están en debate (Macnamara vs. Ericsson). No prueban qué método de app funciona mejor.
- La evidencia sobre espaciado y alternancia en música es limitada y heterogénea.
- El comportamiento del audio en iOS cambia con cada versión. Lo aquí citado procede de bugs y posts de WebKit hasta 2025–2026, y el filtrado de graves no está documentado: hay que medirlo.
- Las valoraciones de competidores proceden en parte de reseñas y foros con opinión; se han marcado como tal.
- Nada de lo anterior es asesoramiento legal.

## Sources

1. [Macnamara et al (2014) meta-analysis on deliberate practice not convincing](https://www.progressfocused.com/2014/11/macnamara-et-al-2014-meta-analysis-on.html)
2. [Sub-bass](https://en.wikipedia.org/wiki/Sub-bass)
3. [Orange or Orange? The importance of trade mark protection - Lexology](https://www.lexology.com/library/detail.aspx?g=380afdbc-6954-49e3-bccd-73f55f022b50)
4. [Optimizing Music Learning: Exploring How Blocked and Interleaved Practice Schedules Affect Advanced Performance - PubMed](https://pubmed.ncbi.nlm.nih.gov/27588014/)
5. [Lack of spacing effects during piano learning](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0182986)
6. [Beginner To Badass: Lessons Overview | BassBuzz.com](https://www.bassbuzz.com/beginner-to-badass/lessons-overview)
7. [Hal Leonard Bass Method Book 1](https://www.halleonard.com/product/695068/hal-leonard-bass-method-book-1-2nd-edition)
8. [Bass Method Series Hal Leonard Online](https://www.halleonard.com/menu/499/hal-leonard-bass-method?seriesfeature=BSMTHD)
9. [Fender Play Review (2026): Features, Cost, and Is It Worth It?](https://www.guitarchalk.com/fender-play-review/)
10. [Ubisoft Reveals Rocksmith the Future of Interactive Music Learning](https://www.businesswire.com/news/home/20210612005018/en/Ubisoft-Reveals-Rocksmith-the-Future-of-Interactive-Music-Learning)
11. [Fender Play VS Rocksmith (comparison) - Guitar Chalk](https://www.guitarchalk.com/fender-play-vs-rocksmith/)
12. [Fender Play vs Rocksmith: Can Technology Ever Replace Real Teachers?](https://guitarspace.org/tips/fender-play-vs-rocksmith/)
13. [Which online lesson site is most "structured" for beginners?](https://www.talkbass.com/threads/which-online-lesson-site-is-most-structured-for-beginners.1558593/)
14. [A tale of two clocks](https://web.dev/articles/audio-scheduling)
15. [Pitch Detector: Free Online Pitch Finder (Mic or MP3)](https://pitchdetector.com/)
16. [Pitch detection algorithm](https://en.wikipedia.org/wiki/Pitch_detection_algorithm)
17. [185448 – getUserMedia not working in apps added to home screen that run in standalone mode](https://bugs.webkit.org/show_bug.cgi?id=185448)
18. [Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/)
19. [Tracking Prevention in WebKit](https://webkit.org/tracking-prevention/)
20. [PWA iOS Limitations and Safari Support \[2026\]](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
21. [PWA on iOS: Limitations, Workarounds, and Safari Quirks](https://blog.hashhackers.com/blog/pwa-ios-limitations/)
22. [179411 – getUserMedia echoCancellation constraint has no affect](https://bugs.webkit.org/show_bug.cgi?id=179411)
23. [204444 – Add support for https://w3c.github.io/mediacapture-main/#def-constraint-autoGainControl](https://bugs.webkit.org/show_bug.cgi?id=204444)
24. [GitHub - CoderLine/alphaTab: alphaTab is a cross platform music notation and guitar tablature rendering library. · GitHub](https://github.com/CoderLine/alphaTab)
25. [CoderLine/alphaTab](https://deepwiki.com/CoderLine/alphaTab)
26. [Alpha Tab - JavaScripting](https://www.javascripting.com/view/alphatab)
27. [tonal - npm](https://www.npmjs.com/package/tonal)
28. [GitHub - tonaljs/tonal: A music theory library for Javascript · GitHub](https://github.com/tonaljs/tonal)
29. [What Is the WCAG 2.5.8 Target Size Minimum and How Do You Meet It?](https://testparty.ai/blog/wcag-target-size-guide)
30. [1970](https://orangeamps.com/articles/1970-creating-the-orange-identity/)
31. [Orange Music Electronic Company](https://en-academic.com/dic.nsf/enwiki/568718)
32. [ORANGE AMPLIFICATION RETRO T-SHIRT, BLACK WITH ORANGE LOGO, Size M](https://www.ebay.com/itm/276451078512)
33. [Orange Amps](https://en.wikipedia.org/wiki/Orange_Amps)
34. [What Font Does Orange Use? (2026)](https://madegooddesigns.com/orange-amps-font/)
35. [Trademark Case Study: ORANGE amplifiers |](https://trademarkdoctor.net/federal-trademarks/203752/)
36. [TRADEMARK INFRINGEMENT LITIGATION: PRODUCT DESIGNS THAT ARE FUNCTIONAL MAY NOT BE SUBJECT TO TRADE DRESS PROTECTION](https://www.mavricklaw.com/blog/trademark-infringement-litigation-product-designs-that-are-functional-may-not-be-subject-to-trade-dress-protection/)
37. [Trade Dress Under the Law](https://www.justia.com/intellectual-property/trademarks/trade-dress/)
38. <https://code.claude.com/docs/en/memory>
39. [Fretwork: pitch detection from the microphone · Issue #11 · djdietrick/mini-app-stack](https://github.com/djdietrick/mini-app-stack/issues/11)
40. [Are You Violating Copyright Law When Posting Tab - The Steel Guitar Forum](https://bb.steelguitarforum.com/viewtopic.php?p=378966)
41. [Music Industry Goes After Guitar Tablature Sites : NPR](https://npr.org/templates/story/story.php?storyId=5622879)
42. [Music Publishers Association](https://en.wikipedia.org/wiki/Music_Publishers_Association)
43. [Copyright issues for publishing tab?](https://www.tdpri.com/threads/copyright-issues-for-publishing-tab.222119/)
44. [MXTabs](https://en.wikipedia.org/wiki/MXTabs)
