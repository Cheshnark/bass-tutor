import { useMemo } from 'react'
import { dailyQueue } from '../../practice/queue'
import { useExerciseSchedules, useToday } from './usePractice'

/** Aviso en el índice del curso cuando hay repasos pendientes hoy. */
export function PracticeReminder() {
  const today = useToday()
  const schedules = useExerciseSchedules()
  const due = useMemo(() => (schedules ? dailyQueue(schedules, today).length : 0), [schedules, today])
  if (due === 0) return null
  return (
    <p className="practice-reminder" data-testid="practice-reminder">
      Hoy tienes {due === 1 ? '1 ejercicio' : `${due} ejercicios`} para repasar.{' '}
      <a className="btn btn--primary" href="#/practica">
        Ir a Práctica
      </a>
    </p>
  )
}
