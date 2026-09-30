import { createContext } from 'react'

export interface LessonStepState {
  /** true = un paso por pantalla; false = la lección completa. */
  follow: boolean
  /** Paso visible (0-based) en modo seguimiento. */
  current: number
}

export const LessonStepContext = createContext<LessonStepState>({ follow: false, current: 0 })
