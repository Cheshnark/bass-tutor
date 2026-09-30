import { clickFor, defaultAccents, type AccentLevel } from './accents'
import { BeatClock, type BeatClockOptions, type Tick } from './beatClock'
import { getAudioContext } from './context'
import { TempoLadder, type LadderConfig } from './tempoLadder'

/**
 * Metrónomo sobre Web Audio ("A Tale of Two Clocks", web.dev).
 *
 * - setInterval SOLO despierta al planificador; nunca dispara sonido.
 * - Cada click se programa con `osc.start(tick.time)` sobre el reloj de audio.
 * - Usa el AudioContext compartido (`context.ts`), que se crea/reanuda dentro de
 *   `start()`: debe llamarse desde un gesto del usuario (requisito de iOS/Safari).
 * - La escalera de tempo sube en el primer tiempo de compás (hook de `BeatClock.collect`).
 */

const LOOKAHEAD_MS = 25
const SCHEDULE_AHEAD_S = 0.1
/** Margen para que el primer click no caiga en el pasado. */
const START_DELAY_S = 0.05

export interface MetronomeOptions extends BeatClockOptions {
  /** Acento por pulso; si su longitud no coincide con `beatsPerBar`, los que falten son "normal". */
  accents: AccentLevel[]
}

export class Metronome {
  private ctx: AudioContext | null = null
  private output: GainNode | null = null
  private clock: BeatClock | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  /** Ticks programados pendientes de mostrarse en pantalla. */
  private visualQueue: Tick[] = []
  private options: MetronomeOptions
  private tempoLadder: TempoLadder | null = null
  private volume = 0.8

  constructor(options: Partial<MetronomeOptions> & BeatClockOptions) {
    this.options = { accents: defaultAccents(options.beatsPerBar), ...options }
  }

  get isRunning(): boolean {
    return this.timer !== null
  }

  /** Escalera activa (solo lectura para la UI), o null. */
  get ladder(): TempoLadder | null {
    return this.tempoLadder
  }

  async start(): Promise<void> {
    if (this.isRunning) return
    const ctx = await getAudioContext()
    if (this.ctx !== ctx || !this.output) {
      this.ctx = ctx
      this.output = ctx.createGain()
      this.output.gain.value = this.volume
      this.output.connect(ctx.destination)
    }
    this.clock = new BeatClock(this.options, ctx.currentTime + START_DELAY_S)
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

  update(partial: Partial<MetronomeOptions>): void {
    // Los acentos se leen en cada tick; solo tempo/compás/subdivisión tocan el reloj.
    const { accents: _accents, ...clockPartial } = partial
    this.options = { ...this.options, ...partial }
    if (Object.keys(clockPartial).length > 0) this.clock?.update(clockPartial)
  }

  /** Activa (o quita, con null) la escalera de tempo. El tempo pasa al inicio de la escalera. */
  setLadder(config: LadderConfig | null): void {
    this.tempoLadder = config ? new TempoLadder(config) : null
    if (this.tempoLadder) this.applyBpm(this.tempoLadder.bpm)
  }

  /** Pase limpio: sube un escalón ya (desde el próximo tick). Devuelve el nuevo BPM o null. */
  pass(): number | null {
    const bpm = this.tempoLadder?.pass() ?? null
    if (bpm !== null) this.applyBpm(bpm)
    return bpm
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

  /** Para y desconecta su salida. El contexto compartido no se cierra. */
  dispose(): void {
    this.stop()
    this.output?.disconnect()
    this.ctx = null
    this.output = null
  }

  private applyBpm(bpm: number): void {
    this.options = { ...this.options, bpm }
    this.clock?.update({ bpm })
  }

  private schedule(): void {
    if (!this.ctx || !this.clock || !this.output) return
    const ticks = this.clock.collect(this.ctx.currentTime + SCHEDULE_AHEAD_S, () => {
      return this.tempoLadder?.barCompleted() ?? undefined
    })
    this.options.bpm = this.clock.bpm
    for (const tick of ticks) {
      this.playClick(tick)
      this.visualQueue.push(tick)
    }
  }

  private playClick(tick: Tick): void {
    if (!this.ctx || !this.output) return
    const sound = clickFor(tick, this.options.accents)
    if (!sound) return
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.frequency.value = sound.freq
    env.gain.setValueAtTime(0, tick.time)
    env.gain.linearRampToValueAtTime(sound.gain, tick.time + 0.001)
    env.gain.exponentialRampToValueAtTime(0.0001, tick.time + 0.04)
    osc.connect(env).connect(this.output)
    osc.start(tick.time)
    osc.stop(tick.time + 0.05)
  }
}
