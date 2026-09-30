/**
 * Itinerarios del curso: un tronco común y, después, un itinerario por estilo
 * (docs/pedagogy.md). Sin dependencias: lo usan el esquema (Node) y la app (navegador).
 */

export const TRACK_IDS = ['comun', 'rock-pop', 'funk-soul', 'blues-jazz', 'metal-punk'] as const

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
    id: 'rock-pop',
    label: 'Rock / pop',
    summary: 'Corcheas firmes en la fundamental, 1-5-8, apagado y, si quieres, púa.',
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

export function getTrack(id: TrackId): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]
}
