import { LessonExercise, LessonFretboard, LessonMetronome, LessonTab } from './embeds'

/** Mapa nombre → componente para `<MDXContent components={…} />` (mismos nombres que EMBED_SCHEMAS). */
export const lessonComponents = {
  Fretboard: LessonFretboard,
  Tab: LessonTab,
  Exercise: LessonExercise,
  Metronome: LessonMetronome,
}
