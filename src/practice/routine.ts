/**
 * Rutinas de práctica de 15, 30 y 45 minutos (docs/research.md §4: calentamiento → técnica → mástil →
 * groove, con alternancia de tareas). La alternancia está en las plantillas: los tipos de tarea se
 * intercalan en vez de agotar uno antes de pasar al siguiente (Carter y Grahn 2016; ver research.md §1.1).
 */
import { daysBetween, type Schedule } from './leitner'

export type BlockKind = 'calentamiento' | 'tecnica' | 'mastil' | 'groove'
export type RoutineLength = 15 | 30 | 45

export const ROUTINE_LENGTHS: readonly RoutineLength[] = [15, 30, 45]

export const BLOCK_LABELS: Record<BlockKind, string> = {
  calentamiento: 'Calentamiento',
  tecnica: 'Técnica',
  mastil: 'Mástil',
  groove: 'Groove y líneas',
}

const T = (kind: BlockKind, minutes: number) => ({ kind, minutes })

/** Plantillas: la suma de minutos es la duración de la rutina. */
export const TEMPLATES: Record<RoutineLength, { kind: BlockKind; minutes: number }[]> = {
  15: [T('calentamiento', 3), T('tecnica', 4), T('mastil', 3), T('groove', 5)],
  30: [T('calentamiento', 4), T('tecnica', 5), T('mastil', 4), T('groove', 6), T('tecnica', 5), T('groove', 6)],
  45: [
    T('calentamiento', 5),
    T('tecnica', 6),
    T('mastil', 4),
    T('groove', 7),
    T('tecnica', 6),
    T('mastil', 4),
    T('groove', 7),
    T('tecnica', 6),
  ],
}

const WARMUP_TAGS = ['calentamiento', 'cromatico', 'cuerdas-al-aire', 'postura', 'afinacion']
const GROOVE_TAGS = [
  'fundamental',
  'linea',
  'i-iv-v',
  'riff',
  'nota-pedal',
  'galope',
  'banda',
  'cortes',
  'punk',
  'ritmo',
  'pulso',
  'contratiempo',
  'figuras',
  'acordes',
]

export type ExerciseKind = Exclude<BlockKind, 'mastil'>

/** Tipo de tarea de un ejercicio según sus etiquetas. */
export function exerciseKind(tags: readonly string[]): ExerciseKind {
  if (tags.some((t) => WARMUP_TAGS.includes(t))) return 'calentamiento'
  if (tags.some((t) => GROOVE_TAGS.includes(t))) return 'groove'
  return 'tecnica'
}

export interface RoutineCandidate {
  id: string
  tags: readonly string[]
}

export interface RoutineBlock {
  kind: BlockKind
  minutes: number
  /** Ejercicio del bloque (no en los bloques de mástil). */
  exerciseId?: string
}

/**
 * Prioridad para practicar: primero lo que toca repasar (más atrasado, caja más baja) y después
 * lo que hace más tiempo que no tocas.
 */
function priority(schedules: ReadonlyMap<string, Schedule>, today: string) {
  return (a: string, b: string): number => {
    const sa = schedules.get(a)
    const sb = schedules.get(b)
    if (!sa || !sb) return 0
    const dueA = sa.due <= today ? daysBetween(sa.due, today) : -1
    const dueB = sb.due <= today ? daysBetween(sb.due, today) : -1
    return dueB - dueA || (dueA >= 0 ? sa.box - sb.box : 0) || sa.lastDay.localeCompare(sb.lastDay) || a.localeCompare(b)
  }
}

/**
 * Monta una rutina con los ejercicios que ya has practicado (los que tienen calendario).
 * Devuelve [] si aún no has practicado ninguno.
 */
export function buildRoutine(
  length: RoutineLength,
  candidates: readonly RoutineCandidate[],
  schedules: ReadonlyMap<string, Schedule>,
  today: string,
): RoutineBlock[] {
  const studied = candidates.filter((c) => schedules.has(c.id))
  if (studied.length === 0) return []
  const kindOf = new Map(studied.map((c) => [c.id, exerciseKind(c.tags)]))
  const ordered = studied.map((c) => c.id).sort(priority(schedules, today))

  const used = new Set<string>()
  let previous: string | undefined
  return TEMPLATES[length].map(({ kind, minutes }) => {
    if (kind === 'mastil') return { kind, minutes }
    const pick =
      ordered.find((id) => !used.has(id) && kindOf.get(id) === kind) ??
      ordered.find((id) => !used.has(id)) ??
      ordered.find((id) => id !== previous && kindOf.get(id) === kind) ??
      ordered.find((id) => id !== previous) ??
      ordered[0]
    used.add(pick)
    previous = pick
    return { kind, minutes, exerciseId: pick }
  })
}

export function routineMinutes(blocks: readonly RoutineBlock[]): number {
  return blocks.reduce((sum, b) => sum + b.minutes, 0)
}
