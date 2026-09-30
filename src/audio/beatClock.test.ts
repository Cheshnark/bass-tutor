import { describe, expect, it } from 'vitest'
import { BeatClock, MAX_BPM, MIN_BPM } from './beatClock'

describe('BeatClock', () => {
  it('coloca las negras a 60/bpm segundos', () => {
    const clock = new BeatClock({ bpm: 120, beatsPerBar: 4, subdivision: 1 }, 1)
    const ticks = clock.collect(3)
    expect(ticks.map((t) => t.time)).toEqual([1, 1.5, 2, 2.5])
  })

  it('marca el primer tiempo del compás y las subdivisiones', () => {
    const clock = new BeatClock({ bpm: 60, beatsPerBar: 3, subdivision: 2 }, 0)
    const kinds = clock.collect(3.01).map((t) => t.kind)
    expect(kinds).toEqual([
      'downbeat', 'subdivision',
      'beat', 'subdivision',
      'beat', 'subdivision',
      'downbeat',
    ])
  })

  it('no repite ni pierde ticks entre ventanas de lookahead irregulares', () => {
    const clock = new BeatClock({ bpm: 97, beatsPerBar: 4, subdivision: 4 }, 0.25)
    const all: number[] = []
    let now = 0
    // Simula despertares de setInterval con jitter entre 5 y 60 ms.
    while (now < 30) {
      now += 0.005 + ((all.length * 7919) % 55) / 1000
      all.push(...clock.collect(now + 0.1).map((t) => t.time))
    }
    const spt = 60 / 97 / 4
    all.forEach((time, i) => {
      expect(time).toBeCloseTo(0.25 + i * spt, 12)
    })
  })

  it('no deriva en 10 minutos a 120 bpm (bucle de 25 ms con jitter)', () => {
    const clock = new BeatClock({ bpm: 120, beatsPerBar: 4, subdivision: 1 }, 0)
    const times: number[] = []
    let now = 0
    while (now < 600) {
      now += 0.02 + (times.length % 3) * 0.005
      times.push(...clock.collect(now + 0.1).map((t) => t.time))
    }
    // Cada tick cae exactamente (sin tolerancia) en i * 0,5 s.
    times.forEach((time, i) => expect(time).toBe(i * 0.5))
    expect(times[1200]).toBe(600)
  })

  it('al cambiar el tempo mantiene el próximo tick en su sitio', () => {
    const clock = new BeatClock({ bpm: 60, beatsPerBar: 4, subdivision: 1 }, 0)
    clock.collect(1.5) // consume t=0 y t=1; el siguiente es t=2
    clock.update({ bpm: 120 })
    expect(clock.collect(3.01).map((t) => t.time)).toEqual([2, 2.5, 3])
  })

  it('limita el bpm al rango admitido', () => {
    const slow = new BeatClock({ bpm: 1, beatsPerBar: 4, subdivision: 1 }, 0)
    expect(slow.secondsPerTick).toBe(60 / MIN_BPM)
    const fast = new BeatClock({ bpm: 10_000, beatsPerBar: 4, subdivision: 1 }, 0)
    expect(fast.secondsPerTick).toBe(60 / MAX_BPM)
  })
})
