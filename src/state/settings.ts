import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Notation } from '../theory/notation'
import { DEFAULT_TUNING_ID, TUNINGS } from '../theory/tunings'

/** "follow": un paso por pantalla (siguiendo la clase); "full": la lección entera con scroll. */
export type LessonMode = 'follow' | 'full'

/**
 * Ajustes globales (modelo `Settings` de docs/research.md §7). Se recuerdan en localStorage
 * (research.md §5.2: localStorage solo para ajustes; el progreso va en IndexedDB).
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

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      tuningId: DEFAULT_TUNING_ID,
      leftHanded: false,
      notation: 'anglo',
      lessonMode: 'follow',
      setTuningId: (tuningId) => set({ tuningId }),
      setLeftHanded: (leftHanded) => set({ leftHanded }),
      setNotation: (notation) => set({ notation }),
      setLessonMode: (lessonMode) => set({ lessonMode }),
    }),
    {
      name: 'bass-tutor:settings',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ tuningId, leftHanded, notation, lessonMode }) => ({ tuningId, leftHanded, notation, lessonMode }),
      // Si lo guardado ya no es válido (p. ej., una afinación que ya no existe), se usa el valor por defecto.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SettingsState>
        return {
          ...current,
          tuningId: TUNINGS.some((t) => t.id === saved.tuningId) ? (saved.tuningId as string) : current.tuningId,
          leftHanded: typeof saved.leftHanded === 'boolean' ? saved.leftHanded : current.leftHanded,
          notation: saved.notation === 'latina' || saved.notation === 'anglo' ? saved.notation : current.notation,
          lessonMode: saved.lessonMode === 'full' || saved.lessonMode === 'follow' ? saved.lessonMode : current.lessonMode,
        }
      },
    },
  ),
)
