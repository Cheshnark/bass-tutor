import * as alphaTab from '@coderline/alphatab'
import { describe, expect, it } from 'vitest'
import { barChords, backingTracks, chordsFitBar, hasAccompaniment, withBacking, type BackingSpec } from './backing'
import { closeVoicing } from '../theory/voicing'

const BS = '\\'
const bass = (ts: string, bars: number, note = '3.4') => {
  const [beats, unit] = ts.split('/').map(Number)
  const bar = `:${unit} ${Array.from({ length: beats }, () => note).join(' ')}`
  return [
    `${BS}track "Bajo" { instrument "Electric Bass Finger" }`,
    `${BS}staff { score tabs }`,
    `${BS}tuning (G2 D2 A1 E1)`,
    `${BS}clef bass`,
    `${BS}ts (${beats} ${unit})`,
    Array.from({ length: bars }, () => bar).join(' | '),
  ].join('\n')
}

/** Parsea con alphaTab y devuelve, por pista, la duración de cada compás en ticks (960 por negra). */
function barTicks(tex: string) {
  const score = alphaTab.importer.ScoreLoader.loadAlphaTex(tex)
  return score.tracks.map((t) => ({
    name: t.name,
    program: t.playbackInfo.program,
    percussion: t.isPercussion,
    ticks: t.staves[0].bars.map((b) => b.voices[0].beats.reduce((s, x) => s + x.playbackDuration, 0)),
  }))
}

describe('withBacking', () => {
  const spec = (timeSignature: string, harmony: string[], feel: BackingSpec['feel'] = 'straight') => ({ timeSignature, harmony, feel })

  for (const [ts, ticksPerBar] of [
    ['4/4', 3840],
    ['3/4', 2880],
    ['6/8', 2880],
    ['12/8', 5760],
  ] as const) {
    it(`${ts}: batería y acordes con los mismos compases que el bajo, todos completos`, () => {
      const harmony = ['G', 'C', 'D', 'G']
      const tracks = barTicks(withBacking(bass(ts, 4), spec(ts, harmony)))
      expect(tracks.map((t) => t.name)).toEqual(['Bajo', 'Batería', 'Acordes'])
      expect(tracks[1].percussion).toBe(true)
      expect(tracks[2].program).toBe(4) // Electric Piano 1
      for (const t of tracks) expect(t.ticks).toEqual([ticksPerBar, ticksPerBar, ticksPerBar, ticksPerBar])
    })
  }

  it('con shuffle, la batería va en tresillos y el compás sigue completo', () => {
    const tex = withBacking(bass('4/4', 2), spec('4/4', ['F7', 'F7'], 'shuffle'))
    expect(tex).toContain('{tu 3}')
    for (const t of barTicks(tex)) expect(t.ticks).toEqual([3840, 3840])
  })

  it('dos acordes en un compás de 4/4: dos pulsos cada uno y el compás completo', () => {
    const tex = withBacking(bass('4/4', 2), spec('4/4', ['Cm7 F7', 'Bb7']))
    for (const t of barTicks(tex)) expect(t.ticks).toEqual([3840, 3840])
    const chordsBar = backingTracks(spec('4/4', ['Cm7 F7', 'Bb7'])).split('\n').find((l) => l.startsWith(':4 (C'))
    const cm7 = closeVoicing('Cm7').join(' ')
    const f7 = closeVoicing('F7').join(' ')
    expect(chordsBar).toBe(`:4 (${cm7}) (${cm7}) (${f7}) (${f7}) |`)
  })

  it('los acordes suenan en la disposición de voicing.ts', () => {
    expect(backingTracks(spec('4/4', ['G', 'E5']))).toContain('(G3 B3 D4)')
    expect(backingTracks(spec('4/4', ['G', 'E5']))).toContain('(E3 B3)')
  })

  it('sin armonía, o si ya trae acompañamiento, no cambia nada', () => {
    const plain = bass('4/4', 2)
    expect(withBacking(plain, { timeSignature: '4/4' })).toBe(plain)
    const band = withBacking(plain, spec('4/4', ['G', 'G']))
    expect(hasAccompaniment(plain)).toBe(false)
    expect(hasAccompaniment(band)).toBe(true)
    expect(withBacking(band, spec('4/4', ['C', 'C']))).toBe(band)
  })
})

describe('varios acordes por compás', () => {
  it('barChords separa por espacios', () => {
    expect(barChords('F7')).toEqual(['F7'])
    expect(barChords(' Cm7   F7 ')).toEqual(['Cm7', 'F7'])
  })

  it('chordsFitBar: uno siempre; varios solo si reparten los pulsos de un compás de negra', () => {
    expect(chordsFitBar(1, '6/8')).toBe(true)
    expect(chordsFitBar(2, '4/4')).toBe(true)
    expect(chordsFitBar(4, '4/4')).toBe(true)
    expect(chordsFitBar(3, '4/4')).toBe(false)
    expect(chordsFitBar(2, '3/4')).toBe(false)
    expect(chordsFitBar(2, '6/8')).toBe(false)
  })
})
