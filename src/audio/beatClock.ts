/**
 * Reloj de pulsos puro (sin Web Audio) para el metrónomo.
 *
 * Calcula los instantes de cada tick a partir de un origen fijo:
 * `origin + n * secondsPerTick`. No acumula sumas, así que no hay deriva
 * por error de coma flotante aunque la sesión dure horas.
 */

export interface BeatClockOptions {
  bpm: number
  /** Pulsos por compás (numerador del compás). */
  beatsPerBar: number
  /** Ticks por pulso: 1 = negras, 2 = corcheas, 3 = tresillos, 4 = semicorcheas. */
  subdivision: number
}

export type TickKind = 'downbeat' | 'beat' | 'subdivision'

export interface Tick {
  /** Instante en segundos, en el reloj de AudioContext. */
  time: number
  /** Índice del pulso dentro del compás (0 = primer tiempo). */
  beatInBar: number
  /** Índice del tick dentro del pulso (0 = el propio pulso). */
  subInBeat: number
  /** Número de compás desde el arranque o el último cambio de compás/subdivisión (0 = primero). */
  bar: number
  /** Tempo al que suena este tick. */
  bpm: number
  kind: TickKind
}

/**
 * Se llama justo antes de emitir el primer tiempo de cada compás (a partir del segundo).
 * Si devuelve un BPM, el cambio se aplica exactamente desde ese primer tiempo.
 */
export type BarStartHook = (bar: number) => number | void

export const MIN_BPM = 20
export const MAX_BPM = 300

export function clampBpm(bpm: number): number {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, bpm))
}

export class BeatClock {
  private options: BeatClockOptions
  /** Instante del tick número 0 del segmento actual. */
  private origin: number
  /** Número de ticks emitidos desde `origin`. */
  private n = 0
  /** Posición absoluta en la rejilla (para compás/pulso), no se reinicia al cambiar de tempo. */
  private position = 0

  constructor(options: BeatClockOptions, startTime: number) {
    this.options = { ...options, bpm: clampBpm(options.bpm) }
    this.origin = startTime
  }

  get secondsPerTick(): number {
    return 60 / this.options.bpm / this.options.subdivision
  }

  /** Instante del próximo tick que aún no se ha devuelto. */
  get nextTime(): number {
    return this.origin + this.n * this.secondsPerTick
  }

  get bpm(): number {
    return this.options.bpm
  }

  /**
   * Devuelve (y consume) todos los ticks con `time < until`.
   * Llamadas sucesivas nunca repiten ni saltan ticks.
   */
  collect(until: number, onBarStart?: BarStartHook): Tick[] {
    const ticks: Tick[] = []
    const { beatsPerBar, subdivision } = this.options
    const ticksPerBar = beatsPerBar * subdivision
    while (this.nextTime < until) {
      const inBar = this.position % ticksPerBar
      const bar = Math.floor(this.position / ticksPerBar)
      if (inBar === 0 && bar > 0 && onBarStart) {
        const bpm = onBarStart(bar)
        if (bpm !== undefined && clampBpm(bpm) !== this.options.bpm) {
          // Re-ancla en este primer tiempo: su instante no cambia, los siguientes sí.
          this.origin = this.nextTime
          this.n = 0
          this.options.bpm = clampBpm(bpm)
        }
      }
      const beatInBar = Math.floor(inBar / subdivision)
      const subInBeat = inBar % subdivision
      const kind: TickKind =
        subInBeat !== 0 ? 'subdivision' : beatInBar === 0 ? 'downbeat' : 'beat'
      ticks.push({ time: this.nextTime, beatInBar, subInBeat, bar, bpm: this.options.bpm, kind })
      this.n += 1
      this.position += 1
    }
    return ticks
  }

  /**
   * Cambia tempo/compás sin perder la fase: el próximo tick pendiente se
   * mantiene en su sitio y los siguientes usan la nueva duración.
   */
  update(partial: Partial<BeatClockOptions>): void {
    const next = this.nextTime
    const merged = { ...this.options, ...partial }
    merged.bpm = clampBpm(merged.bpm)
    if (
      merged.beatsPerBar !== this.options.beatsPerBar ||
      merged.subdivision !== this.options.subdivision
    ) {
      // Si cambia la rejilla, el siguiente tick empieza compás nuevo.
      this.position = 0
    }
    this.options = merged
    this.origin = next
    this.n = 0
  }
}
