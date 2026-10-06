# Afinador: pruebas en bajo real

Criterio de la Fase 5 ([roadmap.md](roadmap.md)): error < ±3 cents con tono sintético (**cumplido**, ver abajo) y
**prueba en bajo real documentada por dispositivo** (**hecha**: sobremesa con Windows por cable, 2026-10-04, y
móvil con micrófono del dispositivo, 2026-10-06 según el autor; sin modelo ni cents anotados).

## Con tono sintético (automático)

- `src/audio/pitch.test.ts`: cuerdas al aire B0–C3 y G3, a 44,1 y 48 kHz, con seno puro y con una señal "tipo bajo"
  (2.º armónico más fuerte que la fundamental) y ruido. Error máximo medido: **0,69 cents** (B0, seno puro);
  con la señal tipo bajo, < 0,3 cents. Sin errores de octava.
- Selector de entrada, medidor de nivel y ganancia por software: `src/audio/pitch.test.ts` (`dbToGain`,
  `levelFraction`) y un e2e que comprueba que la ganancia sube el nivel medido.
- `e2e/tuner.spec.ts`: Chromium con micrófono simulado (fichero WAV con una E1 desafinada +12 cents). La app muestra
  E1, "Alto: baja" y +12 cents, estable (± 3).

## Con bajo real (a mano)

Protocolo, para cada dispositivo:

1. Afina el bajo con un afinador de referencia (de pinza o de pedal) y apunta su lectura.
2. Abre la app (mejor instalada) → Afinador → Activar micrófono. Pon el móvil a unos 20–30 cm del bajo (sin ampli,
   o con el ampli bajo) y toca cada cuerda al aire, dejándola sonar.
3. Apunta, por cuerda: si la app la reconoce (nota correcta), la lectura en cents y si la aguja está estable.
4. Repite con la cuerda elegida a mano (botón de la cuerda) en vez de "Automático".
5. Desafina a propósito una cuerda (unos 20 cents) y comprueba que la app indica el sentido correcto.

| Fecha | Dispositivo / SO | Navegador (¿instalada?) | Cuerda | Referencia (cents) | App (cents) | ¿Estable? | Notas |
|---|---|---|---|---|---|---|---|
| 2026-10-04 | Sobremesa con Windows 10, bajo de 4 cuerdas → Amplug 3 → entrada de línea | Chrome, servido desde `localhost` (sin instalar) | E, A, D, G | Afinador Korg | "Clavadísima" (sin cents anotados) | Sí | Notas bien detectadas en todas; más preciso que el Korg según el autor |

**Resultado de la prueba del 2026-10-04** (testimonio del autor, sin lecturas en cents por cuerda):
- Las cuatro cuerdas al aire se detectan con la nota correcta y la afinación coincide con el afinador de referencia.
- Nivel: con **ganancia 0 dB** en la app, el medidor llega a ~80 % con slap y volumen alto; no satura. La señal por la
  entrada de línea es suficiente: la ganancia por software no hizo falta.
- Con la entrada de micrófono (rosa) la señal era demasiado baja; la línea lo resolvió (ver arriba).
- **Móvil (micrófono del dispositivo; confirmado el 2026-10-06):** funciona "lo suficientemente bien", pero **bastante menos
  preciso** que por cable (testimonio del autor; sin modelo, SO ni cents anotados). Coincide con lo previsto: los micros
  de móvil captan mal los graves. Para precisión, mejor cable o interfaz; el móvil sirve para una afinación aproximada.
- **Sin cubrir:** bajo de 5 cuerdas (B0), errores de octava en automático (no se anotaron fallos) y cents medidos
  por cuerda, tanto en el sobremesa como en el móvil.

Conexión directa (Amplug u otro amplificador de auriculares) a un sobremesa: usa la **entrada de línea** (azul), no la
de micrófono (rosa), y con un cable estéreo desde la salida de auriculares/AUX del Amplug. En Windows hay que poner la
línea como dispositivo de grabación, o elegirla en el selector de entrada del afinador. Anota el nivel que marca el
medidor al tocar y la ganancia que hace falta.

Cosas que conviene anotar (research.md: son los puntos débiles conocidos):
- **iOS**: si con el interruptor de silencio activado se oye el tono de referencia; si la E grave se detecta (el
  micrófono y el procesado de iOS pueden atenuar < 50 Hz). **[Hipótesis: sin verificar]**
- **Android**: si la lectura salta de octava en la E (debería evitarse eligiendo la cuerda a mano).
- Con ampli: a qué volumen la lectura es más estable.
