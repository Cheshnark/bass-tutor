// Módulos generados por scripts/vite-plugin-course.ts. Úsalos a través de src/content/course.ts (tipado).
declare module 'virtual:course' {
  const data: unknown
  export default data
}

declare module 'virtual:course-detail' {
  /** id de ejercicio → su alphaTex, instrucciones y criterios (ver `ExerciseDetail`). */
  const detail: Record<string, { alphaTex: string; instructions: string; passCriteria: string[] }>
  export default detail
}
