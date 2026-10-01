/**
 * Cola de repaso del día: sale solo del historial guardado (criterio de la Fase 4).
 */
import type { ExerciseProgress } from '../state/progress/model'
import { attemptOutcomes } from '../state/progress/model'
import { daysBetween, schedule, type Schedule } from './leitner'

export interface ReviewItem {
  exerciseId: string
  schedule: Schedule
  /** Días de retraso respecto a la fecha de repaso (0 = toca hoy). */
  overdueDays: number
}

/** Intervalos de repaso de un ejercicio (los de su lección). */
export type ReviewDaysOf = (exerciseId: string) => readonly number[] | undefined

/** Calendario de cada ejercicio con historial. */
export function exerciseSchedules(progress: Iterable<ExerciseProgress>, reviewDaysOf: ReviewDaysOf): Map<string, Schedule> {
  const result = new Map<string, Schedule>()
  for (const p of progress) {
    const s = schedule(attemptOutcomes(p.history), reviewDaysOf(p.exerciseId))
    if (s) result.set(p.exerciseId, s)
  }
  return result
}

/**
 * Ejercicios que toca repasar hoy: primero los más atrasados y, a igualdad, los de caja más baja
 * (los menos asentados).
 */
export function dailyQueue(schedules: ReadonlyMap<string, Schedule>, today: string): ReviewItem[] {
  const items: ReviewItem[] = []
  for (const [exerciseId, s] of schedules) {
    if (s.due <= today) items.push({ exerciseId, schedule: s, overdueDays: daysBetween(s.due, today) })
  }
  return items.sort(
    (a, b) => b.overdueDays - a.overdueDays || a.schedule.box - b.schedule.box || a.exerciseId.localeCompare(b.exerciseId),
  )
}

/** Próximo día con repasos pendientes (después de hoy), o null si no hay ninguno. */
export function nextReviewDay(schedules: ReadonlyMap<string, Schedule>, today: string): string | null {
  let next: string | null = null
  for (const s of schedules.values()) {
    if (s.due > today && (next === null || s.due < next)) next = s.due
  }
  return next
}
