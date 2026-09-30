/**
 * Afinaciones de bajo. Las cuerdas van de GRAVE a AGUDA (índice 0 = la más grave).
 * Ojo: alphaTex las espera al revés (`\tuning (G2 D2 A1 E1)`); usa `toAlphaTexTuning`.
 */

export interface Tuning {
  id: string
  name: string
  /** Notas al aire con octava, de grave a aguda. */
  strings: string[]
}

export const TUNINGS: Tuning[] = [
  { id: 'standard-4', name: '4 cuerdas · estándar (E A D G)', strings: ['E1', 'A1', 'D2', 'G2'] },
  { id: 'drop-d-4', name: '4 cuerdas · drop D (D A D G)', strings: ['D1', 'A1', 'D2', 'G2'] },
  { id: 'half-down-4', name: '4 cuerdas · medio tono abajo (Eb Ab Db Gb)', strings: ['Eb1', 'Ab1', 'Db2', 'Gb2'] },
  { id: 'standard-5', name: '5 cuerdas · estándar (B E A D G)', strings: ['B0', 'E1', 'A1', 'D2', 'G2'] },
  { id: 'high-c-5', name: '5 cuerdas · Do agudo (E A D G C)', strings: ['E1', 'A1', 'D2', 'G2', 'C3'] },
  { id: 'standard-6', name: '6 cuerdas · estándar (B E A D G C)', strings: ['B0', 'E1', 'A1', 'D2', 'G2', 'C3'] },
]

export const DEFAULT_TUNING_ID = 'standard-4'

export function getTuning(id: string): Tuning {
  const tuning = TUNINGS.find((t) => t.id === id)
  if (!tuning) throw new Error(`Afinación desconocida: ${id}`)
  return tuning
}

/** Cadena `\tuning (...)` para alphaTex (de aguda a grave). */
export function toAlphaTexTuning(tuning: Tuning): string {
  return `\\tuning (${[...tuning.strings].reverse().join(' ')})`
}
