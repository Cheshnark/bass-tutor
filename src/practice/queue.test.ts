import { describe, expect, it } from 'vitest'
import type { ExerciseProgress } from '../state/progress/model'
import { dailyQueue, exerciseSchedules, nextReviewDay } from './queue'

const at = (day: number) => new Date(2026, 9, day, 18).toISOString()

function progress(exerciseId: string, days: number[], passed = true): ExerciseProgress {
  const history = days.map((d) => ({ date: at(d), bpm: 60, passed }))
  return { exerciseId, bestCleanBpm: passed ? 60 : null, lastPracticed: history[history.length - 1].date, box: 1, history }
}

describe('cola diaria', () => {
  const all = [
    progress('nuevo-ayer', [9]), // caja 1, repaso el 10
    progress('caja-2', [1, 2]), // caja 2, repaso el 5 (5 días de retraso el 10)
    progress('al-dia', [1, 2, 5]), // caja 3, repaso el 12
    progress('suspendido', [8], false), // caja 1, repaso el 9 (1 día de retraso)
  ]
  const schedules = exerciseSchedules(all, () => undefined)

  it('sale del historial y ordena por retraso', () => {
    expect(dailyQueue(schedules, '2026-10-10').map((i) => [i.exerciseId, i.overdueDays])).toEqual([
      ['caja-2', 5],
      ['suspendido', 1],
      ['nuevo-ayer', 0],
    ])
  })

  it('a igual retraso, primero la caja más baja', () => {
    const s = exerciseSchedules([progress('b', [1, 2]), progress('a', [4])], () => undefined)
    // b: caja 2, repaso el 5; a: caja 1, repaso el 5.
    expect(dailyQueue(s, '2026-10-05').map((i) => i.exerciseId)).toEqual(['a', 'b'])
  })

  it('usa los intervalos de la lección de cada ejercicio', () => {
    const s = exerciseSchedules([progress('lento', [1])], (id) => (id === 'lento' ? [4] : undefined))
    expect(dailyQueue(s, '2026-10-04')).toEqual([])
    expect(dailyQueue(s, '2026-10-05')).toHaveLength(1)
  })

  it('sin historial no hay repasos', () => {
    expect(dailyQueue(exerciseSchedules([], () => undefined), '2026-10-10')).toEqual([])
  })

  it('nextReviewDay da el siguiente día con repasos', () => {
    expect(nextReviewDay(schedules, '2026-10-10')).toBe('2026-10-12')
    expect(nextReviewDay(schedules, '2026-10-12')).toBeNull()
  })
})
