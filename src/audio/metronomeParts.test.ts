import { describe, expect, it } from 'vitest'
import { clickFor, defaultAccents, nextAccent, resizeAccents } from './accents'
import { BeatClock, type Tick } from './beatClock'
import { TapTempo } from './tapTempo'
import { TempoLadder, validateLadder, type LadderConfig } from './tempoLadder'

const tick = (beatInBar: number, subInBeat = 0): Tick => ({
  time: 0,
  beatInBar,
  subInBeat,
  bar: 0,
  bpm: 60,
  kind: subInBeat ? 'subdivision' : beatInBar === 0 ? 'downbeat' : 'beat',
})

describe('acentos', () => {
  it('por defecto: primer tiempo acentuado', () => {
    expect(defaultAccents(3)).toEqual(['accent', 'normal', 'normal'])
  })

  it('ciclo acento → normal → silencio → acento', () => {
    expect(nextAccent('accent')).toBe('normal')
    expect(nextAccent('normal')).toBe('silent')
    expect(nextAccent('silent')).toBe('accent')
  })

  it('redimensionar conserva lo configurado', () => {
    expect(resizeAccents(['normal', 'silent', 'accent', 'normal'], 6)).toEqual([
      'normal', 'silent', 'accent', 'normal', 'normal', 'normal',
    ])
    expect(resizeAccents(['normal', 'silent', 'accent', 'normal'], 2)).toEqual(['normal', 'silent'])
  })

  it('el acento suena más fuerte y agudo que el normal; la subdivisión, más suave', () => {
    const accents = defaultAccents(4)
    const a = clickFor(tick(0), accents)
    const n = clickFor(tick(1), accents)
    const s = clickFor(tick(1, 1), accents)
    expect(a && n && s).toBeTruthy()
    expect(a!.gain).toBeGreaterThan(n!.gain)
    expect(a!.freq).toBeGreaterThan(n!.freq)
    expect(s!.gain).toBeLessThan(n!.gain)
  })

  it('un pulso en silencio no suena, ni sus subdivisiones', () => {
    const accents = resizeAccents(['accent', 'silent'], 4)
    expect(clickFor(tick(1), accents)).toBeNull()
    expect(clickFor(tick(1, 1), accents)).toBeNull()
    expect(clickFor(tick(2), accents)).not.toBeNull()
  })

  it('un tiempo 1 no acentuado suena como normal', () => {
    expect(clickFor(tick(0), ['normal', 'normal'])).toEqual(clickFor(tick(1), ['normal', 'normal']))
  })
})

describe('tap tempo', () => {
  it('necesita al menos dos pulsaciones', () => {
    const tap = new TapTempo()
    expect(tap.tap(0)).toBeNull()
    expect(tap.tap(500)).toBe(120)
  })

  it('promedia los últimos intervalos', () => {
    const tap = new TapTempo(4)
    tap.tap(0)
    tap.tap(1000) // 60
    tap.tap(1500) // media (1500/2) → 80
    expect(tap.tap(2000)).toBe(90) // 2000/3 ms → 90
    // Ventana de 4: descarta la primera pulsación
    expect(tap.tap(2500)).toBe(Math.round(60_000 / (1500 / 3)))
  })

  it('reinicia tras una pausa larga', () => {
    const tap = new TapTempo(6, 2000)
    tap.tap(0)
    tap.tap(1000)
    expect(tap.tap(5000)).toBeNull()
    expect(tap.count).toBe(1)
    expect(tap.tap(5250)).toBe(240)
  })

  it('limita al rango del metrónomo', () => {
    const tap = new TapTempo()
    tap.tap(0)
    expect(tap.tap(50)).toBe(300)
  })
})

describe('escalera de tempo', () => {
  const config: LadderConfig = { start: 60, target: 72, step: 5, mode: 'bars', everyBars: 2 }

  it('valida la configuración', () => {
    expect(validateLadder(config)).toBeNull()
    expect(validateLadder({ ...config, target: 60 })).not.toBeNull()
    expect(validateLadder({ ...config, step: 0 })).not.toBeNull()
    expect(validateLadder({ ...config, everyBars: 0 })).not.toBeNull()
    expect(validateLadder({ ...config, start: 5 })).not.toBeNull()
    expect(() => new TempoLadder({ ...config, target: 50 })).toThrow()
  })

  it('modo compases: sube cada N compases y no pasa del objetivo', () => {
    const ladder = new TempoLadder(config)
    expect(ladder.barCompleted()).toBeNull()
    expect(ladder.barCompleted()).toBe(65)
    expect(ladder.barCompleted()).toBeNull()
    expect(ladder.barCompleted()).toBe(70)
    ladder.barCompleted()
    expect(ladder.barCompleted()).toBe(72)
    expect(ladder.done).toBe(true)
    expect(ladder.progress).toBe(1)
    expect(ladder.barCompleted()).toBeNull()
  })

  it('modo manual: solo sube al marcar pase', () => {
    const ladder = new TempoLadder({ ...config, mode: 'manual' })
    expect(ladder.barCompleted()).toBeNull()
    expect(ladder.barCompleted()).toBeNull()
    expect(ladder.pass()).toBe(65)
    expect(ladder.pass()).toBe(70)
    expect(ladder.pass()).toBe(72)
    expect(ladder.pass()).toBeNull()
  })

  it('un pase reinicia la cuenta de compases', () => {
    const ladder = new TempoLadder(config)
    ladder.barCompleted()
    ladder.pass() // 65
    expect(ladder.barCompleted()).toBeNull()
    expect(ladder.barCompleted()).toBe(70)
  })
})

describe('BeatClock + escalera', () => {
  it('el cambio de tempo cae exactamente en el primer tiempo del compás', () => {
    const clock = new BeatClock({ bpm: 60, beatsPerBar: 2, subdivision: 1 }, 0)
    const ladder = new TempoLadder({ start: 60, target: 120, step: 60, mode: 'bars', everyBars: 1 })
    const bars: number[] = []
    const ticks = clock.collect(3.01, (bar) => {
      bars.push(bar)
      return ladder.barCompleted() ?? undefined
    })
    // Compás 0 a 60 bpm: t = 0, 1. Compás 1 empieza en t = 2 y ya va a 120 bpm: 2, 2.5, 3
    expect(ticks.map((t) => t.time)).toEqual([0, 1, 2, 2.5, 3])
    expect(ticks.map((t) => t.bpm)).toEqual([60, 60, 120, 120, 120])
    expect(ticks.map((t) => t.bar)).toEqual([0, 0, 1, 1, 2])
    expect(bars).toEqual([1, 2])
  })

  it('el hook se llama una vez por compás aunque las ventanas corten a mitad', () => {
    const clock = new BeatClock({ bpm: 120, beatsPerBar: 4, subdivision: 2 }, 0)
    const bars: number[] = []
    for (let now = 0; now < 20; now += 0.037) clock.collect(now + 0.1, (bar) => void bars.push(bar))
    expect(bars).toEqual(Array.from({ length: bars.length }, (_, i) => i + 1))
    expect(bars.length).toBe(10)
  })
})
