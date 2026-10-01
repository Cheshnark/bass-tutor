import { describe, expect, it } from 'vitest'
import { getTuning } from '../theory/tunings'
import { schedule, type Schedule } from './leitner'
import { checkFind, checkName, DEFAULT_QUIZ_OPTIONS, dueCount, pickQuestions, quizCards, summarize } from './quiz'

const standard = getTuning('standard-4')
const at = (day: number) => new Date(2026, 9, day, 18).toISOString()
const seeded = (seed = 1) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

describe('quizCards', () => {
  it('por defecto, cuerdas E y A, trastes 0–12, los dos tipos', () => {
    const cards = quizCards(standard, DEFAULT_QUIZ_OPTIONS)
    // 13 casillas + 12 notas por cuerda, dos cuerdas.
    expect(cards).toHaveLength(2 * (13 + 12))
    expect(cards[0]).toEqual({ id: 'nombrar:E1:0', kind: 'nombrar', open: 'E1', string: 0, fret: 0, chroma: 4 })
  })

  it('solo naturales', () => {
    const cards = quizCards(standard, { ...DEFAULT_QUIZ_OPTIONS, strings: [0], naturalsOnly: true })
    // En la E, trastes 0–12: E F G A B C D E → 8 casillas; 7 notas para encontrar.
    expect(cards.filter((c) => c.kind === 'nombrar')).toHaveLength(8)
    expect(cards.filter((c) => c.kind === 'encontrar')).toHaveLength(7)
  })

  it('las tarjetas llevan la cuerda al aire, no solo el índice (drop D es otra cuerda)', () => {
    const dropD = quizCards(getTuning('drop-d-4'), { ...DEFAULT_QUIZ_OPTIONS, strings: [0], kinds: ['nombrar'] })
    expect(dropD[0].id).toBe('nombrar:D1:0')
  })
})

describe('respuestas', () => {
  const [e5] = quizCards(standard, { ...DEFAULT_QUIZ_OPTIONS, strings: [0], kinds: ['nombrar'] }).filter((c) => c.fret === 5)

  it('nombrar: vale la nota por su clase de altura', () => {
    expect(checkName(e5, 9)).toBe(true) // A
    expect(checkName(e5, 10)).toBe(false)
  })

  it('encontrar: cuerda y nota; cualquier octava dentro de la cuerda', () => {
    const findE = quizCards(standard, { ...DEFAULT_QUIZ_OPTIONS, strings: [0], kinds: ['encontrar'] }).find((c) => c.chroma === 4)!
    expect(checkFind(findE, 0, 0)).toBe(true)
    expect(checkFind(findE, 0, 12)).toBe(true)
    expect(checkFind(findE, 1, 7)).toBe(false) // E en la cuerda A: cuerda equivocada
    expect(checkFind(findE, 0, 5)).toBe(false)
  })
})

describe('pickQuestions', () => {
  const cards = quizCards(standard, DEFAULT_QUIZ_OPTIONS)
  const today = '2026-10-10'
  const schedules = new Map<string, Schedule>([
    ['nombrar:E1:3', schedule([{ date: at(1), ok: true }])!], // repaso el 2: atrasada
    ['nombrar:E1:5', schedule([{ date: at(9), ok: false }])!], // repaso el 10: toca hoy
    ['nombrar:E1:7', schedule([{ date: at(1), ok: true }, { date: at(2), ok: true }, { date: at(9), ok: true }])!], // no toca
  ])

  it('incluye primero las que tocan y no repite tarjetas', () => {
    const picked = pickQuestions(cards, schedules, today, 10, seeded())
    const ids = picked.map((c) => c.id)
    expect(ids).toHaveLength(10)
    expect(new Set(ids).size).toBe(10)
    expect(ids).toEqual(expect.arrayContaining(['nombrar:E1:3', 'nombrar:E1:5']))
    expect(ids).not.toContain('nombrar:E1:7') // hay tarjetas nuevas de sobra
  })

  it('si no hay más, usa también las que no tocan', () => {
    const few = cards.filter((c) => schedules.has(c.id))
    expect(pickQuestions(few, schedules, today, 10, seeded())).toHaveLength(3)
  })

  it('dueCount cuenta las que tocan hoy', () => {
    expect(dueCount(cards, schedules, today)).toBe(2)
  })
})

describe('summarize', () => {
  it('cuenta aciertos, tiempo medio y las más difíciles (falladas y lentas)', () => {
    const [a, b, c, d] = quizCards(standard, DEFAULT_QUIZ_OPTIONS)
    const s = summarize(
      [
        { card: a, ok: true, ms: 1000 },
        { card: b, ok: false, ms: 900 },
        { card: c, ok: true, ms: 4000 },
        { card: d, ok: true, ms: 2000 },
      ],
      2,
    )
    expect(s).toMatchObject({ correct: 3, total: 4, averageMs: 1975 })
    expect(s.hardest).toEqual([b, c])
  })
})
