import { describe, expect, it } from 'vitest'
import { ARPEGGIOS, SCALES } from './catalog'
import { ascendingMidis, describeEntry, stepName } from './dictionary'

describe('describeEntry: escalas', () => {
  it('mayor: T T S T T T S', () => {
    const e = describeEntry('scale', 'major', 'C')
    expect(e.steps).toEqual(['T', 'T', 'S', 'T', 'T', 'T', 'S'])
    expect(e.degrees).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    expect(e.notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    expect(e.label).toBe('Mayor')
  })

  it('menor natural: T S T T S T T', () => {
    expect(describeEntry('scale', 'minor', 'A').steps).toEqual(['T', 'S', 'T', 'T', 'S', 'T', 'T'])
  })

  it('pentatónica menor de A', () => {
    const e = describeEntry('scale', 'minor pentatonic', 'A')
    expect(e.notes).toEqual(['A', 'C', 'D', 'E', 'G'])
    expect(e.degrees).toEqual(['1', '♭3', '4', '5', '♭7'])
    expect(e.steps).toEqual(['1½T', 'T', 'T', '1½T', 'T'])
  })

  it('blues de E incluye la ♭5 (Bb)', () => {
    const e = describeEntry('scale', 'blues', 'E')
    expect(e.degrees).toContain('♭5')
    expect(e.notes).toContain('Bb')
  })

  it('menor armónica: salto de 1½T entre ♭6 y 7', () => {
    const e = describeEntry('scale', 'harmonic minor', 'A')
    expect(e.degrees).toEqual(['1', '2', '♭3', '4', '5', '♭6', '7'])
    expect(e.steps[5]).toBe('1½T')
    expect(e.notes).toContain('G#')
  })

  it('los pasos de cualquier escala suman una octava', () => {
    const toSemis = (s: string) => (s === 'S' ? 1 : s === 'T' ? 2 : s === '1½T' ? 3 : Number(s.replace('S', '')))
    for (const { id } of SCALES) {
      const total = describeEntry('scale', id, 'G').steps.map(toSemis).reduce((a, b) => a + b, 0)
      expect(total, id).toBe(12)
    }
  })
})

describe('describeEntry: arpegios', () => {
  it('Cmaj7: 1 3 5 7 con terceras 3M 3m 3M', () => {
    const e = describeEntry('arpeggio', 'maj7', 'C')
    expect(e.notes).toEqual(['C', 'E', 'G', 'B'])
    expect(e.degrees).toEqual(['1', '3', '5', '7'])
    expect(e.steps).toEqual(['3M', '3m', '3M'])
  })

  it('G7 (dominante): 1 3 5 ♭7', () => {
    const e = describeEntry('arpeggio', '7', 'G')
    expect(e.notes).toEqual(['G', 'B', 'D', 'F'])
    expect(e.degrees).toEqual(['1', '3', '5', '♭7'])
  })

  it('Bm7♭5: 1 ♭3 ♭5 ♭7', () => {
    expect(describeEntry('arpeggio', 'm7b5', 'B').degrees).toEqual(['1', '♭3', '♭5', '♭7'])
  })

  it('Cdim7: terceras menores y ♭♭7 (Bbb)', () => {
    const e = describeEntry('arpeggio', 'dim7', 'C')
    expect(e.steps).toEqual(['3m', '3m', '3m'])
    expect(e.degrees).toEqual(['1', '♭3', '♭5', '♭♭7'])
    expect(e.notes[3]).toBe('Bbb')
  })

  it('todo el catálogo tiene descripción y uso', () => {
    for (const e of [...SCALES, ...ARPEGGIOS]) {
      expect(e.summary, e.id).toBeTruthy()
      expect(e.usage, e.id).toBeTruthy()
    }
  })

  it('lanza si no está en el catálogo', () => {
    expect(() => describeEntry('scale', 'lydian', 'C')).toThrow()
  })
})

describe('ascendingMidis', () => {
  it('A pentatónica menor desde A1 (33) hasta la octava', () => {
    const e = describeEntry('scale', 'minor pentatonic', 'A')
    expect(ascendingMidis(e)).toEqual([33, 36, 38, 40, 43, 45])
  })

  it('la fundamental no baja de E1: C empieza en C2 (36), E en E1 (28)', () => {
    expect(ascendingMidis(describeEntry('arpeggio', 'M', 'C'))[0]).toBe(36)
    expect(ascendingMidis(describeEntry('arpeggio', 'M', 'E'))[0]).toBe(28)
    expect(ascendingMidis(describeEntry('arpeggio', 'M', 'Eb'))[0]).toBe(39)
  })

  it('con B0 como límite (5 cuerdas), C empieza en C1', () => {
    expect(ascendingMidis(describeEntry('arpeggio', 'M', 'C'), 'B0')[0]).toBe(24)
  })
})

describe('stepName', () => {
  it('nombres en español', () => {
    expect([1, 2, 3, 4].map(stepName)).toEqual(['S', 'T', '1½T', '4S'])
  })
})
