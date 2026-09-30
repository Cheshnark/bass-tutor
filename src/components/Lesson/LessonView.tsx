import { useEffect, useMemo, useState, type ComponentType } from 'react'
import type { MDXProps } from 'mdx/types'
import { course, getLesson, neighbours, trackOf } from '../../content/course'
import { getTrack } from '../../content/tracks'
import { useSettings } from '../../state/settings'
import { useWakeLock, type WakeLockStatus } from '../../useWakeLock'
import { lessonComponents } from './lessonComponents'
import { LessonStepContext } from './lessonStepContext'
import './Lesson.css'

type MdxModule = { default: ComponentType<MDXProps> }

// Un chunk por lección: solo se descarga la que se abre.
const lessonLoaders = import.meta.glob<MdxModule>('../../content/modules/*/*.mdx')

function loaderFor(mdxPath: string) {
  return lessonLoaders[`../../content/${mdxPath}`]
}

const LEVEL: Record<string, string> = { principiante: 'Principiante', intermedio: 'Intermedio' }

const WAKE_LOCK_TEXT: Record<WakeLockStatus, string | null> = {
  activo: 'Pantalla siempre encendida',
  'no-disponible': 'Tu navegador no permite mantener la pantalla encendida',
  denegado: 'No se pudo mantener la pantalla encendida',
  inactivo: null,
}

/** Teclas de "siguiente"/"anterior": flechas y AvPág/RePág (lo que envían los pedales de pasar página). */
const NEXT_KEYS = new Set(['ArrowRight', 'PageDown'])
const PREVIOUS_KEYS = new Set(['ArrowLeft', 'PageUp'])

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
}

interface LessonViewProps {
  lessonId: string
  /** Paso de la URL, 1-based (`#/curso/<id>/3`). */
  stepParam?: string
}

export function LessonView({ lessonId, stepParam }: LessonViewProps) {
  const lesson = getLesson(lessonId)
  const { lessonMode, setLessonMode } = useSettings()
  const [loaded, setLoaded] = useState<{ id: string; Body: ComponentType<MDXProps> } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = lesson ? loaderFor(lesson.mdxPath) : undefined
  const follow = lessonMode === 'follow'
  const total = lesson?.steps.length ?? 0
  const requested = Number.parseInt(stepParam ?? '1', 10)
  const current = Number.isFinite(requested) ? Math.min(Math.max(requested - 1, 0), Math.max(total - 1, 0)) : 0
  const wakeLock = useWakeLock(follow && lesson !== undefined)
  const stepState = useMemo(() => ({ follow, current }), [follow, current])

  useEffect(() => {
    if (!lesson || !load) return
    let cancelled = false
    load()
      .then((mod) => {
        if (!cancelled) setLoaded({ id: lesson.id, Body: mod.default })
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(String(e))
      })
    return () => {
      cancelled = true
    }
  }, [lesson, load])

  // Navegación por teclado o pedal en modo seguimiento. El paso se lee del hash en cada pulsación
  // (no del render): dos pulsaciones seguidas de un pedal no deben usar un valor desfasado.
  useEffect(() => {
    if (!follow || !lesson) return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return
      const delta = NEXT_KEYS.has(e.key) ? 1 : PREVIOUS_KEYS.has(e.key) ? -1 : 0
      if (delta === 0) return
      e.preventDefault()
      const fromHash = Number.parseInt(window.location.hash.split('/')[3] ?? '1', 10)
      const now = Number.isFinite(fromHash) ? Math.min(Math.max(fromHash - 1, 0), total - 1) : 0
      const target = now + delta
      if (target < 0 || target >= total) return
      window.location.hash = `#/curso/${lesson.id}/${target + 1}`
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [follow, lesson, total])

  if (!lesson) {
    return (
      <section className="panel">
        <h2>Lección no encontrada</h2>
        <p>
          <a href="#/curso">Volver al curso</a>
        </p>
      </section>
    )
  }

  const module = course.modules.find((m) => m.id === lesson.moduleId)
  const track = trackOf(lesson)
  const { previous, next } = neighbours(lesson.id)
  const Body = loaded?.id === lesson.id ? loaded.Body : null
  const problem = load ? error : `No se encuentra ${lesson.mdxPath}`
  const stepHref = (i: number) => `#/curso/${lesson.id}/${i + 1}`
  const isLast = current === total - 1
  const wakeLockText = follow ? WAKE_LOCK_TEXT[wakeLock] : null

  return (
    <article className={`panel lesson${follow ? ' lesson--follow' : ''}`} aria-labelledby="lesson-title">
      <header className="lesson-header">
        <p className="lesson-kicker">
          <a href="#/curso">Curso</a> · {getTrack(track).label} · Módulo {module?.order} · {module?.title}
        </p>
        <h2 id="lesson-title">{lesson.title}</h2>
        <p className="lesson-meta">
          {LEVEL[lesson.level]} · {lesson.durationMin} min · {total} pasos
          {lesson.status === 'borrador' && <span className="badge">Borrador</span>}
        </p>
        <button
          type="button"
          className="btn lesson-mode"
          aria-pressed={follow}
          onClick={() => setLessonMode(follow ? 'full' : 'follow')}
        >
          {follow ? 'Ver la lección completa' : 'Seguir la clase paso a paso'}
        </button>
        {(!follow || current === 0) && (
          <div className="lesson-objectives">
            <h3>Al terminar sabrás</h3>
            <ul>
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {follow && (
        <nav className="lesson-progress" aria-label="Pasos de la lección">
          <p className="lesson-progress__label" aria-live="polite">
            Paso {current + 1} de {total}
          </p>
          <ol>
            {lesson.steps.map((title, i) => (
              <li key={i}>
                <a
                  href={stepHref(i)}
                  className={i < current ? 'is-done' : undefined}
                  aria-current={i === current ? 'step' : undefined}
                  aria-label={`Paso ${i + 1}: ${title}`}
                  title={title}
                />
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="lesson-body" data-testid="lesson-body">
        {problem && (
          <p role="alert" className="error">
            No se pudo cargar la lección: {problem}
          </p>
        )}
        {!problem && !Body && <p className="hint">Cargando lección…</p>}
        {Body && (
          <LessonStepContext.Provider value={stepState}>
            <Body components={lessonComponents} />
          </LessonStepContext.Provider>
        )}
      </div>

      {follow ? (
        <div className="lesson-stepper">
          {wakeLockText && (
            <p className="lesson-stepper__wake" data-testid="wake-lock">
              {wakeLockText}
            </p>
          )}
          <div className="lesson-stepper__buttons">
            {current > 0 ? (
              <a className="btn" href={stepHref(current - 1)}>
                ← Anterior
              </a>
            ) : (
              <span />
            )}
            {!isLast ? (
              <a className="btn btn--primary" href={stepHref(current + 1)}>
                Siguiente →
              </a>
            ) : next ? (
              <a className="btn btn--primary" href={`#/curso/${next.id}`}>
                Siguiente lección →
              </a>
            ) : (
              <a className="btn btn--primary" href="#/curso">
                {track === 'comun' ? 'Elige tu itinerario →' : 'Volver al curso'}
              </a>
            )}
          </div>
        </div>
      ) : (
        <nav className="lesson-nav" aria-label="Lecciones">
          {previous ? <a href={`#/curso/${previous.id}`}>← {previous.title}</a> : <span />}
          {next ? <a href={`#/curso/${next.id}`}>{next.title} →</a> : <span />}
        </nav>
      )}
    </article>
  )
}
