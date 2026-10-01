/** Tempos que se ofrecen siempre, como fracción del tempo escrito en la partitura. */
const FACTORS = [0.5, 0.75, 0.9, 1, 1.1]

/**
 * Tempos (BPM) del selector de reproducción: fracciones del tempo de la partitura y, si lo hay,
 * el tempo de práctica del alumno. Sin repetidos y de menor a mayor.
 */
export function tempoOptions(scoreBpm: number, practiceBpm?: number): number[] {
  const options = new Set(FACTORS.map((f) => Math.round(scoreBpm * f)))
  if (practiceBpm !== undefined) options.add(Math.round(practiceBpm))
  return [...options].sort((a, b) => a - b)
}

/** Velocidad de alphaTab (`playbackSpeed`) para sonar a `bpm` cuando la partitura está escrita a `scoreBpm`. */
export function playbackSpeedFor(bpm: number, scoreBpm: number): number {
  return bpm / scoreBpm
}
