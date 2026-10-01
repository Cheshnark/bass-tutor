import { describe, expect, it } from 'vitest'
import { playbackSpeedFor, tempoOptions } from './playbackTempo'

describe('tempoOptions', () => {
  it('ofrece fracciones del tempo de la partitura', () => {
    expect(tempoOptions(60)).toEqual([30, 45, 54, 60, 66])
  })

  it('añade el tempo de práctica, sin repetir y en orden', () => {
    expect(tempoOptions(120, 170)).toEqual([60, 90, 108, 120, 132, 170])
    expect(tempoOptions(60, 60)).toEqual([30, 45, 54, 60, 66])
  })
})

describe('playbackSpeedFor', () => {
  it('convierte un tempo en velocidad relativa a la partitura', () => {
    expect(playbackSpeedFor(90, 60)).toBe(1.5)
    expect(playbackSpeedFor(60, 120)).toBe(0.5)
  })
})
