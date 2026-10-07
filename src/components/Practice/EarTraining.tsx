import { useEffect, useMemo, useRef, useState } from 'react'
import { playSequence } from '../../audio/notePlayer'
import { INTERVAL_SETS, makeQuestion, pickIntervals, type Direction, type EarQuestion, type IntervalSetId } from '../../practice/ear'
import { recordCardAnswer } from '../../state/progress/db'
import { useSettings } from '../../state/settings'
import { INTERVALS } from '../../theory/catalog'
import { chromaNames, type FretboardView } from '../../theory/fretboard'
import { midiName } from '../../theory/notation'
import { getTuning } from '../../theory/tunings'
import { Fretboard } from '../Fretboard/Fretboard'
import { RadioGroup } from './RadioGroup'
import { useCardSchedules, useToday } from './usePractice'

const ROUND_SIZE = 10
const labelOf = (interval: string) => INTERVALS.find((i) => i.id === interval)?.label ?? interval
const nowIso = () => new Date().toISOString()
const clock = () => performance.now()

interface Answer {
  question: EarQuestion
  chosen: string
  ok: boolean
}

/** Entrenamiento auditivo: reconocer intervalos en el registro del bajo, con repaso espaciado por intervalo. */
export function EarTraining() {
  const { tuningId, leftHanded, notation } = useSettings()
  const today = useToday()
  const schedules = useCardSchedules()
  const [setId, setSetId] = useState<IntervalSetId>('basicos')
  const [direction, setDirection] = useState<Direction>('asc')
  const [questions, setQuestions] = useState<EarQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [phase, setPhase] = useState<'setup' | 'question' | 'summary'>('setup')
  const shownAt = useRef(0)
  const nextRef = useRef<HTMLButtonElement>(null)

  const intervals = INTERVAL_SETS[setId].intervals
  const question = questions[index] as EarQuestion | undefined
  const answer = question ? answers[index] : undefined

  useEffect(() => {
    if (answer) nextRef.current?.focus()
  }, [answer])

  /** Dos notas a 70 BPM (algo menos de un segundo entre ellas). */
  const play = (q: EarQuestion) => void playSequence([q.first, q.second], 70)

  const start = () => {
    const picked = pickIntervals(intervals, schedules, today, ROUND_SIZE)
    const round = picked.map((i) => makeQuestion(i, direction))
    setQuestions(round)
    setIndex(0)
    setAnswers([])
    setPhase('question')
    shownAt.current = clock()
    play(round[0])
  }

  const choose = (interval: string) => {
    if (!question || answer) return
    const ok = interval === question.interval
    setAnswers((prev) => [...prev, { question, chosen: interval, ok }])
    void recordCardAnswer(question.cardId, { date: nowIso(), ok, ms: Math.round(clock() - shownAt.current) })
  }

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase('summary')
      return
    }
    setIndex(index + 1)
    shownAt.current = clock()
    play(questions[index + 1])
  }

  // Al responder, el intervalo se dibuja en el mástil desde la nota grave.
  const low = question ? Math.min(question.first, question.second) : 0
  const view = useMemo<FretboardView | null>(
    () =>
      question ? { mode: 'interval', root: chromaNames(low % 12)[0], type: question.interval, frets: [0, 12], labels: 'interval' } : null,
    [question, low],
  )

  if (phase === 'setup') {
    return (
      <div className="quiz">
        <p className="hint">
          Escucharás dos notas seguidas. Di qué intervalo hay entre ellas. Empieza por cuarta, quinta y octava: son los
          saltos que más usa el bajo.
        </p>
        <RadioGroup
          legend="Intervalos"
          name="ear-set"
          options={(Object.keys(INTERVAL_SETS) as IntervalSetId[]).map((id) => ({ value: id, label: INTERVAL_SETS[id].label }))}
          value={setId}
          onChange={setSetId}
        />
        <RadioGroup
          legend="Dirección"
          name="ear-dir"
          options={[
            { value: 'asc', label: 'Hacia arriba' },
            { value: 'desc', label: 'Hacia abajo' },
          ]}
          value={direction}
          onChange={setDirection}
        />
        <button type="button" className="btn btn--primary btn--big" onClick={start}>
          Empezar ronda de {ROUND_SIZE}
        </button>
      </div>
    )
  }

  if (phase === 'summary') {
    const correct = answers.filter((a) => a.ok).length
    const missed = [...new Set(answers.filter((a) => !a.ok).map((a) => a.question.interval))]
    return (
      <div className="quiz" aria-live="polite">
        <p className="quiz-summary">
          Aciertos: <strong>{correct}</strong> de {answers.length}
        </p>
        {missed.length > 0 && <p>Para repasar: {missed.map(labelOf).join(', ')}.</p>}
        <div className="row">
          <button type="button" className="btn btn--primary btn--big" onClick={start}>
            Otra ronda
          </button>
          <button type="button" className="btn btn--big" onClick={() => setPhase('setup')}>
            Cambiar opciones
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="quiz">
      <p className="quiz-progress">
        Pregunta {index + 1} de {questions.length}
      </p>
      <p className="quiz-prompt" data-testid="ear-question" data-interval={question.interval}>
        ¿Qué intervalo es?
      </p>
      <div className="row">
        <button type="button" className="btn btn--big" onClick={() => play(question)}>
          Escuchar otra vez
        </button>
      </div>
      <div className="quiz-answers quiz-answers--wide" role="group" aria-label="Intervalos">
        {intervals.map((interval) => (
          <button
            key={interval}
            type="button"
            className={`btn quiz-answer${answer?.chosen === interval ? (answer.ok ? ' is-ok' : ' is-wrong') : ''}`}
            disabled={answer !== undefined}
            onClick={() => choose(interval)}
          >
            {labelOf(interval)}
          </button>
        ))}
      </div>
      <p className="quiz-feedback" aria-live="polite" data-testid="ear-feedback">
        {answer &&
          (answer.ok
            ? `¡Bien! ${labelOf(question.interval)}.`
            : `No: era ${labelOf(question.interval).toLowerCase()}.`)}
        {answer && ` (${midiName(question.first, notation)} → ${midiName(question.second, notation)})`}
      </p>
      {answer && view && (
        <Fretboard
          tuning={getTuning(tuningId)}
          view={view}
          leftHanded={leftHanded}
          notation={notation}
          description={`${labelOf(question.interval)} desde ${midiName(low, notation, false)}`}
        />
      )}
      {answer && (
        <button ref={nextRef} type="button" className="btn btn--primary btn--big" onClick={next}>
          {index + 1 >= questions.length ? 'Ver resumen' : 'Siguiente'}
        </button>
      )}
    </div>
  )
}
