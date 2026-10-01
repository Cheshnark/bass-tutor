import { useMemo, useState } from 'react'
import { reviewDaysOf } from '../../content/course'
import { dayKey, schedule, type Schedule } from '../../practice/leitner'
import { exerciseSchedules } from '../../practice/queue'
import { useAllExercisesProgress, useCardsProgress } from '../../state/progress/hooks'

/** Día de hoy (local, YYYY-MM-DD), fijado al montar: no cambia a mitad de una sesión. */
export function useToday(): string {
  const [today] = useState(() => dayKey(new Date()))
  return today
}

/** Calendario de repaso de cada ejercicio practicado. `undefined` mientras carga. */
export function useExerciseSchedules(): ReadonlyMap<string, Schedule> | undefined {
  const progress = useAllExercisesProgress()
  return useMemo(() => (progress ? exerciseSchedules(progress, reviewDaysOf) : undefined), [progress])
}

/** Calendario de repaso de cada tarjeta del quiz de mástil. */
export function useCardSchedules(): ReadonlyMap<string, Schedule> {
  const cards = useCardsProgress()
  return useMemo(() => {
    const result = new Map<string, Schedule>()
    for (const card of cards) {
      const s = schedule(card.history)
      if (s) result.set(card.cardId, s)
    }
    return result
  }, [cards])
}

/** "jueves, 1 de octubre" a partir de un día YYYY-MM-DD. */
export function formatDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}
