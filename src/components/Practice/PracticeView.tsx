import { BLOCK_LABELS, ROUTINE_LENGTHS, TEMPLATES, type RoutineLength } from '../../practice/routine'
import { DailyQueue } from './DailyQueue'
import { FretboardQuiz } from './FretboardQuiz'
import { RoutinePlayer } from './RoutinePlayer'
import './Practice.css'

const isLength = (value: string | undefined): value is `${RoutineLength}` =>
  ROUTINE_LENGTHS.some((l) => String(l) === value)

/** Práctica: repaso de hoy, rutinas guiadas y quiz de mástil (`#/practica`, `#/practica/rutina/30`, `#/practica/quiz`). */
export function PracticeView({ params }: { params: string[] }) {
  const [section, arg] = params

  if (section === 'quiz') {
    return (
      <section className="panel practice" aria-labelledby="practice-title">
        <p className="lesson-kicker">
          <a href="#/practica">Práctica</a>
        </p>
        <h2 id="practice-title">Quiz de mástil</h2>
        <FretboardQuiz />
      </section>
    )
  }

  if (section === 'rutina' && isLength(arg)) {
    return (
      <section className="panel practice" aria-labelledby="practice-title">
        <p className="lesson-kicker">
          <a href="#/practica">Práctica</a>
        </p>
        <h2 id="practice-title">Rutina de {arg} minutos</h2>
        <RoutinePlayer length={Number(arg) as RoutineLength} />
      </section>
    )
  }

  return (
    <section className="panel practice" aria-labelledby="practice-title">
      <h2 id="practice-title">Práctica</h2>

      <section aria-labelledby="practice-today">
        <h3 id="practice-today">Repaso de hoy</h3>
        <DailyQueue />
      </section>

      <section aria-labelledby="practice-routines">
        <h3 id="practice-routines">Rutinas</h3>
        <p className="hint">
          Con los ejercicios que ya has practicado, empezando por los que toca repasar. Las tareas se alternan
          (técnica, mástil, groove…) en vez de hacer cada una de un tirón.
        </p>
        <ul className="routine-choices">
          {ROUTINE_LENGTHS.map((length) => (
            <li key={length}>
              <a className="btn btn--primary btn--big" href={`#/practica/rutina/${length}`}>
                {length} min
              </a>
              <span className="hint">{TEMPLATES[length].map((b) => BLOCK_LABELS[b.kind]).join(' → ')}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practice-quiz">
        <h3 id="practice-quiz">Quiz de mástil</h3>
        <p className="hint">Nombra y encuentra notas en el mástil. Las que te cuestan vuelven antes.</p>
        <a className="btn btn--big" href="#/practica/quiz">
          Abrir el quiz
        </a>
      </section>
    </section>
  )
}
