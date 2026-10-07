import { describe, expect, it } from 'vitest'
import { tunerReading } from './useTuner'

// Cuerdas de un bajo de 4 en afinación estándar: E1, A1, D2, G2.
const OPEN = [28, 33, 38, 43]

describe('tunerReading', () => {
  it('sin frecuencia no hay nota ni cents', () => {
    expect(tunerReading(null, 'auto', OPEN)).toEqual({ midi: null, cents: null })
  })

  it('automático: la nota más cercana', () => {
    const { midi, cents } = tunerReading(110, 'auto', OPEN) // A2
    expect(midi).toBe(45)
    expect(Math.abs(cents!)).toBeLessThan(0.01)
  })

  it('con cuerda elegida: la desviación respecto a esa cuerda', () => {
    // Una E1 afinada (41,2 Hz) tocada como cuerda 0 da ~0 cents, y la nota mostrada es la de la cuerda.
    const { midi, cents } = tunerReading(41.2034, 0, OPEN)
    expect(midi).toBe(28)
    expect(Math.abs(cents!)).toBeLessThan(0.1)
  })

  it('con cuerda elegida, una frecuencia baja da cents negativos', () => {
    const { cents } = tunerReading(40, 0, OPEN)
    expect(cents!).toBeLessThan(0)
  })
})
