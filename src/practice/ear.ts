/**
 * Entrenamiento auditivo: reconocer intervalos en el registro del bajo (research.md §2, módulo "Oído").
 * Cada intervalo es una tarjeta con el mismo repaso espaciado que el quiz de mástil (`oido:5P`).
 */
import { intervalSemitones } from '../theory/notation'
import { daysBetween, type Schedule } from './leitner'

export type IntervalSetId = 'basicos' | 'terceras' | 'todos'

/** Conjuntos, de lo más útil para un bajista (fundamental, quinta, octava) a todos los intervalos. */
export const INTERVAL_SETS: Record<IntervalSetId, { label: string; intervals: string[] }> = {
  basicos: { label: 'Cuarta, quinta y octava', intervals: ['4P', '5P', '8P'] },
  terceras: { label: 'Con terceras', intervals: ['3m', '3M', '4P', '5P', '8P'] },
  todos: { label: 'Todos', intervals: ['2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M', '8P'] },
}

export type Direction = 'asc' | 'desc'

export interface EarQuestion {
  /** Tarjeta del repaso: "oido:5P". */
  cardId: string
  interval: string
  /** Primera nota (MIDI). */
  first: number
  /** Segunda nota (MIDI). */
  second: number
  direction: Direction
}

/** Registro de las preguntas: de E1 (28) a C3 (48) para la nota más grave. */
export const LOW_MIDI = 28
export const HIGH_MIDI = 48

export const cardIdOf = (interval: string) => `oido:${interval}`

/** Una pregunta: nota grave al azar en el registro del bajo y el intervalo hacia arriba (o hacia abajo). */
export function makeQuestion(interval: string, direction: Direction, random: () => number = Math.random): EarQuestion {
  const span = intervalSemitones(interval)
  const low = LOW_MIDI + Math.floor(random() * (HIGH_MIDI - LOW_MIDI + 1))
  const high = low + span
  return direction === 'asc'
    ? { cardId: cardIdOf(interval), interval, first: low, second: high, direction }
    : { cardId: cardIdOf(interval), interval, first: high, second: low, direction }
}

/**
 * Intervalos de una ronda: primero los que toca repasar (más atrasados) y después al azar, sin repetir dos veces
 * seguidas el mismo intervalo.
 */
export function pickIntervals(
  intervals: readonly string[],
  schedules: ReadonlyMap<string, Schedule>,
  today: string,
  count: number,
  random: () => number = Math.random,
): string[] {
  const due = intervals
    .filter((i) => (schedules.get(cardIdOf(i))?.due ?? '9999') <= today)
    .sort((a, b) => daysBetween(schedules.get(cardIdOf(b))!.due, schedules.get(cardIdOf(a))!.due))
  const result: string[] = []
  for (const i of due) if (result.length < count) result.push(i)
  while (result.length < count) {
    const options = intervals.filter((i) => i !== result[result.length - 1])
    const pool = options.length > 0 ? options : intervals
    result.push(pool[Math.floor(random() * pool.length)])
  }
  return result
}
