/**
 * Quiz de mástil: tarjetas con repaso espaciado (mismo Leitner que los ejercicios).
 *
 * Dos tipos de pregunta:
 * - "nombrar": se marca una casilla y respondes qué nota es.
 * - "encontrar": te dan una nota y una cuerda y tocas la casilla.
 * Cada tarjeta guarda su propio historial; una respuesta acertada es un "ok" para Leitner.
 */
import { chromaNames, fretPitch } from '../theory/fretboard'
import type { Tuning } from '../theory/tunings'
import { daysBetween, type Schedule } from './leitner'

export type QuestionKind = 'nombrar' | 'encontrar'

export interface QuizCard {
  /** "nombrar:E1:5" (casilla) o "encontrar:A1:2" (clase de altura en una cuerda). */
  id: string
  kind: QuestionKind
  /** Cuerda al aire con octava ("E1"): identifica la cuerda aunque cambie la afinación. */
  open: string
  /** Índice de la cuerda en la afinación (0 = la más grave). */
  string: number
  /** Solo en "nombrar". */
  fret?: number
  /** Nota buscada (0 = C … 11 = B). */
  chroma: number
}

export interface QuizOptions {
  /** Índices de cuerda (0 = la más grave). */
  strings: readonly number[]
  /** Traste más alto que se pregunta (desde el 0). */
  maxFret: number
  kinds: readonly QuestionKind[]
  /** Solo notas naturales (sin sostenidos ni bemoles). */
  naturalsOnly: boolean
}

export const DEFAULT_QUIZ_OPTIONS: QuizOptions = {
  strings: [0, 1],
  maxFret: 12,
  kinds: ['nombrar', 'encontrar'],
  naturalsOnly: false,
}

const isNatural = (chroma: number) => chromaNames(chroma).length === 1

/** Todas las tarjetas posibles para una afinación y unas opciones. */
export function quizCards(tuning: Tuning, options: QuizOptions): QuizCard[] {
  const cards: QuizCard[] = []
  for (const string of options.strings) {
    const open = tuning.strings[string]
    if (!open) continue
    if (options.kinds.includes('nombrar')) {
      for (let fret = 0; fret <= options.maxFret; fret++) {
        const { chroma } = fretPitch(open, fret)
        if (options.naturalsOnly && !isNatural(chroma)) continue
        cards.push({ id: `nombrar:${open}:${fret}`, kind: 'nombrar', open, string, fret, chroma })
      }
    }
    if (options.kinds.includes('encontrar')) {
      for (let chroma = 0; chroma < 12; chroma++) {
        if (options.naturalsOnly && !isNatural(chroma)) continue
        cards.push({ id: `encontrar:${open}:${chroma}`, kind: 'encontrar', open, string, chroma })
      }
    }
  }
  return cards
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Elige las preguntas de una ronda: primero las tarjetas que toca repasar (las más atrasadas),
 * después tarjetas nuevas y, si faltan, cualquier otra. La ronda se baraja.
 */
export function pickQuestions(
  cards: readonly QuizCard[],
  schedules: ReadonlyMap<string, Schedule>,
  today: string,
  count: number,
  random: () => number = Math.random,
): QuizCard[] {
  const due = cards
    .filter((c) => {
      const s = schedules.get(c.id)
      return s !== undefined && s.due <= today
    })
    .sort((a, b) => daysBetween(schedules.get(b.id)!.due, schedules.get(a.id)!.due))
  const fresh = shuffle(
    cards.filter((c) => !schedules.has(c.id)),
    random,
  )
  const rest = shuffle(
    cards.filter((c) => {
      const s = schedules.get(c.id)
      return s !== undefined && s.due > today
    }),
    random,
  )
  return shuffle([...due, ...fresh, ...rest].slice(0, count), random)
}

/** Cuántas tarjetas tocan hoy. */
export function dueCount(cards: readonly QuizCard[], schedules: ReadonlyMap<string, Schedule>, today: string): number {
  return cards.filter((c) => (schedules.get(c.id)?.due ?? '9999') <= today).length
}

/** "nombrar": ¿la nota elegida (0–11) es la de la casilla? Vale cualquier enarmónico. */
export function checkName(card: QuizCard, chroma: number): boolean {
  return card.chroma === chroma
}

/** "encontrar": ¿la casilla tocada está en la cuerda pedida y es la nota buscada? */
export function checkFind(card: QuizCard, string: number, fret: number): boolean {
  return string === card.string && fretPitch(card.open, fret).chroma === card.chroma
}

/** Respuesta con su tiempo, para mostrar al final de la ronda. */
export interface QuizAnswer {
  card: QuizCard
  ok: boolean
  ms: number
}

/** Resumen de una ronda: aciertos, tiempo medio y las notas que más cuestan (falladas o más lentas). */
export function summarize(answers: readonly QuizAnswer[], slowest = 3) {
  const correct = answers.filter((a) => a.ok).length
  const averageMs = answers.length ? Math.round(answers.reduce((s, a) => s + a.ms, 0) / answers.length) : 0
  const hardest = [...answers]
    .sort((a, b) => Number(a.ok) - Number(b.ok) || b.ms - a.ms)
    .slice(0, slowest)
    .map((a) => a.card)
  return { correct, total: answers.length, averageMs, hardest }
}
