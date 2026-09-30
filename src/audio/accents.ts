import type { Tick } from './beatClock'

/**
 * Acento por pulso del compás. "silent" deja el pulso (y sus subdivisiones) sin clic:
 * sirve para practicar el pulso interno.
 */
export type AccentLevel = 'accent' | 'normal' | 'silent'

export interface ClickSound {
  freq: number
  gain: number
}

const SOUNDS: Record<'accent' | 'normal' | 'subdivision', ClickSound> = {
  accent: { freq: 1600, gain: 1 },
  normal: { freq: 1000, gain: 0.7 },
  subdivision: { freq: 800, gain: 0.35 },
}

const CYCLE: AccentLevel[] = ['accent', 'normal', 'silent']

/** Patrón por defecto: primer tiempo acentuado, el resto normal. */
export function defaultAccents(beatsPerBar: number): AccentLevel[] {
  return Array.from({ length: beatsPerBar }, (_, i) => (i === 0 ? 'accent' : 'normal'))
}

/** Ajusta el patrón a un nuevo número de pulsos conservando lo que ya había. */
export function resizeAccents(accents: AccentLevel[], beatsPerBar: number): AccentLevel[] {
  const base = defaultAccents(beatsPerBar)
  return base.map((level, i) => accents[i] ?? level)
}

/** Siguiente nivel al pulsar un piloto: acento → normal → silencio → acento. */
export function nextAccent(level: AccentLevel): AccentLevel {
  return CYCLE[(CYCLE.indexOf(level) + 1) % CYCLE.length]
}

/** Sonido de un tick según el patrón de acentos, o null si no debe sonar. */
export function clickFor(tick: Tick, accents: AccentLevel[]): ClickSound | null {
  const level = accents[tick.beatInBar] ?? 'normal'
  if (level === 'silent') return null
  if (tick.subInBeat !== 0) return SOUNDS.subdivision
  return SOUNDS[level]
}
