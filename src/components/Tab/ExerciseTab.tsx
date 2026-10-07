import { useEffect, useState, type ComponentProps } from 'react'
import { playableTex } from '../../content/course'
import type { ExerciseMeta } from '../../content/schema'
import { LazyTabView } from './LazyTabView'

type Props = { exercise: ExerciseMeta } & Pick<ComponentProps<typeof LazyTabView>, 'bpm'>

/**
 * Partitura de un ejercicio. El alphaTex no viaja en el chunk de arranque: se descarga aquí, al mostrar la
 * partitura, y se guarda en memoria para las siguientes veces.
 */
export function ExerciseTab({ exercise, bpm }: Props) {
  const [loaded, setLoaded] = useState<{ id: string; tex: string } | 'error' | null>(null)

  useEffect(() => {
    let cancelled = false
    playableTex(exercise).then(
      (tex) => !cancelled && setLoaded({ id: exercise.id, tex }),
      () => !cancelled && setLoaded('error'),
    )
    return () => {
      cancelled = true
    }
  }, [exercise])

  if (loaded === 'error') {
    return (
      <p role="alert" className="error">
        No se ha podido cargar la partitura. Comprueba la conexión y vuelve a abrir el ejercicio.
      </p>
    )
  }
  // `exercise` puede cambiar con el componente montado: no se muestra la partitura del anterior.
  if (loaded === null || loaded.id !== exercise.id) return <p className="hint">Cargando partitura…</p>
  return <LazyTabView tex={loaded.tex} title={exercise.title} bpm={bpm} />
}
