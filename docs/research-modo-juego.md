# Investigación: modo juego con detección (pista de notas, estilo rhythm game)

_Abierta el 2026-10-04 · Estado: **sin decidir** · No implementar nada hasta cerrar §6 (decisiones) y la spike S1._

> **Cómo usar este documento (ahorro de contexto).** Es autosuficiente: una sesión de investigación lee **solo este
> archivo** y los ficheros de código de §2 que vaya a tocar. No cargues `research.md`, `pedagogy.md` ni `decisions.md`
> enteros (≈128 KB entre los tres); si hace falta algo de ellos, `grep` por encabezado. Reglas completas en §9.

## 0. TL;DR

- **No hace falta una app de escritorio para empezar.** La PWA ya tiene micrófono sin procesado, detector YIN propio,
  alphaTab con reproducción y ejercicios cuyas notas esperadas se conocen (alphaTex). Yousician y Rocksmith+ funcionan
  en móvil. **[Hecho]** (Rocksmith+: PC, PS5, iOS y Android según la tienda de Ubisoft.)
- **El cuello de botella no es la plataforma**, sino tres cosas medibles: (a) latencia y, sobre todo, *jitter* de
  entrada en móvil; (b) el tiempo que tarda en reconocerse una nota grave; (c) la calidad de la señal del bajo sin
  ampli por el micro del móvil, con el acompañamiento sonando por el mismo altavoz. **[Inferencia]** Envolver la web
  en Electron/Tauri no cambia ninguna de las tres si el audio sigue pasando por el motor web.
- **Ventaja que juega a favor:** no hay que *transcribir* lo que tocas, solo *verificar* notas que ya sabemos cuáles y
  cuándo son. Es un problema bastante más fácil (y barato de computar). **[Inferencia]**
- **Choca con decisiones tomadas:** `business.md` deja fuera "corrección automática de la interpretación" y
  `research.md` §1.1–1.2 define la app como "sin juegos ni puntuaciones" y deja fuera la corrección estilo Yousician
  por riesgo técnico. Hay que decidir (D1) antes de construir.
- **El autor tiene un Vox amPlug 3 Bass** (§3.5): su AUX TRRS manda la señal del bajo a la entrada de micro del
  móvil o del portátil y devuelve el audio de la app a los auriculares. Es entrada "por cable" sin comprar nada:
  **pasa a ser la vía principal de las pruebas**; el micro queda para quien no tenga cable.
- **Plan:** cinco spikes baratas y encadenadas (§5); las dos primeras deciden web vs. escritorio sin escribir UI.

## 1. Premisas revisadas

| Premisa | Valoración |
|---|---|
| "Un *guitar hero* exige app de escritorio" | **Falsa como regla.** Lo que aporta el escritorio es entrada por interfaz USB/cable y audio nativo de baja latencia. La interfaz USB también se puede usar desde el navegador (`getUserMedia` con `deviceId`) **[Hipótesis: comprobar en Android/iOS]**. Electron/Tauri solo ganan si se añade un módulo de audio nativo (p. ej. `cpal` en Rust) **[Inferencia]**. |
| "La latencia arruina la puntuación" | **Solo en parte.** Una latencia *fija* se compensa con calibración (tocar sobre un clic) y marcas de tiempo en el reloj de audio: el acierto se calcula bien aunque el feedback visual llegue tarde. Lo que no se compensa es la *variabilidad* (jitter). **[Inferencia; práctica habitual en juegos de ritmo]** |
| "El afinador ya demuestra que la detección funciona" | **No todavía.** Error < 0,7 cents con tono sintético, pero la prueba con bajo real (`afinador-pruebas.md`) está vacía. Es prerrequisito de todo esto. |
| "Basta reutilizar el afinador" | **No.** Ventana de 8192 muestras (≈170 ms a 48 kHz), `AnalyserNode` leído en `requestAnimationFrame` (~15 análisis/s, uno cada ~66 ms) y mediana de 5 lecturas con mínimo de 3 antes de mostrar. Sirve para afinar, no para medir *cuándo* empieza una nota. **[Hecho, `src/audio/tuner.ts`]** |

## 2. Qué existe y se reutilizaría

| Pieza | Dónde | Uso en el modo juego |
|---|---|---|
| YIN + diezmado | `src/audio/pitch.ts` (puro, testeado) | Confirmar la altura tras el ataque |
| Captura de micro | `src/audio/tuner.ts` | Restricciones ya correctas (`echoCancellation/noiseSuppression/autoGainControl: false`) |
| `AudioContext` único | `src/audio/context.ts` | Reloj común para notas esperadas y detectadas. **Comprobar `latencyHint`** |
| Partitura y reproducción | `src/components/Tab/TabView.tsx` (alphaTab) | Notas esperadas, cursor y tempo; eventos de reproducción **[verificar API en alphaTab 1.8]** |
| Ejercicios | `src/content/` (alphaTex + `tempo {start,target,step}`) | El "chart" sale del alphaTex: **no hace falta un formato nuevo** |
| Backing tracks | `src/content/backing.ts` | Ya permite silenciar el bajo (clave para §3.3) |
| Grábate | `components/Lesson/Recorder.tsx` (MediaRecorder) | Grabar *fixtures* reales para la spike S2 |
| Progreso | `src/state/progress/` (Dexie) | El resultado podría proponer "pase limpio" y el tempo siguiente |

## 3. El problema, descompuesto

### 3.1 Latencia
- Cadena: cuerda → micro → buffer de entrada → análisis → pantalla; y en paralelo, acompañamiento → altavoz → oído.
- Único dato medido encontrado: Jeff Kaufman (feb. 2021, MacBook, macOS 11.1), ida y vuelta altavoz→micro: Chrome
  ~67 ms y Firefox ~55 ms por defecto; **~19 ms y ~14 ms** con `latencyHint: 0` y sin procesado. **[Hecho, una sola
  máquina, escritorio, 2021]** **No hay dato fiable para Android/iOS aquí: hay que medirlo (S1).**
- Bluetooth añade latencia grande y variable **[Hipótesis por verificar]**: el modo debería pedir altavoz o cable.

### 3.2 Notas graves
- Periodo de E1 ≈ 24,3 ms; B0 ≈ 32,4 ms. La altura necesita ventanas largas, pero el **ataque** (cuándo) se detecta con
  ventanas cortas (energía o flujo espectral, 5–10 ms). **[Hipótesis de diseño]** Separar las dos cosas:
  1. *Onset* con ventana corta en un `AudioWorklet` (marca de tiempo en muestras).
  2. Verificación de altura después, solo contra la nota esperada (banda estrecha en f0 y armónicos, o YIN con rango
     bloqueado). Al saber la nota, el error de octava pesa mucho menos.

### 3.3 La señal real
- Con el micro del móvil, en el bajo suelen dominar los armónicos sobre la fundamental (`research.md` §5.1).
- **Riesgo serio:** si el acompañamiento suena por el altavoz del móvil, el micro lo oye. Si la pista de bajo suena,
  habrá aciertos falsos. Mitigaciones a probar: bajo silenciado siempre en este modo, auriculares con cable, umbral
  adaptativo al nivel del acompañamiento. **[Inferencia]**
- Entrada por cable (interfaz USB *class compliant*) da señal limpia **[Hipótesis]**; a cambio, exige hardware.

### 3.4 Pantalla
- Una pista de notas en `<canvas>` a 60 fps no es problema en web **[Opinión]**. Debe posicionarse con
  `AudioContext.currentTime` (+ desfase calibrado), nunca con el tiempo de `requestAnimationFrame`, por la misma regla
  que el metrónomo (`.claude/rules/audio.md`).

## 4. Preguntas de investigación (por prioridad)

| # | Pregunta | Bloquea | Spike |
|---|---|---|---|
| Q1 | ¿Latencia y jitter de entrada en tus dispositivos (móvil, tableta, PC)? | Todo | S1 |
| Q2 | ¿Precisión de nota + ataque con bajo real, por micro y por cable? | Todo | S2 |
| Q3 | ¿Sigue funcionando con el acompañamiento por altavoz? | Diseño del modo | S2/S3 |
| Q4 | ¿Coste de CPU/batería del análisis continuo en móvil? | S4 | S3 |
| Q5 | ¿Ventanas de acierto justas para principiante (±ms)? Sale de medir, no de copiar otro juego | Diseño | S3 |
| Q6 | ¿Encaje pedagógico: puntuación o verificación silenciosa? | Producto | D1 |
| Q7 | ¿Aporta algo medible el escritorio? Solo si Q1/Q2 fallan en móvil | Plataforma | S5 |
| Q8 | ¿Librería o código propio? Ver tabla | Implementación | S2 |

**Q8, opciones conocidas** (no evaluadas a fondo):

| Opción | Licencia | Comentario |
|---|---|---|
| Código propio (YIN actual + onset) | — | Coherente con `decisions.md` (YIN sin librerías); preferente salvo que S2 falle |
| `pitchy` (MPM) | por verificar | Ya citada en `decisions.md`, no evaluada |
| `basic-pitch-ts` (Spotify) | Apache-2.0 **[Hecho]** | Polifónica, orientada a procesar audio por ventanas/ficheros; **probablemente pesada para tiempo real en móvil [Hipótesis]**. Útil como "verdad de referencia" offline en S2 |
| Essentia.js | Essentia es AGPLv3 con licencia comercial aparte **[Hecho]**; la de Essentia.js, por verificar | AGPL obliga a ofrecer el código si se publica; valorar si el repo será público |

## 5. Spikes (en orden; cada una tiene criterio de salida)

Los umbrales son **[Hipótesis de partida]**: ajústalos con lo que midan S1–S2.

- **S1 · Medidor de latencia** (ruta experimental, p. ej. `#/lab/latencia`, fuera del menú).
  Clic por el altavoz → detección en el micro, 20 repeticiones; mostrar media, desviación, `baseLatency` y
  `outputLatency` si existen. Segundo modo: "toca la cuerda al aire sobre el clic" (mide lo que vive el usuario).
  *Sale bien si* σ ≤ 10 ms y el desfase total es estable entre sesiones. Resultado en §10.
- **S2 · Detector offline con fixtures reales** (sin UI, Vitest/Node).
  Grabar con "Grábate" 3 ejercicios del curso (uno lento, uno en corcheas, uno con notas en la cuerda E), por micro y,
  si hay, por cable; con y sin acompañamiento por altavoz. Guardar los WAV en `tests/fixtures/` (fuera de git si pesan).
  Script que compara detecciones con el alphaTex esperado y da **una línea por fichero**: precisión, *recall*, error
  medio de ataque. *Sale bien si* ≥ 95 % de notas correctas y error de ataque ≤ 30 ms en micro sin acompañamiento.
- **S3 · Tiempo real mínimo.** `AudioWorklet` con onset + verificación contra el ejercicio en curso; sin pista visual,
  solo verde/rojo por nota en la partitura. Medir CPU en el móvil. *Sale bien si* reproduce S2 en directo y no baja
  el rendimiento de alphaTab.
- **S4 · Pista de notas** (solo si S3 sale bien): `<canvas>` sincronizado al reloj de audio, calibración guardada en
  ajustes, ventanas de acierto configurables.
- **S5 · Escritorio** (solo si S1/S2 fallan en móvil): repetir S1–S2 en Chrome de escritorio con interfaz USB. Si
  aun así falla, evaluar Tauri con audio nativo. Coste: otra base de código de audio, empaquetado y firma.

```
S1 ─ok→ S2 ─ok→ S3 ─ok→ S4
 │        └─falla por micro─→ ¿cable? ─ok→ S3 (modo "solo con interfaz")
 └─falla (jitter) en móvil─→ S5
```

## 6. Decisiones que te tocan

- **D1 · Producto.** (a) Modo juego con puntuación, opcional y aparte; (b) "verificación silenciosa": la app marca
  qué notas salieron limpias y a tiempo, y propone el pase limpio y el tempo, sin marcador; (c) no hacerlo. (b) encaja
  mejor con `business.md` y con el quiz sin puntuación (`decisions.md`, 2026-10-01) **[Opinión]**. Si eliges (a) o
  (b), hay que actualizar "fuera de alcance" en `business.md`.
- **D2 · Entrada.** ¿Solo micro, o recomendar/exigir interfaz USB?
- **D3 · Nombre.** No usar "Guitar Hero" (marca de Activision) ni su estética reconocible, igual que con Orange.
  _No es asesoramiento legal._
- **D4 · Dispositivos de prueba.** Lista concreta (modelo, SO, navegador) para S1–S2.

## 7. Riesgos

| Riesgo | Prob./Impacto | Mitigación |
|---|---|---|
| Jitter alto en móvil (sobre todo iOS) | Media/Alta | S1 primero; modo "solo con interfaz" o escritorio |
| El micro oye el acompañamiento | Alta/Alta | Bajo silenciado, auriculares con cable, umbral adaptativo |
| Aciertos falsos que enseñan mal (premiar notas sucias) | Media/Alta | Ser conservador: ante la duda, "no detectado", no "fallo"; nunca bloquear progreso por la detección |
| La gamificación desplaza la autoevaluación | Media/Media | D1; mantener la autoevaluación como criterio principal |
| Batería/CPU en sesiones largas | Media/Media | Diezmado, análisis solo durante el ejercicio, medir en S3 |

## 8. Fuentes

Consultadas el 2026-10-04:
- [Browser Audio Latency — Jeff Kaufman (2021)](https://www.jefftk.com/p/browser-audio-latency)
- [AudioWorklet Latency: Firefox vs Chrome — Jeff Kaufman](https://jefftk.com/p/audioworklet-latency-firefox-vs-chrome) (no leída a fondo)
- [Chromium: Audio Latency Tracing](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/media/latency_tracing.md) (para medir en S1; no leída a fondo)
- [Rocksmith+ — Ubisoft Store](https://store.ubisoft.com/eu/rocksmith-plus?lang=en-DK)
- [spotify/basic-pitch-ts — GitHub](https://github.com/spotify/basic-pitch-ts)
- [Essentia — documentación (licencia)](https://essentia.upf.edu/documentation.html)

Ya citadas en `research.md` (no repetir búsqueda): Yousician (soporte de bajo), nota de prensa de Rocksmith+ 2021,
WebKit (getUserMedia en iOS, bugs 179411 y 204444 sobre procesado de audio).

**Por verificar** (no buscar hasta que una spike lo necesite): eventos de reproducción de alphaTab 1.8; soporte de
`outputLatency` por navegador; interfaces USB en Safari iOS vía `getUserMedia`; si YARG o Clone Hero admiten bajo real
(posible referencia de diseño de ventanas de acierto); licencia de `pitchy` y de Essentia.js.

## 9. Protocolo para ahorrar créditos

1. **Una spike por sesión.** Arranca con el prompt de abajo; no reexpliques el proyecto.
2. **Contexto mínimo:** este documento + los ficheros de §2 que vayas a tocar. Para otros docs, `grep -n '^#'` y lee
   solo la sección.
3. **Resultados en tablas** en §10, no en prosa. Las conclusiones van en una línea; las decisiones, a `decisions.md`.
4. **Scripts que resumen:** mediciones y tests imprimen una línea por caso. Nunca volcar logs, WAV ni JSON grandes en
   el chat.
5. **Búsquedas:** modo estándar primero; cada fuente nueva se apunta en §8 con fecha para no repetirla.
6. **No reabrir** lo que ya está en §1 o §6 salvo que un resultado lo contradiga.

**Prompt de arranque para Claude Code** (cambia `S1` por la spike que toque):

```
Lee solo docs/research-modo-juego.md. Haz la spike S1 tal como está descrita en §5,
en una ruta experimental fuera del menú. Respeta CLAUDE.md (audio sobre AudioContext.currentTime).
Al terminar: rellena la fila de S1 en §10, apunta en §8 las fuentes nuevas y no toques otros docs
salvo decisions.md si tomas una decisión técnica. Resumen final en ≤ 5 líneas.
```

## 10. Resultados

| Spike | Fecha | Dispositivo / SO / navegador | Entrada | Resultado clave | ¿Pasa? |
|---|---|---|---|---|---|
| S1 | | | | | |
| S2 | | | | | |
| S3 | | | | | |
