import { useState } from 'react'
import { course, getExercise, lessonOfExercise } from '../../content/course'
import { BLOCK_LABELS, buildRoutine, type RoutineBlock, type RoutineLength } from '../../practice/routine'
import { useNow } from '../../useNow'
import { useWakeLock } from '../../useWakeLock'
import { LessonExercise } from '../Lesson/ExerciseCard'
import { FretboardQuiz } from './FretboardQuiz'
import { useExerciseSchedules, useToday } from './usePractice'

const candidates = course.exercises.map((e) => ({ id: e.id, tags: e.tags }))

const mmss = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

/** Temporizador de un bloque. Solo pinta (no suena): se actualiza a partir del reloj, sin acumular deriva. */
function useBlockTimer(blockKey: string) {
  const [state, setState] = useState({ key: blockKey, elapsed: 0, startedAt: null as number | null })
  // Al cambiar de bloque, el temporizador vuelve a cero.
  const current = state.key === blockKey ? state : { key: blockKey, elapsed: 0, startedAt: null }
  if (current !== state) setState(current)

  const running = current.startedAt !== null
  const [now, syncNow] = useNow(running, 250)

  const elapsed = current.elapsed + (current.startedAt !== null ? now - current.startedAt : 0)
  const toggle = () => {
    const t = syncNow()
    setState(
      current.startedAt === null
        ? { ...current, startedAt: t }
        : { ...current, elapsed: current.elapsed + t - current.startedAt, startedAt: null },
    )
  }
  return { elapsed, running, toggle }
}

/** Rutina guiada: bloques que alternan tipos de tarea, cada uno con su temporizador. */
export function RoutinePlayer({ length }: { length: RoutineLength }) {
  const today = useToday()
  const schedules = useExerciseSchedules()
  // La rutina se monta una vez con el historial del momento: guardar intentos no la cambia a mitad.
  const [blocks, setBlocks] = useState<RoutineBlock[] | null>(null)
  if (blocks === null && schedules) setBlocks(buildRoutine(length, candidates, schedules, today))
  const [index, setIndex] = useState(0)
  const block = blocks?.[index]
  const timer = useBlockTimer(`${index}`)
  useWakeLock(blocks !== null && blocks.length > 0)

  if (!blocks) return <p className="hint">Preparando la rutina…</p>
  if (blocks.length === 0) {
    return (
      <p>
        Para montar una rutina hace falta que hayas practicado algún ejercicio. Empieza por el{' '}
        <a href="#/curso">curso</a> y registra tus intentos.
      </p>
    )
  }
  if (!block) {
    return (
      <div className="routine-done">
        <p>
          <strong>Rutina terminada.</strong> Buen trabajo: mañana tendrás nuevos repasos.
        </p>
        <a className="btn btn--primary btn--big" href="#/practica">
          Volver a Práctica
        </a>
      </div>
    )
  }

  const remaining = block.minutes * 60_000 - timer.elapsed
  const exercise = block.exerciseId ? getExercise(block.exerciseId) : undefined
  const lesson = block.exerciseId ? lessonOfExercise(block.exerciseId) : undefined

  return (
    <div className="routine">
      <ol className="routine-blocks" aria-label="Bloques de la rutina">
        {blocks.map((b, i) => (
          <li key={i} className={i === index ? 'is-current' : i < index ? 'is-done' : undefined} aria-current={i === index ? 'step' : undefined}>
            {BLOCK_LABELS[b.kind]} · {b.minutes} min
          </li>
        ))}
      </ol>

      <section className="routine-block" aria-labelledby="routine-block-title">
        <h2 id="routine-block-title">
          Bloque {index + 1} de {blocks.length} · {BLOCK_LABELS[block.kind]}
        </h2>
        <div className="routine-timer">
          <span className={`routine-timer__time${remaining <= 0 ? ' is-over' : ''}`} data-testid="routine-time" aria-live="off">
            {remaining > 0 ? mmss(remaining) : '0:00'}
          </span>
          <button type="button" className="btn btn--big" onClick={timer.toggle}>
            {timer.running ? 'Pausa' : timer.elapsed > 0 ? 'Seguir' : 'Empezar'}
          </button>
          <button type="button" className="btn btn--primary btn--big" onClick={() => setIndex(index + 1)}>
            {index + 1 < blocks.length ? 'Siguiente bloque' : 'Terminar'}
          </button>
        </div>
        {remaining <= 0 && <p className="routine-over">Tiempo cumplido: pasa al siguiente bloque cuando quieras.</p>}

        {block.kind === 'mastil' ? (
          <FretboardQuiz key={index} embedded />
        ) : (
          exercise && (
            <>
              {lesson && (
                <p className="hint">
                  De la lección <a href={`#/curso/${lesson.id}`}>{lesson.title}</a>.
                </p>
              )}
              <LessonExercise key={index} id={exercise.id} />
            </>
          )
        )}
      </section>
    </div>
  )
}
