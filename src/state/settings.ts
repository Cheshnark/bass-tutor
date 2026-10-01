import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Notation } from '../theory/notation'
import { DEFAULT_TUNING_ID, TUNINGS } from '../theory/tunings'

/** "follow": un paso por pantalla (siguiendo la clase); "full": la lección entera con scroll. */
export type LessonMode = 'follow' | 'full'

/** "auto": alto contraste si el sistema lo pide (prefers-contrast: more); si no, el tema cabezal. */
export type ThemeChoice = 'auto' | 'cabezal' | 'alto-contraste'
export const THEME_CHOICES: readonly ThemeChoice[] = ['auto', 'cabezal', 'alto-contraste']

/**
 * Ajustes globales (modelo `Settings` de docs/research.md §7). Se recuerdan en localStorage
 * (research.md §5.2: localStorage solo para ajustes; el progreso va en IndexedDB).
 */
export interface SettingsState {
  tuningId: string
  leftHanded: boolean
  notation: Notation
  lessonMode: LessonMode
  theme: ThemeChoice
  /** Modo atril: sin cabecera ni navegación, texto grande, todo el ancho para la lección. */
  standMode: boolean
  setTuningId: (id: string) => void
  setLeftHanded: (value: boolean) => void
  setNotation: (notation: Notation) => void
  setLessonMode: (mode: LessonMode) => void
  setTheme: (theme: ThemeChoice) => void
  setStandMode: (value: boolean) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      tuningId: DEFAULT_TUNING_ID,
      leftHanded: false,
      notation: 'anglo',
      lessonMode: 'follow',
      theme: 'auto',
      standMode: false,
      setTuningId: (tuningId) => set({ tuningId }),
      setLeftHanded: (leftHanded) => set({ leftHanded }),
      setNotation: (notation) => set({ notation }),
      setLessonMode: (lessonMode) => set({ lessonMode }),
      setTheme: (theme) => set({ theme }),
      setStandMode: (standMode) => set({ standMode }),
    }),
    {
      name: 'bass-tutor:settings',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ tuningId, leftHanded, notation, lessonMode, theme, standMode }) => ({
        tuningId,
        leftHanded,
        notation,
        lessonMode,
        theme,
        standMode,
      }),
      // Si lo guardado ya no es válido (p. ej., una afinación que ya no existe), se usa el valor por defecto.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SettingsState>
        return {
          ...current,
          tuningId: TUNINGS.some((t) => t.id === saved.tuningId) ? (saved.tuningId as string) : current.tuningId,
          leftHanded: typeof saved.leftHanded === 'boolean' ? saved.leftHanded : current.leftHanded,
          notation: saved.notation === 'latina' || saved.notation === 'anglo' ? saved.notation : current.notation,
          lessonMode: saved.lessonMode === 'full' || saved.lessonMode === 'follow' ? saved.lessonMode : current.lessonMode,
          theme: THEME_CHOICES.includes(saved.theme as ThemeChoice) ? (saved.theme as ThemeChoice) : current.theme,
          standMode: typeof saved.standMode === 'boolean' ? saved.standMode : current.standMode,
        }
      },
    },
  ),
)
