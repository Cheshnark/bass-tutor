import { create } from 'zustand'
import type { Notation } from '../theory/notation'
import { DEFAULT_TUNING_ID } from '../theory/tunings'

/** "follow": un paso por pantalla (siguiendo la clase); "full": la lección entera con scroll. */
export type LessonMode = 'follow' | 'full'

/**
 * Ajustes globales (modelo `Settings` de docs/research.md §7).
 * Sin persistencia todavía: en la Fase 3 se guardarán en IndexedDB.
 */
export interface SettingsState {
  tuningId: string
  leftHanded: boolean
  notation: Notation
  lessonMode: LessonMode
  setTuningId: (id: string) => void
  setLeftHanded: (value: boolean) => void
  setNotation: (notation: Notation) => void
  setLessonMode: (mode: LessonMode) => void
}

export const useSettings = create<SettingsState>()((set) => ({
  tuningId: DEFAULT_TUNING_ID,
  leftHanded: false,
  notation: 'anglo',
  lessonMode: 'follow',
  setTuningId: (tuningId) => set({ tuningId }),
  setLeftHanded: (leftHanded) => set({ leftHanded }),
  setNotation: (notation) => set({ notation }),
  setLessonMode: (lessonMode) => set({ lessonMode }),
}))
