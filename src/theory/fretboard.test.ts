import { describe, expect, it } from 'vitest'
import { ARPEGGIOS, INTERVALS, SCALES } from './catalog'
import { buildFretboard, resolvePitchSet, spellMidi, type FretboardView } from './fretboard'
import { getTuning, toAlphaTexTuning, TUNINGS } from './tunings'

const standard4 = getTuning('standard-4')
const at = (positions: ReturnType<typeof buildFretboard>, string: number, fret: number) => {
  const p = positions.find((x) => x.string === string && x.fret === fret)
  if (!p) throw new Error(`sin posición ${string}/${fret}`)
  return p
}
const notesView = (frets: [number, number] = [0, 12]): FretboardView => ({ mode: 'notes', frets, labels: 'note' })

describe('afinaciones', () => {
  it('todas las afinaciones tienen notas válidas de grave a aguda', () => {
    for (const tuning of TUNINGS) {
      const fb = buildFretboard(tuning, notesView([0, 0]))
      const midis = fb.map((p) => p.midi)
      expect(midis).toEqual([...midis].sort((a, b) => a - b))
      expect(fb).toHaveLength(tuning.strings.length)
    }
  })

  it('cubre 4, 5 y 6 cuerdas', () => {
    expect(new Set(TUNINGS.map((t) => t.strings.length))).toEqual(new Set([4, 5, 6]))
  })

  it('genera el \\tuning de alphaTex de aguda a grave', () => {
    expect(toAlphaTexTuning(standard4)).toBe('\\tuning (G2 D2 A1 E1)')
  })

  it('lanza con una afinación desconocida', () => {
    expect(() => getTuning('nope')).toThrow()
  })
})

describe('notas por traste', () => {
  const fb = buildFretboard(standard4, notesView([0, 24]))

  it('cuerdas al aire del 4 cuerdas estándar', () => {
    expect([0, 1, 2, 3].map((s) => at(fb, s, 0).note)).toEqual(['E1', 'A1', 'D2', 'G2'])
  })

  it('traste 5 = siguiente cuerda al aire (salvo afinaciones no por cuartas)', () => {
    expect(at(fb, 0, 5).note).toBe('A1')
    expect(at(fb, 1, 5).note).toBe('D2')
    expect(at(fb, 2, 5).note).toBe('G2')
  })

  it('traste 12 = octava, traste 24 = dos octavas', () => {
    expect(at(fb, 0, 12).note).toBe('E2')
    expect(at(fb, 0, 24).note).toBe('E3')
    expect(at(fb, 3, 12).midi - at(fb, 3, 0).midi).toBe(12)
  })

  it('en modo notas usa sostenidos por defecto', () => {
    expect(at(fb, 0, 1).note).toBe('F1')
    expect(at(fb, 0, 2).note).toBe('F#1')
    expect(at(fb, 1, 1).note).toBe('A#1')
  })

  it('usa bemoles si la fundamental lleva bemol', () => {
    const flat = buildFretboard(standard4, { ...notesView(), root: 'Bb' })
    expect(at(flat, 1, 1).note).toBe('Bb1')
    expect(at(flat, 1, 1).isRoot).toBe(true)
  })

  it('B0 grave en 5 y 6 cuerdas; C3 agudo en 6 cuerdas', () => {
    const six = buildFretboard(getTuning('standard-6'), notesView([0, 0]))
    expect(six[0].note).toBe('B0')
    expect(six[5].note).toBe('C3')
  })

  it('drop D: la cuerda grave al aire es D1 y el traste 2 es E1', () => {
    const drop = buildFretboard(getTuning('drop-d-4'), notesView([0, 2]))
    expect(at(drop, 0, 0).note).toBe('D1')
    expect(at(drop, 0, 2).note).toBe('E1')
  })

  it('respeta el rango de trastes y lo valida', () => {
    const part = buildFretboard(standard4, notesView([5, 7]))
    expect(part).toHaveLength(4 * 3)
    expect(() => buildFretboard(standard4, notesView([7, 5]))).toThrow()
    expect(() => buildFretboard(standard4, notesView([0, 25]))).toThrow()
    expect(() => buildFretboard(standard4, notesView([-1, 5]))).toThrow()
  })
})

describe('escalas, arpegios e intervalos', () => {
  it('G mayor resalta exactamente sus 7 clases de altura', () => {
    const fb = buildFretboard(standard4, { mode: 'scale', root: 'G', type: 'major', frets: [0, 12], labels: 'note' })
    const chromas = new Set(fb.filter((p) => p.inSet).map((p) => p.chroma))
    expect(chromas).toEqual(new Set([7, 9, 11, 0, 2, 4, 6]))
    expect(at(fb, 0, 2).pc).toBe('F#')
    expect(at(fb, 0, 1).inSet).toBe(false) // F natural
  })

  it('Bb mayor se escribe con bemoles (Eb, no D#)', () => {
    const fb = buildFretboard(standard4, { mode: 'scale', root: 'Bb', type: 'major', frets: [0, 12], labels: 'note' })
    const eb = at(fb, 2, 1) // D2 + 1
    expect(eb.pc).toBe('Eb')
    expect(eb.interval).toBe('4P')
  })

  it('F# mayor escribe E# y su octava es correcta', () => {
    const fb = buildFretboard(standard4, { mode: 'scale', root: 'F#', type: 'major', frets: [0, 12], labels: 'note' })
    const eSharp = at(fb, 0, 1) // F1 → E#1
    expect(eSharp.note).toBe('E#1')
    expect(eSharp.midi).toBe(29)
  })

  it('Cm7 da intervalos 1P 3m 5P 7m', () => {
    const fb = buildFretboard(standard4, { mode: 'arpeggio', root: 'C', type: 'm7', frets: [0, 12], labels: 'degree' })
    const c = at(fb, 1, 3)
    const eb = at(fb, 1, 6)
    expect(c.isRoot && c.interval).toBe('1P')
    expect(eb.interval).toBe('3m')
    expect(at(fb, 2, 1).pc).toBe('Eb') // D2 + 1
    expect(at(fb, 2, 0).inSet).toBe(false) // D no está en Cm7
    expect(at(fb, 2, 0).interval).toBeUndefined()
  })

  it('intervalo: fundamental + destino', () => {
    const set = resolvePitchSet({ mode: 'interval', root: 'A', type: '5P', frets: [0, 12], labels: 'interval' })
    expect(set?.notes).toEqual(['A', 'E'])
  })

  it('todo el catálogo existe en Tonal', () => {
    for (const s of SCALES) expect(() => resolvePitchSet({ mode: 'scale', root: 'C', type: s.id, frets: [0, 12], labels: 'note' })).not.toThrow()
    for (const a of ARPEGGIOS) expect(() => resolvePitchSet({ mode: 'arpeggio', root: 'C', type: a.id, frets: [0, 12], labels: 'note' })).not.toThrow()
    for (const i of INTERVALS) expect(() => resolvePitchSet({ mode: 'interval', root: 'C', type: i.id, frets: [0, 12], labels: 'note' })).not.toThrow()
  })

  it('lanza con tipos desconocidos o sin fundamental', () => {
    expect(() => resolvePitchSet({ mode: 'scale', root: 'C', type: 'inventada', frets: [0, 12], labels: 'note' })).toThrow()
    expect(() => resolvePitchSet({ mode: 'arpeggio', type: 'm7', frets: [0, 12], labels: 'note' })).toThrow()
  })
})

describe('spellMidi', () => {
  it('ajusta la octava en los cruces B/C', () => {
    expect(spellMidi(59, 'Cb')).toBe('Cb4')
    expect(spellMidi(60, 'B#')).toBe('B#3')
  })
})
