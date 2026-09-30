import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
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

type PersistedMetronome = Pick<MetronomeStore, 'bpm' | 'beatsPerBar' | 'subdivision' | 'accents' | 'volume'>

const ACCENT_LEVELS: AccentLevel[] = ['accent', 'normal', 'silent']

/** Valida lo guardado en localStorage: lo que no sea válido vuelve al valor por defecto. */
export function sanitizeMetronome(saved: Partial<PersistedMetronome>, fallback: PersistedMetronome): PersistedMetronome {
  const beats = saved.beatsPerBar
  const beatsPerBar = typeof beats === 'number' && Number.isInteger(beats) && beats >= 1 && beats <= 12 ? beats : fallback.beatsPerBar
  const accents =
    Array.isArray(saved.accents) && saved.accents.every((a) => ACCENT_LEVELS.includes(a))
      ? resizeAccents(saved.accents, beatsPerBar)
      : resizeAccents(fallback.accents, beatsPerBar)
  const { bpm, subdivision, volume } = saved
  return {
    bpm: typeof bpm === 'number' && Number.isFinite(bpm) ? clampBpm(Math.round(bpm)) : fallback.bpm,
    beatsPerBar,
    subdivision: typeof subdivision === 'number' && [1, 2, 3, 4].includes(subdivision) ? subdivision : fallback.subdivision,
    accents,
    volume: typeof volume === 'number' && volume >= 0 && volume <= 1 ? volume : fallback.volume,
  }
}

export const useMetronome = create<MetronomeStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      // Se recuerda la configuración; nunca el estado de marcha ni la escalera.
      name: 'bass-tutor:metronome',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ bpm, beatsPerBar, subdivision, accents, volume }): PersistedMetronome => ({
        bpm,
        beatsPerBar,
        subdivision,
        accents,
        volume,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeMetronome((persisted ?? {}) as Partial<PersistedMetronome>, current),
      }),
      // El motor se creó con los valores iniciales: se le aplica lo recuperado.
      onRehydrateStorage: () => (state) => {
        if (!state) return
        metronomeEngine.update({
          bpm: state.bpm,
          beatsPerBar: state.beatsPerBar,
          subdivision: state.subdivision,
          accents: state.accents,
        })
        metronomeEngine.setVolume(state.volume)
      },
    },
  ),
)
