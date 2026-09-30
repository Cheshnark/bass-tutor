import { clampBpm } from './beatClock'

/**
 * Escalera de tempo: empezar lento y subir poco a poco hasta el objetivo.
 * - "bars": sube `step` BPM cada `everyBars` compases completos.
 * - "manual": sube solo cuando el usuario marca un pase limpio.
 */
export type LadderMode = 'bars' | 'manual'

export interface LadderConfig {
  start: number
  target: number
  step: number
  mode: LadderMode
  everyBars: number
}

export const DEFAULT_LADDER: LadderConfig = { start: 60, target: 100, step: 5, mode: 'manual', everyBars: 8 }

export function validateLadder(config: LadderConfig): string | null {
  const { start, target, step, everyBars } = config
  if (![start, target, step, everyBars].every(Number.isFinite)) return 'Valores no numéricos'
  if (clampBpm(start) !== start || clampBpm(target) !== target) return 'Tempo fuera de rango'
  if (target <= start) return 'El objetivo tiene que ser mayor que el inicio'
  if (step < 1) return 'El paso tiene que ser de al menos 1 BPM'
  if (!Number.isInteger(everyBars) || everyBars < 1) return 'Número de compases no válido'
  return null
}

export class TempoLadder {
  readonly config: LadderConfig
  private current: number
  private barsAtTempo = 0

  constructor(config: LadderConfig) {
    const error = validateLadder(config)
    if (error) throw new Error(error)
    this.config = { ...config }
    this.current = config.start
  }

  get bpm(): number {
    return this.current
  }

  get done(): boolean {
    return this.current >= this.config.target
  }

  /** Progreso de 0 a 1 entre inicio y objetivo. */
  get progress(): number {
    const { start, target } = this.config
    return (this.current - start) / (target - start)
  }

  /** Llamar al terminar cada compás. Devuelve el nuevo BPM si sube, o null. */
  barCompleted(): number | null {
    if (this.config.mode !== 'bars' || this.done) return null
    this.barsAtTempo += 1
    if (this.barsAtTempo < this.config.everyBars) return null
    return this.bump()
  }

  /** Pase limpio marcado por el usuario (en cualquier modo). Devuelve el nuevo BPM o null si ya estaba en el objetivo. */
  pass(): number | null {
    if (this.done) return null
    return this.bump()
  }

  private bump(): number {
    this.current = Math.min(this.current + this.config.step, this.config.target)
    this.barsAtTempo = 0
    return this.current
  }
}
