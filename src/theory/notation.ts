import { Interval, Note } from 'tonal'

/** Nomenclatura mostrada al usuario. La interna (Tonal) es siempre anglosajona. */
export type Notation = 'anglo' | 'latina'

const LATIN: Record<string, string> = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
}

// Dobles alteraciones con dos signos: 𝄪/𝄫 no están en muchas fuentes de móvil.
const ACCIDENTAL: Record<string, string> = {
  '#': '♯',
  '##': '♯♯',
  b: '♭',
  bb: '♭♭',
  '': '',
}

/**
 * Nombre legible de una nota: "Bb2" → "B♭" (anglo) o "Si♭" (latina).
 * Por defecto omite la octava.
 */
export function formatNote(name: string, notation: Notation, withOctave = false): string {
  const note = Note.get(name)
  if (note.empty) return name
  const letter = notation === 'latina' ? LATIN[note.letter] : note.letter
  const acc = ACCIDENTAL[note.acc] ?? note.acc
  const octave = withOctave && note.oct !== undefined ? String(note.oct) : ''
  return `${letter}${acc}${octave}`
}

/**
 * Grado a partir de un intervalo de Tonal, con la alteración relativa al
 * intervalo mayor/justo: "1P" → "1", "3m" → "♭3", "5d" → "♭5", "4A" → "♯4".
 * Se reduce a la octava (9 → 2).
 */
export function degreeFromInterval(interval: string): string {
  const match = /^(\d+)([PMmdA]+)$/.exec(interval)
  if (!match) return interval
  const num = ((Number(match[1]) - 1) % 7) + 1
  const quality = match[2]
  const perfect = [1, 4, 5].includes(num)
  let alt = 0
  if (quality === 'm') alt = -1
  else if (quality.startsWith('d')) alt = perfect ? -quality.length : -quality.length - 1
  else if (quality.startsWith('A')) alt = quality.length
  const sign = alt < 0 ? '♭'.repeat(-alt) : '♯'.repeat(alt)
  return `${sign}${num}`
}

/** Intervalo en notación española: "3m" → "3m", "5P" → "5J", "7M" → "7M". */
export function formatInterval(interval: string): string {
  return interval.replace('P', 'J')
}

/** Nombre de una nota MIDI con sostenidos ("E1", "F♯2"; "Mi1" en latina). */
export function midiName(midi: number, notation: Notation, withOctave = true): string {
  return formatNote(Note.fromMidiSharps(midi), notation, withOctave)
}

/** Semitonos de un intervalo de Tonal ("5P" → 7). */
export function intervalSemitones(interval: string): number {
  const semitones = Interval.semitones(interval)
  if (semitones === undefined || Number.isNaN(semitones)) throw new Error(`Intervalo desconocido: ${interval}`)
  return semitones
}
