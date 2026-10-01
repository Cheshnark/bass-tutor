/**
 * Repaso espaciado tipo Leitner (docs/research.md §4; decisiones en docs/decisions.md).
 *
 * La caja y la próxima fecha de repaso NO se guardan: se calculan siempre a partir del historial,
 * agrupado por día (fecha local). Así un día con varios intentos cuenta como un solo repaso.
 *
 * Reglas, día a día:
 * - Primer día con intentos: caja 1.
 * - Día suspendido (el último intento del día no fue limpio/correcto): vuelve a la caja 1.
 * - Día aprobado en la fecha de repaso o después: sube una caja (máximo MAX_BOX).
 * - Día aprobado antes de la fecha de repaso (práctica extra): no cambia ni la caja ni la fecha.
 * La fecha de repaso es el día del último cambio + el intervalo de la caja.
 */

export const MAX_BOX = 5

/** Intervalos por defecto (días) para las cajas 1, 2, 3…; la última se repite en las cajas superiores. */
export const DEFAULT_REVIEW_DAYS = [1, 3, 7, 21]

/** Un resultado con fecha: un intento de ejercicio o una respuesta del quiz. */
export interface Outcome {
  /** ISO 8601. */
  date: string
  ok: boolean
}

export interface Schedule {
  /** Caja actual (1…MAX_BOX). */
  box: number
  /** Día (YYYY-MM-DD, local) en que toca repasar. */
  due: string
  /** Último día con resultados. */
  lastDay: string
}

/** Día local (YYYY-MM-DD) de una fecha. */
export function dayKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Suma días a un día local (YYYY-MM-DD). */
export function addDays(day: string, days: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + days))
}

/** Días de `from` a `to` (puede ser negativo). Ambos YYYY-MM-DD. */
export function daysBetween(from: string, to: string): number {
  const toDate = (day: string) => {
    const [y, m, d] = day.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toDate(to) - toDate(from)) / 86_400_000)
}

export function intervalForBox(box: number, reviewDays: readonly number[] = DEFAULT_REVIEW_DAYS): number {
  const days = reviewDays.length > 0 ? reviewDays : DEFAULT_REVIEW_DAYS
  return days[Math.min(box, days.length) - 1]
}

/** Calcula la caja y la próxima fecha de repaso. `null` si no hay resultados. */
export function schedule(outcomes: readonly Outcome[], reviewDays: readonly number[] = DEFAULT_REVIEW_DAYS): Schedule | null {
  if (outcomes.length === 0) return null

  // Resultado de cada día: el del último intento de ese día.
  const byDay = new Map<string, { time: number; ok: boolean }>()
  for (const o of outcomes) {
    const time = new Date(o.date).getTime()
    const day = dayKey(o.date)
    const prev = byDay.get(day)
    if (!prev || time >= prev.time) byDay.set(day, { time, ok: o.ok })
  }
  const days = [...byDay.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

  let box = 0
  let due = ''
  for (const [day, { ok }] of days) {
    if (box === 0) box = 1
    else if (!ok) box = 1
    else if (day >= due) box = Math.min(box + 1, MAX_BOX)
    else continue // práctica extra antes de tiempo: no cambia nada
    due = addDays(day, intervalForBox(box, reviewDays))
  }
  return { box, due, lastDay: days[days.length - 1][0] }
}

/** ¿Toca repasar hoy (o ya se pasó la fecha)? */
export function isDue(s: Schedule | null, today: string): boolean {
  return s !== null && s.due <= today
}
