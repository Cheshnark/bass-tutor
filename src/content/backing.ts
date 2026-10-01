/**
 * Backing tracks generados (Fase 5): a partir de `backing.harmony` (un acorde por compás), el compás y el *feel*
 * del ejercicio, se añaden al alphaTex una pista de batería y otra de acordes. alphaTab solo dibuja la primera pista
 * (el bajo) pero suenan todas. Los ejercicios que ya traen sus pistas (p. ej., el módulo "Tocar con la banda")
 * se dejan como están.
 */
import { closeVoicing } from '../theory/voicing'

export type Feel = 'straight' | 'swing' | 'shuffle'

export interface BackingSpec {
  harmony: readonly string[]
  timeSignature: string
  feel: Feel
}

const BS = '\\'
const K = 'KickHit'
const S = 'SnareHit'
const H = 'HiHatClosed'
const C = 'CrashMediumHit'

const hit = (parts: string[]) => (parts.length === 1 ? parts[0] : `(${parts.join(' ')})`)

/** ¿El alphaTex tiene ya más de una pista? */
export function hasAccompaniment(alphaTex: string): boolean {
  return (alphaTex.match(new RegExp(`${BS}${BS}track\\b`, 'g')) ?? []).length > 1
}

function parseTimeSignature(ts: string): { beats: number; unit: number } {
  const [beats, unit] = ts.split('/').map(Number)
  return { beats, unit }
}

/**
 * Batería de un compás. Pulsos de negra (x/4): charles en corcheas (o en tresillo con swing/shuffle), bombo en el
 * 1 y el 3, caja en los pulsos pares. Compases de corchea (6/8, 12/8…): charles en cada corchea, bombo al empezar
 * los grupos impares de tres y caja en los pares.
 */
function drumBar(spec: BackingSpec, first: boolean): string {
  const { beats, unit } = parseTimeSignature(spec.timeSignature)
  const kickBeat = (beat: number) => beat === 0 || (beats >= 4 && beat === 2)
  const snareBeat = (beat: number) => beat % 2 === 1

  if (unit === 8) {
    return (
      ':8 ' +
      Array.from({ length: beats }, (_, i) => {
        const group = Math.floor(i / 3)
        const start = i % 3 === 0
        const parts = [start && group % 2 === 0 ? K : '', start && group % 2 === 1 ? S : '', i === 0 && first ? C : H]
        return hit(parts.filter(Boolean))
      }).join(' ')
    )
  }

  const triplet = spec.feel !== 'straight'
  return Array.from({ length: beats }, (_, beat) => {
    const accent = [kickBeat(beat) ? K : '', snareBeat(beat) ? S : '', beat === 0 && first ? C : H].filter(Boolean)
    if (triplet) return `:8 ${hit(accent)} {tu 3} r {tu 3} ${H} {tu 3}`
    return `:8 ${hit(accent)} ${H}`
  }).join(' ')
}

/** Último compás: golpe de bombo y plato en el 1 y silencio hasta el final. */
function drumEnd(spec: BackingSpec): string {
  const { beats, unit } = parseTimeSignature(spec.timeSignature)
  const rests = Array.from({ length: beats - 1 }, () => 'r').join(' ')
  return `:${unit} ${hit([K, C])}${rests ? ` ${rests}` : ''}`
}

/** Acordes de un compás: un golpe por pulso (negra en x/4; negra con puntillo por grupo en x/8). */
function chordBar(symbol: string, spec: BackingSpec, last: boolean): string {
  const { beats, unit } = parseTimeSignature(spec.timeSignature)
  const chord = `(${closeVoicing(symbol).join(' ')})`
  if (unit === 8 && beats % 3 === 0) {
    const groups = beats / 3
    return last
      ? `:4 ${chord} {d}${' r {d}'.repeat(groups - 1)}`
      : `:4 ${Array.from({ length: groups }, () => `${chord} {d}`).join(' ')}`
  }
  if (unit === 8) return `:8 ${Array.from({ length: beats }, (_, i) => (last && i > 0 ? 'r' : chord)).join(' ')}`
  return `:${unit} ${Array.from({ length: beats }, (_, i) => (last && i > 0 ? 'r' : chord)).join(' ')}`
}

/** Pistas de acompañamiento (batería y acordes) para añadir tras la del bajo. */
export function backingTracks(spec: BackingSpec): string {
  const n = spec.harmony.length
  const drums = spec.harmony.map((_, i) => (i === n - 1 ? drumEnd(spec) : drumBar(spec, i === 0))).join(' |\n')
  const chords = spec.harmony.map((symbol, i) => chordBar(symbol, spec, i === n - 1)).join(' |\n')
  return [
    `${BS}track "Batería" { volume 11 }`,
    `${BS}instrument percussion`,
    `${BS}clef neutral`,
    `${BS}articulation defaults`,
    drums,
    `${BS}track "Acordes" { instrument "Electric Piano 1" volume 8 }`,
    `${BS}staff { score }`,
    `${BS}tuning piano`,
    chords,
  ].join('\n')
}

/**
 * alphaTex listo para sonar con acompañamiento: el original más batería y acordes, si el ejercicio tiene armonía
 * y aún no trae sus propias pistas. Si no, el original.
 */
export function withBacking(alphaTex: string, spec: Partial<BackingSpec> & { timeSignature: string }): string {
  if (!spec.harmony?.length || hasAccompaniment(alphaTex)) return alphaTex
  return `${alphaTex.trimEnd()}\n${backingTracks({ harmony: spec.harmony, timeSignature: spec.timeSignature, feel: spec.feel ?? 'straight' })}\n`
}
