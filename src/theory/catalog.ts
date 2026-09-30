/**
 * Catálogo curado de escalas, arpegios e intervalos con nombre en español.
 * `id` es el nombre que entiende Tonal.js.
 */

export interface CatalogEntry {
  id: string
  label: string
}

export const SCALES: CatalogEntry[] = [
  { id: 'major', label: 'Mayor' },
  { id: 'minor', label: 'Menor natural' },
  { id: 'major pentatonic', label: 'Pentatónica mayor' },
  { id: 'minor pentatonic', label: 'Pentatónica menor' },
  { id: 'blues', label: 'Blues' },
  { id: 'dorian', label: 'Dórica' },
  { id: 'mixolydian', label: 'Mixolidia' },
  { id: 'harmonic minor', label: 'Menor armónica' },
  { id: 'chromatic', label: 'Cromática' },
]

export const ARPEGGIOS: CatalogEntry[] = [
  { id: 'M', label: 'Tríada mayor' },
  { id: 'm', label: 'Tríada menor' },
  { id: 'dim', label: 'Tríada disminuida' },
  { id: 'aug', label: 'Tríada aumentada' },
  { id: 'maj7', label: 'Maj7' },
  { id: 'm7', label: 'm7' },
  { id: '7', label: '7 (dominante)' },
  { id: 'm7b5', label: 'm7♭5 (semidisminuido)' },
  { id: 'dim7', label: 'Dim7' },
]

export const INTERVALS: CatalogEntry[] = [
  { id: '2m', label: 'Segunda menor' },
  { id: '2M', label: 'Segunda mayor' },
  { id: '3m', label: 'Tercera menor' },
  { id: '3M', label: 'Tercera mayor' },
  { id: '4P', label: 'Cuarta justa' },
  { id: '4A', label: 'Cuarta aumentada (tritono)' },
  { id: '5P', label: 'Quinta justa' },
  { id: '6m', label: 'Sexta menor' },
  { id: '6M', label: 'Sexta mayor' },
  { id: '7m', label: 'Séptima menor' },
  { id: '7M', label: 'Séptima mayor' },
  { id: '8P', label: 'Octava' },
]

/** Fundamentales ofrecidas en los selectores (ortografía habitual en bajo). */
export const ROOTS = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
