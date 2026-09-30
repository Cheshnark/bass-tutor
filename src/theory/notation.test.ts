import { describe, expect, it } from 'vitest'
import { degreeFromInterval, formatInterval, formatNote } from './notation'

describe('formatNote', () => {
  it('anglosajona con alteraciones tipográficas', () => {
    expect(formatNote('Bb2', 'anglo')).toBe('B♭')
    expect(formatNote('F#', 'anglo')).toBe('F♯')
    expect(formatNote('E1', 'anglo', true)).toBe('E1')
  })

  it('latina', () => {
    expect(formatNote('C', 'latina')).toBe('Do')
    expect(formatNote('G#1', 'latina')).toBe('Sol♯')
    expect(formatNote('Bb', 'latina')).toBe('Si♭')
    expect(formatNote('B0', 'latina', true)).toBe('Si0')
  })

  it('devuelve el texto tal cual si no es una nota', () => {
    expect(formatNote('xyz', 'anglo')).toBe('xyz')
  })
})

describe('degreeFromInterval', () => {
  it.each([
    ['1P', '1'],
    ['2M', '2'],
    ['3m', '♭3'],
    ['3M', '3'],
    ['4P', '4'],
    ['4A', '♯4'],
    ['5d', '♭5'],
    ['5P', '5'],
    ['5A', '♯5'],
    ['6m', '♭6'],
    ['7m', '♭7'],
    ['7d', '♭♭7'],
    ['7M', '7'],
    ['8P', '1'],
    ['9M', '2'],
  ])('%s → %s', (interval, degree) => {
    expect(degreeFromInterval(interval)).toBe(degree)
  })
})

describe('formatInterval', () => {
  it('justa = J', () => {
    expect(formatInterval('5P')).toBe('5J')
    expect(formatInterval('3m')).toBe('3m')
  })
})
