import { describe, expect, it } from 'vitest'
import { closeVoicing } from './voicing'

describe('closeVoicing', () => {
  it('tríadas en posición cerrada desde la octava 3', () => {
    expect(closeVoicing('G')).toEqual(['G3', 'B3', 'D4'])
    expect(closeVoicing('C')).toEqual(['C3', 'E3', 'G3'])
    expect(closeVoicing('Am')).toEqual(['A3', 'C4', 'E4'])
  })

  it('acordes de quinta y cuatriadas', () => {
    expect(closeVoicing('E5')).toEqual(['E3', 'B3'])
    expect(closeVoicing('F7')).toEqual(['F3', 'A3', 'C4', 'Eb4'])
  })

  it('respeta la ortografía de Tonal', () => {
    expect(closeVoicing('C#5')).toEqual(['C#3', 'G#3'])
    expect(closeVoicing('Bb')).toEqual(['Bb3', 'D4', 'F4'])
  })

  it('rechaza cifrados desconocidos', () => {
    expect(() => closeVoicing('Xyz')).toThrow('Acorde desconocido')
  })
})
