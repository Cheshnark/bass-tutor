import { useEffect, useState, type ComponentType } from 'react'
import type { MDXProps } from 'mdx/types'
import { course, getLesson, neighbours } from '../../content/course'
import { lessonComponents } from './lessonComponents'
import './Lesson.css'

type MdxModule = { default: ComponentType<MDXProps> }

// Un chunk por lección: solo se descarga la que se abre.
const lessonLoaders = import.meta.glob<MdxModule>('../../content/modules/*/*.mdx')

function loaderFor(mdxPath: string) {
  return lessonLoaders[`../../content/${mdxPath}`]
}

const LEVEL: Record<string, string> = { principiante: 'Principiante', intermedio: 'Intermedio' }

export function LessonView({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId)
  const [loaded, setLoaded] = useState<{ id: string; Body: ComponentType<MDXProps> } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = lesson ? loaderFor(lesson.mdxPath) : undefined

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
  const { previous, next } = neighbours(lesson.id)
  const Body = loaded?.id === lesson.id ? loaded.Body : null
  const problem = load ? error : `No se encuentra ${lesson.mdxPath}`

  return (
    <article className="panel lesson" aria-labelledby="lesson-title">
      <header className="lesson-header">
        <p className="lesson-kicker">
          <a href="#/curso">Curso</a> · Módulo {module?.order} · {module?.title}
        </p>
        <h2 id="lesson-title">{lesson.title}</h2>
        <p className="lesson-meta">
          {LEVEL[lesson.level]} · {lesson.durationMin} min · {lesson.steps.length} pasos
          {lesson.status === 'borrador' && <span className="badge">Borrador</span>}
        </p>
        <div className="lesson-objectives">
          <h3>Al terminar sabrás</h3>
          <ul>
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </header>

      <div className="lesson-body" data-testid="lesson-body">
        {problem && (
          <p role="alert" className="error">
            No se pudo cargar la lección: {problem}
          </p>
        )}
        {!problem && !Body && <p className="hint">Cargando lección…</p>}
        {Body && <Body components={lessonComponents} />}
      </div>

      <nav className="lesson-nav" aria-label="Lecciones">
        {previous ? <a href={`#/curso/${previous.id}`}>← {previous.title}</a> : <span />}
        {next ? <a href={`#/curso/${next.id}`}>{next.title} →</a> : <span />}
      </nav>
    </article>
  )
}
