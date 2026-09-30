import { describe, expect, it } from 'vitest'
import { defaultAccents } from '../audio/accents'
import { sanitizeMetronome } from './metronome'

const fallback = { bpm: 80, beatsPerBar: 4, subdivision: 1, accents: defaultAccents(4), volume: 0.8 }

describe('sanitizeMetronome', () => {
  it('conserva una configuración guardada válida', () => {
    const saved = { bpm: 96, beatsPerBar: 3, subdivision: 2, accents: defaultAccents(3), volume: 0.5 }
    expect(sanitizeMetronome(saved, fallback)).toEqual(saved)
  })

  it('corrige valores fuera de rango o de otro tipo', () => {
    expect(
      sanitizeMetronome(
        { bpm: 999, beatsPerBar: 40, subdivision: 7, accents: ['raro' as never], volume: 3 },
        fallback,
      ),
    ).toEqual({ ...fallback, bpm: 300 })
  })

  it('ajusta los acentos al número de pulsos guardado', () => {
    const result = sanitizeMetronome({ beatsPerBar: 6, accents: ['accent', 'silent'] }, fallback)
    expect(result.accents).toEqual(['accent', 'silent', 'normal', 'normal', 'normal', 'normal'])
  })

  it('sin nada guardado, los valores por defecto', () => {
    expect(sanitizeMetronome({}, fallback)).toEqual(fallback)
  })
})
