import { useContext, useEffect, useRef, type ReactNode } from 'react'
import { LessonStepContext } from './lessonStepContext'

/**
 * Envoltorio que inserta remarkLessonSteps alrededor de cada `##` de la lección.
 * En modo "siguiendo la clase" solo se monta el paso actual (alphaTab no maqueta
 * bien dentro de un contenedor oculto, y así cada paso empieza limpio).
 */
export function LessonStep({ index, children }: { index: string; children?: ReactNode }) {
  const { follow, current } = useContext(LessonStepContext)
  const step = Number(index)
  const ref = useRef<HTMLElement>(null)
  const active = follow && step === current

  // Al cambiar de paso, el foco va a su título: lo anuncian los lectores de pantalla.
  useEffect(() => {
    if (!active) return
    const heading = ref.current?.querySelector('h2')
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }, [active])

  if (follow && step !== current) return null
  return (
    <section ref={ref} className="lesson-step" data-step={step}>
      {children}
    </section>
  )
}
