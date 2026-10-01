# Afinador: pruebas en bajo real

Criterio de la Fase 5 ([roadmap.md](roadmap.md)): error < ±3 cents con tono sintético (**cumplido**, ver abajo) y
**prueba en bajo real documentada por dispositivo** (pendiente: solo la puede hacer el autor).

## Con tono sintético (automático)

- `src/audio/pitch.test.ts`: cuerdas al aire B0–C3 y G3, a 44,1 y 48 kHz, con seno puro y con una señal "tipo bajo"
  (2.º armónico más fuerte que la fundamental) y ruido. Error máximo medido: **0,69 cents** (B0, seno puro);
  con la señal tipo bajo, < 0,3 cents. Sin errores de octava.
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
| | | | E | | | | |
| | | | A | | | | |
| | | | D | | | | |
| | | | G | | | | |

Cosas que conviene anotar (research.md: son los puntos débiles conocidos):
- **iOS**: si con el interruptor de silencio activado se oye el tono de referencia; si la E grave se detecta (el
  micrófono y el procesado de iOS pueden atenuar < 50 Hz). **[Hipótesis: sin verificar]**
- **Android**: si la lectura salta de octava en la E (debería evitarse eligiendo la cuerda a mano).
- Con ampli: a qué volumen la lectura es más estable.
