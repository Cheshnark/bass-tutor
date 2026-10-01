import { Chord, Note, Scale } from 'tonal'
import type { Tuning } from './tunings'

export const MAX_FRET = 24

export type FretboardMode = 'notes' | 'scale' | 'arpeggio' | 'interval'
export type LabelMode = 'note' | 'degree' | 'interval'

/** Qué se muestra en el mástil (coincide con el modelo de contenido de docs/research.md §7). */
export interface FretboardView {
  mode: FretboardMode
  /** Fundamental como clase de altura: "C", "Bb", "F#". Opcional en modo "notes". */
  root?: string
  /** Tipo en nomenclatura de Tonal: escala ("minor pentatonic"), acorde ("m7") o intervalo ("5P"). */
  type?: string
  /** Rango de trastes inclusivo [desde, hasta]. */
  frets: [number, number]
  labels: LabelMode
}

/** Conjunto de notas a resaltar, con la ortografía correcta y su intervalo desde la fundamental. */
export interface PitchSet {
  root: string
  notes: string[]
  intervals: string[]
}

export interface FretPosition {
  /** Índice de cuerda: 0 = la más grave. */
  string: number
  fret: number
  midi: number
  chroma: number
  /** Nombre con octava y ortografía elegida ("Eb2"). */
  note: string
  /** Clase de altura con la misma ortografía ("Eb"). */
  pc: string
  /** Pertenece al conjunto (en modo "notes", todas). */
  inSet: boolean
  isRoot: boolean
  /** Intervalo desde la fundamental (Tonal: "3m", "5P"), si pertenece al conjunto. */
  interval?: string
}

export function resolvePitchSet(view: FretboardView): PitchSet | null {
  const { mode, root, type } = view
  if (mode === 'notes') return null
  if (!root || !type) throw new Error(`El modo "${mode}" necesita fundamental y tipo`)
  if (Note.get(root).empty) throw new Error(`Fundamental no válida: ${root}`)

  if (mode === 'scale') {
    const scale = Scale.get(`${root} ${type}`)
    if (scale.empty) throw new Error(`Escala desconocida: ${type}`)
    return { root, notes: scale.notes, intervals: scale.intervals }
  }
  if (mode === 'arpeggio') {
    const chord = Chord.getChord(type, root)
    if (chord.empty) throw new Error(`Acorde desconocido: ${type}`)
    return { root, notes: chord.notes, intervals: chord.intervals }
  }
  const target = Note.transpose(root, type)
  if (!target) throw new Error(`Intervalo desconocido: ${type}`)
  return { root, notes: [root, Note.pitchClass(target)], intervals: ['1P', type] }
}

/** Nombre con octava para un midi respetando la ortografía `pc` (p. ej., E# o Cb). */
export function spellMidi(midi: number, pc: string): string {
  const approx = Math.floor(midi / 12) - 1
  for (const oct of [approx, approx - 1, approx + 1]) {
    if (Note.midi(`${pc}${oct}`) === midi) return `${pc}${oct}`
  }
  throw new Error(`${pc} no corresponde al midi ${midi}`)
}

function prefersFlats(root: string | undefined): boolean {
  return !!root && Note.get(root).acc.startsWith('b')
}

export function validateFrets([from, to]: [number, number]): void {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to > MAX_FRET || from > to) {
    throw new Error(`Rango de trastes no válido: [${from}, ${to}]`)
  }
}

/**
 * Calcula todas las posiciones del mástil para una afinación y una vista.
 * Resultado ordenado por cuerda (grave → aguda) y traste.
 */
export function buildFretboard(tuning: Tuning, view: FretboardView): FretPosition[] {
  validateFrets(view.frets)
  const set = resolvePitchSet(view)
  const flats = prefersFlats(set?.root ?? view.root)
  const rootChroma = view.root !== undefined ? Note.chroma(view.root) : undefined
  const positions: FretPosition[] = []

  tuning.strings.forEach((open, stringIndex) => {
    const openMidi = Note.midi(open)
    if (openMidi === null) throw new Error(`Cuerda no válida: ${open}`)
    for (let fret = view.frets[0]; fret <= view.frets[1]; fret++) {
      const midi = openMidi + fret
      const chroma = midi % 12
      const index = set ? set.notes.findIndex((n) => Note.chroma(n) === chroma) : -1
      const inSet = set ? index >= 0 : true
      const pc =
        index >= 0 && set
          ? set.notes[index]
          : Note.pitchClass(flats ? Note.fromMidi(midi) : Note.fromMidiSharps(midi))
      positions.push({
        string: stringIndex,
        fret,
        midi,
        chroma,
        note: spellMidi(midi, pc),
        pc,
        inSet,
        isRoot: rootChroma !== undefined && chroma === rootChroma,
        interval: index >= 0 && set ? set.intervals[index] : undefined,
      })
    }
  })
  return positions
}

/** Altura de una casilla: midi y clase de altura (0 = C … 11 = B). */
export function fretPitch(open: string, fret: number): { midi: number; chroma: number } {
  const openMidi = Note.midi(open)
  if (openMidi === null) throw new Error(`Cuerda no válida: ${open}`)
  const midi = openMidi + fret
  return { midi, chroma: midi % 12 }
}

/**
 * Nombres de una clase de altura (0–11): la natural ("D") o sus dos enarmónicos ("C#", "Db").
 * Sirve para preguntar y responder notas sin depender de una tonalidad.
 */
export function chromaNames(chroma: number): string[] {
  const sharp = Note.pitchClass(Note.fromMidiSharps(60 + chroma))
  const flat = Note.pitchClass(Note.fromMidi(60 + chroma))
  return sharp === flat ? [sharp] : [sharp, flat]
}
