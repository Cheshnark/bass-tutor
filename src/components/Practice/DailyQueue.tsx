import { useMemo, useState } from 'react'
import { getExercise, lessonOfExercise } from '../../content/course'
import { DEFAULT_QUIZ_OPTIONS, dueCount, quizCards } from '../../practice/quiz'
import { dailyQueue, nextReviewDay } from '../../practice/queue'
import { MAX_BOX } from '../../practice/leitner'
import { useSettings } from '../../state/settings'
import { getTuning } from '../../theory/tunings'
import { LessonExercise } from '../Lesson/ExerciseCard'
import { formatDay, useCardSchedules, useExerciseSchedules, useToday } from './usePractice'

const plural = (n: number, singular: string, pluralForm: string) => `${n} ${n === 1 ? singular : pluralForm}`

/** Repaso de hoy: ejercicios con el repaso vencido y notas del mástil pendientes. Sale solo del historial. */
export function DailyQueue() {
  const today = useToday()
  const schedules = useExerciseSchedules()
  const cardSchedules = useCardSchedules()
  const tuningId = useSettings((s) => s.tuningId)
  const [open, setOpen] = useState<string | null>(null)

  const queue = useMemo(() => (schedules ? dailyQueue(schedules, today) : []), [schedules, today])
  const cardsDue = useMemo(
    () => dueCount(quizCards(getTuning(tuningId), DEFAULT_QUIZ_OPTIONS), cardSchedules, today),
    [tuningId, cardSchedules, today],
  )

  if (!schedules) return <p className="hint">Cargando tu historial…</p>

  return (
    <div className="daily-queue">
      {schedules.size === 0 ? (
        <p>
          Aún no has practicado ningún ejercicio. Empieza por el <a href="#/curso">curso</a>: cada ejercicio que
          registres volverá aquí cuando toque repasarlo.
        </p>
      ) : queue.length === 0 ? (
        <p>
          Nada pendiente hoy.
          {(() => {
            const next = nextReviewDay(schedules, today)
            return next ? ` Próximo repaso: ${formatDay(next)}.` : ''
          })()}
        </p>
      ) : (
        <>
          <p>Hoy toca repasar {plural(queue.length, 'ejercicio', 'ejercicios')}. Empieza por arriba.</p>
          <ol className="queue-list">
            {queue.map((item) => {
              const exercise = getExercise(item.exerciseId)
              const lesson = lessonOfExercise(item.exerciseId)
              if (!exercise) return null
              const isOpen = open === item.exerciseId
              return (
                <li key={item.exerciseId} className="queue-item">
                  <div className="queue-item__head">
                    <span>
                      <strong>{exercise.title}</strong>
                      <span className="hint">
                        {' '}
                        · {lesson?.title} ·{' '}
                        {item.overdueDays === 0 ? 'toca hoy' : `tocaba hace ${plural(item.overdueDays, 'día', 'días')}`} ·
                        nivel {item.schedule.box} de {MAX_BOX}
                      </span>
                    </span>
                    <button
                      type="button"
                      className={`btn${isOpen ? '' : ' btn--primary'}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : item.exerciseId)}
                    >
                      {isOpen ? 'Cerrar' : 'Practicar'}
                    </button>
                  </div>
                  {isOpen && <LessonExercise id={item.exerciseId} />}
                </li>
              )
            })}
          </ol>
        </>
      )}
      <p className="queue-cards">
        {cardsDue > 0 ? `${plural(cardsDue, 'nota', 'notas')} del mástil para repasar.` : 'Mástil: nada pendiente hoy.'}{' '}
        <a className="btn" href="#/practica/quiz">
          Quiz de mástil
        </a>
      </p>
    </div>
  )
}
