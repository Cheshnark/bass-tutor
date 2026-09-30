import { create } from 'zustand'
import { defaultAccents, nextAccent, resizeAccents, type AccentLevel } from '../audio/accents'
import { clampBpm } from '../audio/beatClock'
import { Metronome } from '../audio/metronome'
import type { LadderConfig } from '../audio/tempoLadder'

const INITIAL = { bpm: 80, beatsPerBar: 4, subdivision: 1, accents: defaultAccents(4) }

/**
 * Motor único del metrónomo para toda la app: lo controlan el panel y los `<Metronome/>`
 * incrustados en las lecciones. El AudioContext no existe hasta el primer `start()`.
 */
export const metronomeEngine = new Metronome(INITIAL)

export interface MetronomeStore {
  bpm: number
  beatsPerBar: number
  subdivision: number
  accents: AccentLevel[]
  volume: number
  running: boolean
  /** Con la escalera activa, el tempo lo decide el motor y la UI solo lo refleja. */
  ladderActive: boolean
  /** Cambio de tempo del usuario (se ignora con la escalera activa). */
  setBpm: (bpm: number) => void
  /** Refleja en la UI el tempo que ya lleva el motor (escalera), sin reenviárselo. */
  syncBpm: (bpm: number) => void
  setBeatsPerBar: (n: number) => void
  setSubdivision: (n: number) => void
  cycleAccent: (beat: number) => void
  setVolume: (volume: number) => void
  start: () => Promise<void>
  stop: () => void
  /** Activa (o quita, con null) la escalera. El tempo pasa al inicio de la escalera. */
  setLadder: (config: LadderConfig | null) => void
  /** Pase limpio: devuelve el nuevo BPM o null si ya estaba en el objetivo. */
  pass: () => number | null
}

export const useMetronome = create<MetronomeStore>()((set, get) => ({
  ...INITIAL,
  volume: 0.8,
  running: false,
  ladderActive: false,

  setBpm: (value) => {
    if (get().ladderActive || !Number.isFinite(value)) return
    const bpm = clampBpm(Math.round(value))
    metronomeEngine.update({ bpm })
    set({ bpm })
  },
  syncBpm: (bpm) => set({ bpm }),
  setBeatsPerBar: (beatsPerBar) => {
    const accents = resizeAccents(get().accents, beatsPerBar)
    metronomeEngine.update({ beatsPerBar, accents })
    set({ beatsPerBar, accents })
  },
  setSubdivision: (subdivision) => {
    metronomeEngine.update({ subdivision })
    set({ subdivision })
  },
  cycleAccent: (beat) => {
    const accents = get().accents.map((level, i) => (i === beat ? nextAccent(level) : level))
    metronomeEngine.update({ accents })
    set({ accents })
  },
  setVolume: (volume) => {
    metronomeEngine.setVolume(volume)
    set({ volume })
  },
  start: async () => {
    await metronomeEngine.start()
    set({ running: true })
  },
  stop: () => {
    metronomeEngine.stop()
    set({ running: false })
  },
  setLadder: (config) => {
    metronomeEngine.setLadder(config)
    set(config ? { ladderActive: true, bpm: config.start } : { ladderActive: false })
  },
  pass: () => {
    const bpm = metronomeEngine.pass()
    if (bpm !== null) set({ bpm })
    return bpm
  },
}))
