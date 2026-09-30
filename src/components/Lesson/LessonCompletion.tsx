import { completeLesson, requestPersistence } from '../../state/progress/db'
import { useExercisesProgress, useLessonProgress } from '../../state/progress/hooks'
import { canCompleteLesson } from '../../state/progress/model'

const DATE = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' })

/**
 * Estado de la lección: completada, lista para completar, o qué falta.
 * Para completarla hace falta al menos un intento guardado de cada ejercicio (docs/research.md §11:
 * evita que la lección se quede en "leída pero no tocada").
 */
export function LessonCompletion({ lessonId, exerciseIds }: { lessonId: string; exerciseIds: string[] }) {
  const lesson = useLessonProgress(lessonId)
  const exercises = useExercisesProgress(exerciseIds)

  if (lesson?.completedAt) {
    return (
      <p className="lesson-completion lesson-completion--done" data-testid="lesson-completion">
        ✓ Lección completada el {DATE.format(new Date(lesson.completedAt))}
      </p>
    )
  }

  const ready = canCompleteLesson(exerciseIds, exercises)
  const missing = exerciseIds.filter((id) => !exercises.get(id)?.history.length).length

  return (
    <div className="lesson-completion" data-testid="lesson-completion">
      {ready ? (
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            void completeLesson(lessonId)
            void requestPersistence()
          }}
        >
          Completar lección
        </button>
      ) : (
        <p className="hint">
          Para completar la lección, guarda al menos un intento de {missing === 1 ? 'su ejercicio' : `sus ${missing} ejercicios`}.
        </p>
      )}
    </div>
  )
}
