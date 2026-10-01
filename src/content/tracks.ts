/**
 * Itinerarios del curso: un tronco común, una ampliación común (arpegios, escalas, groove, lectura) que vale para
 * cualquier estilo y, en paralelo, un itinerario por estilo (docs/pedagogy.md).
 * Sin dependencias: lo usan el esquema (Node) y la app (navegador).
 */

export const TRACK_IDS = ['comun', 'ampliacion', 'rock-pop', 'funk-soul', 'blues-jazz', 'metal-punk'] as const

export type TrackId = (typeof TRACK_IDS)[number]

export interface Track {
  id: TrackId
  label: string
  summary: string
}

export const TRACKS: Track[] = [
  {
    id: 'comun',
    label: 'Tronco común',
    summary: 'Técnica de las dos manos, ritmo, cómo ubicarte en el mástil y tus primeras líneas.',
  },
  {
    id: 'ampliacion',
    label: 'Ampliación común',
    summary: 'Arpegios, escalas, groove y lectura: para cualquier estilo. Puedes hacerla a la vez que un itinerario.',
  },
  {
    id: 'rock-pop',
    label: 'Rock / pop',
    summary: 'Corcheas en la fundamental, aproximaciones, octavas, progresiones pop, riffs y la canción entera.',
  },
  {
    id: 'funk-soul',
    label: 'Funk / soul / Motown',
    summary: 'Semicorcheas, síncopa, notas muertas y octavas; slap más adelante.',
  },
  {
    id: 'blues-jazz',
    label: 'Blues / jazz',
    summary: 'Shuffle, blues de 12 compases, notas de paso y walking bass.',
  },
  {
    id: 'metal-punk',
    label: 'Metal / punk',
    summary: 'Púa alterna, palm mute, galope, resistencia y afinaciones graves.',
  },
]

/** Itinerarios cuyas lecciones pueden ser prerrequisito de cualquier otro (en el orden del curso). */
export const SHARED_TRACKS: readonly TrackId[] = ['comun', 'ampliacion']

/** Itinerarios por estilo (los que se eligen). */
export const STYLE_TRACKS = TRACKS.filter((t) => !SHARED_TRACKS.includes(t.id))

export function getTrack(id: TrackId): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]
}
