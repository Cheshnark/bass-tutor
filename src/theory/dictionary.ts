import { Interval, Note } from 'tonal'
import { ARPEGGIOS, SCALES, type CatalogEntry } from './catalog'
import { resolvePitchSet } from './fretboard'
import { degreeFromInterval } from './notation'

export type DictionaryKind = 'scale' | 'arpeggio'

export interface DictionaryEntry extends CatalogEntry {
  kind: DictionaryKind
  root: string
  /** Notas con la ortografía correcta ("A", "C", "D"...). */
  notes: string[]
  /** Intervalos desde la fundamental en notación Tonal ("1P", "3m"...). */
  intervals: string[]
  /** Fórmula en grados ("1", "♭3", "5"...). */
  degrees: string[]
  /** Semitonos desde la fundamental (0-11). */
  semitones: number[]
  /**
   * Escalas: distancia entre notas consecutivas hasta la octava (T, S, 1½T).
   * Arpegios: intervalo entre notas consecutivas (3M, 3m...).
   */
  steps: string[]
}

export function catalogFor(kind: DictionaryKind): CatalogEntry[] {
  return kind === 'scale' ? SCALES : ARPEGGIOS
}

/** Nombre de un salto de escala en semitonos: 1 → S, 2 → T, 3 → 1½T. */
export function stepName(semitones: number): string {
  if (semitones === 1) return 'S'
  if (semitones === 2) return 'T'
  if (semitones === 3) return '1½T'
  return `${semitones}S`
}

export function describeEntry(kind: DictionaryKind, id: string, root: string): DictionaryEntry {
  const entry = catalogFor(kind).find((e) => e.id === id)
  if (!entry) throw new Error(`No está en el catálogo: ${kind} ${id}`)
  const set = resolvePitchSet({ mode: kind, root, type: id, frets: [0, 12], labels: 'note' })
  if (!set) throw new Error(`Sin notas para ${kind} ${id}`)

  const semitones = set.intervals.map((i) => Interval.semitones(i) ?? 0)
  const steps =
    kind === 'scale'
      ? [...semitones.slice(1), 12].map((s, i) => stepName(s - semitones[i]))
      : set.notes.slice(1).map((note, i) => Interval.distance(set.notes[i], note))

  return {
    ...entry,
    kind,
    root,
    notes: set.notes,
    intervals: set.intervals,
    degrees: set.intervals.map(degreeFromInterval),
    semitones,
    steps,
  }
}

/**
 * Notas MIDI ascendentes para escuchar la entrada en registro de bajo:
 * la fundamental más grave que no baje de `lowest`, y se cierra en la octava.
 */
export function ascendingMidis(entry: DictionaryEntry, lowest = 'E1'): number[] {
  const floor = Note.midi(lowest)
  const rootChroma = Note.chroma(entry.root)
  if (floor === null || rootChroma === undefined) throw new Error('Nota no válida')
  const rootMidi = floor + ((rootChroma - (floor % 12) + 12) % 12)
  return [...entry.semitones.map((s) => rootMidi + s), rootMidi + 12]
}
