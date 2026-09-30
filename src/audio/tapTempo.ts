import { clampBpm } from './beatClock'

/**
 * Tap tempo: calcula el BPM con la media de los últimos intervalos entre pulsaciones.
 * Si pasa demasiado tiempo entre dos pulsaciones, empieza una medición nueva.
 */
export class TapTempo {
  private taps: number[] = []
  private readonly maxTaps: number
  private readonly resetMs: number

  constructor(maxTaps = 6, resetMs = 2000) {
    this.maxTaps = maxTaps
    this.resetMs = resetMs
  }

  /** Registra una pulsación (ms, p. ej. `performance.now()`); devuelve el BPM o null si aún no hay 2. */
  tap(nowMs: number): number | null {
    const last = this.taps[this.taps.length - 1]
    if (last !== undefined && (nowMs - last > this.resetMs || nowMs <= last)) this.taps = []
    this.taps.push(nowMs)
    if (this.taps.length > this.maxTaps) this.taps.shift()
    if (this.taps.length < 2) return null
    const span = this.taps[this.taps.length - 1] - this.taps[0]
    const average = span / (this.taps.length - 1)
    return clampBpm(Math.round(60_000 / average))
  }

  get count(): number {
    return this.taps.length
  }

  reset(): void {
    this.taps = []
  }
}
