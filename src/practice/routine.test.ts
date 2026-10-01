import { describe, expect, it } from 'vitest'
import { schedule, type Schedule } from './leitner'
import { buildRoutine, exerciseKind, ROUTINE_LENGTHS, routineMinutes, TEMPLATES } from './routine'

const at = (day: number) => new Date(2026, 9, day, 18).toISOString()
const sched = (...days: number[]) => schedule(days.map((d) => ({ date: at(d), ok: true }))) as Schedule

const candidates = [
  { id: 'cromatico', tags: ['mano-izquierda', 'cromatico', 'calentamiento'] },
  { id: 'alternancia', tags: ['mano-derecha', 'alternancia'] },
  { id: 'apagado', tags: ['mano-derecha', 'apagado'] },
  { id: 'fundamentales', tags: ['fundamental', 'i-iv-v'] },
  { id: 'galope', tags: ['pua', 'galope'] },
  { id: 'sin-practicar', tags: ['fundamental'] },
]

describe('plantillas', () => {
  it('duran lo que dicen', () => {
    for (const length of ROUTINE_LENGTHS) expect(routineMinutes(TEMPLATES[length])).toBe(length)
  })

  it('alternan tipos de tarea: nunca dos bloques seguidos del mismo tipo', () => {
    for (const length of ROUTINE_LENGTHS) {
      const kinds = TEMPLATES[length].map((b) => b.kind)
      kinds.slice(1).forEach((k, i) => expect(k).not.toBe(kinds[i]))
    }
  })
})

describe('exerciseKind', () => {
  it('clasifica por etiquetas', () => {
    expect(exerciseKind(['cromatico', 'mano-izquierda'])).toBe('calentamiento')
    expect(exerciseKind(['pua', 'galope'])).toBe('groove')
    expect(exerciseKind(['mano-derecha'])).toBe('tecnica')
  })
})

describe('buildRoutine', () => {
  const today = '2026-10-20'
  const schedules = new Map<string, Schedule>([
    ['cromatico', sched(18)],
    ['alternancia', sched(1, 2)], // repaso el 5: muy atrasado
    ['apagado', sched(19)], // repaso el 20: toca hoy
    ['fundamentales', sched(15)], // repaso el 16
    ['galope', sched(19)], // repaso el 20
  ])

  it('sin ejercicios practicados no hay rutina', () => {
    expect(buildRoutine(15, candidates, new Map(), today)).toEqual([])
  })

  it('cada bloque usa un ejercicio de su tipo, empezando por los repasos más atrasados', () => {
    const r = buildRoutine(30, candidates, schedules, today)
    expect(r.map((b) => [b.kind, b.exerciseId])).toEqual([
      ['calentamiento', 'cromatico'],
      ['tecnica', 'alternancia'],
      ['mastil', undefined],
      ['groove', 'fundamentales'],
      ['tecnica', 'apagado'],
      ['groove', 'galope'],
    ])
    expect(routineMinutes(r)).toBe(30)
  })

  it('no usa ejercicios sin practicar', () => {
    const ids = buildRoutine(45, candidates, schedules, today).map((b) => b.exerciseId)
    expect(ids).not.toContain('sin-practicar')
  })

  it('con pocos ejercicios, los reutiliza sin repetir el del bloque anterior', () => {
    const two = new Map([...schedules].filter(([id]) => id === 'alternancia' || id === 'fundamentales'))
    const ids = buildRoutine(45, candidates, two, today)
      .filter((b) => b.kind !== 'mastil')
      .map((b) => b.exerciseId)
    expect(ids.every(Boolean)).toBe(true)
    ids.slice(1).forEach((id, i) => expect(id).not.toBe(ids[i]))
  })
})
