import { Chord, Note } from 'tonal'

/**
 * Disposición cerrada de un acorde para el acompañamiento: la fundamental entre C3 y B3 y el resto de notas por
 * encima, cada una en la primera octava que quede más aguda que la anterior. Ej.: "G" → G3 B3 D4; "E5" → E3 B3.
 * Lanza un error si Tonal no reconoce el cifrado.
 */
export function closeVoicing(symbol: string, rootOctave = 3): string[] {
  const chord = Chord.get(symbol)
  if (chord.empty || chord.notes.length === 0) throw new Error(`Acorde desconocido: ${symbol}`)
  const voiced: string[] = []
  let previous = -Infinity
  chord.notes.forEach((pc, i) => {
    let octave = i === 0 ? rootOctave : rootOctave - 1
    let midi = Note.midi(`${pc}${octave}`) ?? Number.NaN
    while (midi <= previous) {
      octave++
      midi = Note.midi(`${pc}${octave}`) ?? Number.NaN
    }
    previous = midi
    voiced.push(`${pc}${octave}`)
  })
  return voiced
}
