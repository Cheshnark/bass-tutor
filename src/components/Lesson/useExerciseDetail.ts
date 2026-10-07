import { useEffect, useState } from 'react'
import { loadExerciseDetail } from '../../content/course'
import type { ExerciseDetail } from '../../content/schema'

/**
 * Instrucciones, criterios y alphaTex de un ejercicio. No van en el chunk de arranque: se piden al abrirlo
 * (una vez por sesión, el chunk es el mismo para todos). `undefined` mientras carga; `'error'` si falla.
 */
export function useExerciseDetail(id: string): ExerciseDetail | 'error' | undefined {
  const [state, setState] = useState<{ id: string; detail: ExerciseDetail | 'error' } | null>(null)

  useEffect(() => {
    let cancelled = false
    loadExerciseDetail(id).then(
      (detail) => !cancelled && setState({ id, detail }),
      () => !cancelled && setState({ id, detail: 'error' }),
    )
    return () => {
      cancelled = true
    }
  }, [id])

  // Si el id cambia con el componente montado, no se muestra el detalle del anterior.
  return state?.id === id ? state.detail : undefined
}
