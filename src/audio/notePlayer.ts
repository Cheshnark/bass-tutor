import { getAudioContext } from './context'

/** Frecuencia en Hz de una nota MIDI (La4 = 69 = 440 Hz). */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

/**
 * Pulsación sintética tipo bajo: diente de sierra filtrado con envolvente de ataque
 * corto y caída. Se programa sobre el reloj de audio, nunca con temporizadores.
 */
export async function playNote(midi: number, durationS = 1.2): Promise<void> {
  const ctx = await getAudioContext()
  const t = ctx.currentTime + 0.005
  const freq = midiToFrequency(midi)

  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = freq

  // Filtro que se cierra: brillo inicial de la pulsación y cuerpo grave después.
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 1
  filter.frequency.setValueAtTime(Math.min(freq * 12, 4000), t)
  filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 120), t + 0.3)

  const env = ctx.createGain()
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(0.5, t + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, t + durationS)

  osc.connect(filter).connect(env).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + durationS + 0.05)
}
