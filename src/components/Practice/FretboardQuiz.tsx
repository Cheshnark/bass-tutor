import { useEffect, useMemo, useRef, useState } from 'react'
import { playNote } from '../../audio/notePlayer'
import { dueCount, checkFind, checkName, DEFAULT_QUIZ_OPTIONS, pickQuestions, quizCards, summarize } from '../../practice/quiz'
import type { QuestionKind, QuizAnswer, QuizCard, QuizOptions } from '../../practice/quiz'
import { useSettings } from '../../state/settings'
import { recordCardAnswer } from '../../state/progress/db'
import { chromaNames, fretPitch, type FretboardView, type FretPosition } from '../../theory/fretboard'
import { formatNote, type Notation } from '../../theory/notation'
import { getTuning, type Tuning } from '../../theory/tunings'
import { Fretboard, type FretMark } from '../Fretboard/Fretboard'
import { RadioGroup } from './RadioGroup'
import { useCardSchedules, useToday } from './usePractice'

export const ROUND_SIZE = 10

/** Reloj para medir el tiempo de respuesta y fecha de la respuesta: se leen al responder, no al pintar. */
const clock = () => performance.now()
const nowIso = () => new Date().toISOString()

/** "C♯/D♭" o "Do♯/Re♭". */
const noteName = (chroma: number, notation: Notation) => chromaNames(chroma).map((n) => formatNote(n, notation)).join('/')
const stringName = (tuning: Tuning, string: number, notation: Notation) => formatNote(tuning.strings[string], notation)

function describeCard(card: QuizCard, tuning: Tuning, notation: Notation): string {
  const where = `cuerda ${stringName(tuning, card.string, notation)}`
  return card.kind === 'nombrar'
    ? `Traste ${card.fret} de la ${where} (${noteName(card.chroma, notation)})`
    : `${noteName(card.chroma, notation)} en la ${where}`
}

interface Result {
  ok: boolean
  /** Lo que respondió: nota (nombrar) o casilla (encontrar). */
  chroma?: number
  position?: { string: number; fret: number }
}

type Phase = 'setup' | 'question' | 'summary'

/**
 * Quiz de mástil con repaso espaciado. Sin puntuaciones ni cuenta atrás (la app es tranquila):
 * se guarda el tiempo de respuesta y al final se muestran las notas que más cuestan.
 */
export function FretboardQuiz({ embedded = false }: { embedded?: boolean }) {
  const { tuningId, leftHanded, notation } = useSettings()
  const tuning = getTuning(tuningId)
  const today = useToday()
  const schedules = useCardSchedules()
  const [options, setOptions] = useState<QuizOptions>(DEFAULT_QUIZ_OPTIONS)
  const [phase, setPhase] = useState<Phase>('setup')
  const [questions, setQuestions] = useState<QuizCard[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const shownAt = useRef(0)
  const nextRef = useRef<HTMLButtonElement>(null)

  // Tras responder, el foco pasa a "Siguiente" para poder seguir con el teclado.
  useEffect(() => {
    if (result) nextRef.current?.focus()
  }, [result])

  const cards = useMemo(() => quizCards(tuning, options), [tuning, options])
  const due = dueCount(cards, schedules, today)
  const view = useMemo<FretboardView>(() => ({ mode: 'notes', frets: [0, options.maxFret], labels: 'note' }), [options.maxFret])

  const start = () => {
    setQuestions(pickQuestions(cards, schedules, today, ROUND_SIZE))
    setIndex(0)
    setAnswers([])
    setResult(null)
    setPhase('question')
    shownAt.current = clock()
  }

  const card = questions[index] as QuizCard | undefined

  const answer = (next: Result) => {
    if (!card || result) return
    const ms = Math.round(clock() - shownAt.current)
    setResult(next)
    setAnswers((prev) => [...prev, { card, ok: next.ok, ms }])
    void recordCardAnswer(card.id, { date: nowIso(), ok: next.ok, ms })
    if (card.kind === 'nombrar' && card.fret !== undefined) void playNote(fretPitch(card.open, card.fret).midi)
  }

  const onName = (chroma: number) => card && answer({ ok: checkName(card, chroma), chroma })
  const onFind = (p: FretPosition) =>
    card && answer({ ok: checkFind(card, p.string, p.fret), position: { string: p.string, fret: p.fret } })

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase('summary')
      return
    }
    setIndex(index + 1)
    setResult(null)
    shownAt.current = clock()
  }

  if (phase === 'setup' && embedded) {
    // En una rutina se empieza directamente con las opciones por defecto.
    return (
      <div className="quiz">
        <p>{due > 0 ? `Tienes ${due} notas del mástil para repasar.` : 'Una ronda de 10 preguntas sobre el mástil.'}</p>
        <button type="button" className="btn btn--primary btn--big" onClick={start}>
          Empezar ronda
        </button>
      </div>
    )
  }

  if (phase === 'setup') {
    const lowTwo = [0, 1]
    const all = tuning.strings.map((_, i) => i)
    const setKinds = (kinds: QuestionKind[]) => setOptions({ ...options, kinds })
    return (
      <div className="quiz">
        <p className="hint">
          Dos tipos de pregunta: <strong>nombrar</strong> la nota de una casilla y <strong>encontrar</strong> una nota en
          una cuerda. Las notas que fallas o te cuestan vuelven antes (repaso espaciado).
        </p>
        <RadioGroup
          legend="Cuerdas"
          name="quiz-strings"
          options={[
            { value: 'graves', label: `${stringName(tuning, 0, notation)} y ${stringName(tuning, 1, notation)}` },
            { value: 'todas', label: 'Todas' },
          ]}
          value={options.strings.length === all.length ? 'todas' : 'graves'}
          onChange={(v) => setOptions({ ...options, strings: v === 'graves' ? lowTwo : all })}
        />
        <RadioGroup
          legend="Preguntas"
          name="quiz-kinds"
          options={[
            { value: 'ambas', label: 'Las dos' },
            { value: 'nombrar', label: 'Nombrar' },
            { value: 'encontrar', label: 'Encontrar' },
          ]}
          value={options.kinds.length === 2 ? 'ambas' : options.kinds[0]}
          onChange={(v) => setKinds(v === 'ambas' ? ['nombrar', 'encontrar'] : [v])}
        />
        <label className="quiz-check">
          <input
            type="checkbox"
            checked={options.naturalsOnly}
            onChange={(e) => setOptions({ ...options, naturalsOnly: e.target.checked })}
          />{' '}
          Solo notas naturales (sin ♯ ni ♭)
        </label>
        <p>{due > 0 ? `Hoy tocan ${due} de estas tarjetas.` : 'Hoy no tienes tarjetas pendientes con estas opciones.'}</p>
        <button type="button" className="btn btn--primary btn--big" onClick={start} disabled={cards.length === 0}>
          Empezar ronda de {ROUND_SIZE}
        </button>
      </div>
    )
  }

  if (phase === 'summary') {
    const s = summarize(answers)
    return (
      <div className="quiz" aria-live="polite">
        <p className="quiz-summary">
          Aciertos: <strong>{s.correct}</strong> de {s.total} · Tiempo medio:{' '}
          <strong>{(s.averageMs / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1 })} s</strong>
        </p>
        {s.hardest.length > 0 && (
          <>
            <p>Lo que más te ha costado:</p>
            <ul>
              {s.hardest.map((c) => (
                <li key={c.id}>{describeCard(c, tuning, notation)}</li>
              ))}
            </ul>
          </>
        )}
        <div className="row">
          <button type="button" className="btn btn--primary btn--big" onClick={start}>
            Otra ronda
          </button>
          {!embedded && (
            <button type="button" className="btn btn--big" onClick={() => setPhase('setup')}>
              Cambiar opciones
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!card) return null

  const marks: FretMark[] = []
  if (card.kind === 'nombrar' && card.fret !== undefined) {
    const label = result ? formatNote(chromaNames(card.chroma)[0], notation) : '?'
    marks.push({ string: card.string, fret: card.fret, label, tone: result ? (result.ok ? 'ok' : 'wrong') : 'ask' })
  }
  if (card.kind === 'encontrar' && result?.position) {
    const { string, fret } = result.position
    marks.push({ string, fret, label: result.ok ? '✓' : '✗', tone: result.ok ? 'ok' : 'wrong' })
    if (!result.ok) {
      // Dónde estaba: todas las casillas de esa nota en la cuerda pedida.
      for (let f = 0; f <= options.maxFret; f++) {
        if (fretPitch(card.open, f).chroma === card.chroma) {
          marks.push({ string: card.string, fret: f, label: formatNote(chromaNames(card.chroma)[0], notation), tone: 'ok' })
        }
      }
    }
  }

  const correctName = noteName(card.chroma, notation)
  const prompt =
    card.kind === 'nombrar' ? (
      <>
        ¿Qué nota es? <span className="hint">(cuerda {stringName(tuning, card.string, notation)}, traste {card.fret})</span>
      </>
    ) : (
      <>
        Toca <strong>{correctName}</strong> en la cuerda <strong>{stringName(tuning, card.string, notation)}</strong>
      </>
    )

  return (
    <div className="quiz">
      <p className="quiz-progress">
        Pregunta {index + 1} de {questions.length}
      </p>
      <p className="quiz-prompt" data-testid="quiz-prompt">
        {prompt}
      </p>
      <p className="hint quiz-rotate">Gira el móvil para ver todo el mástil, o desplázalo de lado.</p>
      <Fretboard
        tuning={tuning}
        view={view}
        leftHanded={leftHanded}
        notation={notation}
        sound={card.kind === 'encontrar'}
        marks={marks}
        description={card.kind === 'encontrar' ? 'pulsa una casilla para responder' : 'una casilla marcada con ?'}
        onNoteClick={card.kind === 'encontrar' && !result ? onFind : undefined}
      />
      {card.kind === 'nombrar' && (
        <div className="quiz-answers" role="group" aria-label="Respuestas">
          {Array.from({ length: 12 }, (_, chroma) => (
            <button
              key={chroma}
              type="button"
              className={`btn quiz-answer${result?.chroma === chroma ? (result.ok ? ' is-ok' : ' is-wrong') : ''}`}
              disabled={result !== null}
              onClick={() => onName(chroma)}
            >
              {noteName(chroma, notation)}
            </button>
          ))}
        </div>
      )}
      <p className="quiz-feedback" aria-live="polite" data-testid="quiz-feedback">
        {result && (result.ok ? `¡Bien! Es ${correctName}.` : `No: es ${correctName}.`)}
      </p>
      {result && (
        <button ref={nextRef} type="button" className="btn btn--primary btn--big" onClick={next}>
          {index + 1 >= questions.length ? 'Ver resumen' : 'Siguiente'}
        </button>
      )}
    </div>
  )
}
