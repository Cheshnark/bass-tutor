import { getAudioContext } from './context'

/** Frecuencia en Hz de una nota MIDI (La4 = 69 = 440 Hz). */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

/**
 * Pulsación sintética tipo bajo: diente de sierra filtrado con envolvente de ataque
 * corto y caída, programada en el instante `at` del reloj de audio.
 */
function schedulePluck(ctx: AudioContext, midi: number, at: number, durationS: number): void {
  const freq = midiToFrequency(midi)

  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = freq

  // Filtro que se cierra: brillo inicial de la pulsación y cuerpo grave después.
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 1
  filter.frequency.setValueAtTime(Math.min(freq * 12, 4000), at)
  filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 120), at + 0.3)

  const env = ctx.createGain()
  env.gain.setValueAtTime(0, at)
  env.gain.linearRampToValueAtTime(0.5, at + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, at + durationS)

  osc.connect(filter).connect(env).connect(ctx.destination)
  osc.start(at)
  osc.stop(at + durationS + 0.05)
}

export async function playNote(midi: number, durationS = 1.2): Promise<void> {
  const ctx = await getAudioContext()
  schedulePluck(ctx, midi, ctx.currentTime + 0.005, durationS)
}

/**
 * Toca una secuencia de notas a un tempo dado (una nota por pulso), toda programada
 * de antemano sobre el reloj de audio. Devuelve la duración total en segundos.
 */
export async function playSequence(midis: number[], bpm = 100): Promise<number> {
  const ctx = await getAudioContext()
  const beat = 60 / bpm
  const start = ctx.currentTime + 0.05
  midis.forEach((midi, i) => {
    const last = i === midis.length - 1
    schedulePluck(ctx, midi, start + i * beat, last ? 1.2 : Math.min(beat * 0.95, 1.2))
  })
  return midis.length * beat
}
