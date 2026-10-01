import { describe, expect, it } from 'vitest'
import { cardIdOf, HIGH_MIDI, INTERVAL_SETS, LOW_MIDI, makeQuestion, pickIntervals } from './ear'
import { schedule, type Schedule } from './leitner'

const at = (day: number) => new Date(2026, 9, day, 18).toISOString()
const seeded = (seed = 1) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

describe('makeQuestion', () => {
  it('quinta ascendente en el registro del bajo', () => {
    const rand = seeded()
    for (let i = 0; i < 50; i++) {
      const q = makeQuestion('5P', 'asc', rand)
      expect(q.second - q.first).toBe(7)
      expect(q.first).toBeGreaterThanOrEqual(LOW_MIDI)
      expect(q.first).toBeLessThanOrEqual(HIGH_MIDI)
      expect(q.cardId).toBe('oido:5P')
    }
  })

  it('descendente: la primera nota es la aguda', () => {
    const q = makeQuestion('8P', 'desc', () => 0)
    expect([q.first, q.second]).toEqual([LOW_MIDI + 12, LOW_MIDI])
  })
})

describe('pickIntervals', () => {
  const intervals = INTERVAL_SETS.terceras.intervals
  const today = '2026-10-10'

  it('primero los intervalos que toca repasar, el más atrasado delante', () => {
    const schedules = new Map<string, Schedule>([
      [cardIdOf('3M'), schedule([{ date: at(8), ok: false }])!], // repaso el 9
      [cardIdOf('3m'), schedule([{ date: at(1), ok: true }])!], // repaso el 2
      [cardIdOf('8P'), schedule([{ date: at(10), ok: true }])!], // repaso el 11: no toca
    ])
    expect(pickIntervals(intervals, schedules, today, 10, seeded()).slice(0, 2)).toEqual(['3m', '3M'])
  })

  it('completa al azar sin repetir el mismo intervalo seguido', () => {
    const picked = pickIntervals(intervals, new Map(), today, 30, seeded(5))
    expect(picked).toHaveLength(30)
    picked.slice(1).forEach((p, i) => expect(p).not.toBe(picked[i]))
    expect(picked.every((p) => intervals.includes(p))).toBe(true)
  })

  it('los conjuntos van de menos a más', () => {
    expect(INTERVAL_SETS.basicos.intervals.every((i) => INTERVAL_SETS.terceras.intervals.includes(i))).toBe(true)
    expect(INTERVAL_SETS.todos.intervals).toHaveLength(12)
  })
})
