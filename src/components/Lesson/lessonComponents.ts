import { LessonFretboard, LessonMetronome, LessonTab, LessonVideo } from './embeds'
import { LessonExercise } from './ExerciseCard'
import { LessonStep } from './LessonStep'

/**
 * Mapa nombre → componente para `<MDXContent components={…} />`: los de EMBED_SCHEMAS
 * y `LessonStep`, que no se escribe a mano (lo inserta remarkLessonSteps).
 */
export const lessonComponents = {
  Fretboard: LessonFretboard,
  Tab: LessonTab,
  Exercise: LessonExercise,
  Metronome: LessonMetronome,
  Video: LessonVideo,
  LessonStep,
}
