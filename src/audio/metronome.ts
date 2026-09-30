import { BeatClock, type BeatClockOptions, type Tick } from './beatClock'

/**
 * Metrónomo sobre Web Audio ("A Tale of Two Clocks", web.dev).
 *
 * - setInterval SOLO despierta al planificador; nunca dispara sonido.
 * - Cada click se programa con `osc.start(tick.time)` sobre el reloj de audio.
 * - El AudioContext se crea/reanuda dentro de `start()`, que debe llamarse
 *   desde un gesto del usuario (requisito de iOS/Safari).
 */

const LOOKAHEAD_MS = 25
const SCHEDULE_AHEAD_S = 0.1
/** Margen para que el primer click no caiga en el pasado. */
const START_DELAY_S = 0.05

const CLICK: Record<Tick['kind'], { freq: number; gain: number }> = {
  downbeat: { freq: 1600, gain: 1 },
  beat: { freq: 1000, gain: 0.7 },
  subdivision: { freq: 800, gain: 0.35 },
}

export class Metronome {
  private ctx: AudioContext | null = null
  private output: GainNode | null = null
  private clock: BeatClock | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  /** Ticks programados pendientes de mostrarse en pantalla. */
  private visualQueue: Tick[] = []
  private options: BeatClockOptions
  private volume = 0.8

  constructor(options: BeatClockOptions) {
    this.options = { ...options }
  }

  get isRunning(): boolean {
    return this.timer !== null
  }

  async start(): Promise<void> {
    if (this.isRunning) return
    if (!this.ctx) {
      this.ctx = new AudioContext({ latencyHint: 'interactive' })
      this.output = this.ctx.createGain()
      this.output.gain.value = this.volume
      this.output.connect(this.ctx.destination)
    }
    if (this.ctx.state !== 'running') await this.ctx.resume()
    this.clock = new BeatClock(this.options, this.ctx.currentTime + START_DELAY_S)
    this.visualQueue = []
    this.schedule()
    this.timer = setInterval(() => this.schedule(), LOOKAHEAD_MS)
  }

  stop(): void {
    if (this.timer !== null) clearInterval(this.timer)
    this.timer = null
    this.clock = null
    this.visualQueue = []
  }

  update(partial: Partial<BeatClockOptions>): void {
    this.options = { ...this.options, ...partial }
    this.clock?.update(partial)
  }

  setVolume(volume: number): void {
    this.volume = volume
    if (this.output && this.ctx) {
      this.output.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.01)
    }
  }

  /**
   * Devuelve el último tick que ya ha sonado (según el reloj de audio),
   * o null. Pensado para llamarse desde requestAnimationFrame.
   */
  currentTick(): Tick | null {
    if (!this.ctx) return null
    const now = this.ctx.currentTime
    let current: Tick | null = null
    while (this.visualQueue.length > 0 && this.visualQueue[0].time <= now) {
      current = this.visualQueue.shift() ?? null
    }
    return current
  }

  async dispose(): Promise<void> {
    this.stop()
    await this.ctx?.close()
    this.ctx = null
    this.output = null
  }

  private schedule(): void {
    if (!this.ctx || !this.clock || !this.output) return
    const ticks = this.clock.collect(this.ctx.currentTime + SCHEDULE_AHEAD_S)
    for (const tick of ticks) {
      this.playClick(tick)
      this.visualQueue.push(tick)
    }
  }

  private playClick(tick: Tick): void {
    if (!this.ctx || !this.output) return
    const { freq, gain } = CLICK[tick.kind]
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.frequency.value = freq
    env.gain.setValueAtTime(0, tick.time)
    env.gain.linearRampToValueAtTime(gain, tick.time + 0.001)
    env.gain.exponentialRampToValueAtTime(0.0001, tick.time + 0.04)
    osc.connect(env).connect(this.output)
    osc.start(tick.time)
    osc.stop(tick.time + 0.05)
  }
}
