import { useState, type ReactNode } from 'react'
import { lessonsOf, moduleNumber, modulesOf } from '../../content/course'
import type { Module } from '../../content/schema'
import { getTrack, STYLE_TRACKS, TRACK_IDS, type TrackId } from '../../content/tracks'
import { PracticeReminder } from '../Practice/PracticeReminder'
import { PanelTitle } from '../PanelTitle'
import { readStoredObject, writeStored } from '../../storage'
import { useLessonsProgress } from '../../state/progress/hooks'
import type { LessonProgress } from '../../state/progress/model'
import { ProgressPanel } from './ProgressPanel'
import './Lesson.css'

interface ModuleBlockProps {
  module: Module
  progress: ReadonlyMap<string, LessonProgress>
  /** h3 en los bloques comunes; h4 dentro de un itinerario por estilo, que ya va bajo un h3. */
  headingLevel: 3 | 4
}

function ModuleBlock({ module, progress, headingLevel }: ModuleBlockProps) {
  const lessons = lessonsOf(module)
  const Heading = headingLevel === 3 ? 'h3' : 'h4'
  const done = lessons.filter((l) => progress.get(l.id)?.completedAt).length

  return (
    <section className="course-module" aria-labelledby={`module-${module.id}`}>
      <Heading id={`module-${module.id}`} className="course-module__heading">
        <span className="course-module__number">{moduleNumber(module)}</span> {module.title}
        <span className="course-module__done" aria-label={`${done} de ${lessons.length} lecciones completadas`}>
          {done}/{lessons.length}
        </span>
      </Heading>
      <p className="hint">{module.summary}</p>
      <ol className="course-lessons">
        {lessons.map((lesson) => {
          const p = progress.get(lesson.id)
          const completed = Boolean(p?.completedAt)
          // Si la empezaste y no la has completado, el enlace te lleva al paso donde lo dejaste.
          const resumeStep = !completed && p && p.lastStep > 0 ? p.lastStep + 1 : null
          return (
            <li key={lesson.id} className={completed ? 'is-done' : resumeStep ? 'is-current' : undefined}>
              <a href={`#/curso/${lesson.id}${resumeStep ? `/${resumeStep}` : ''}`}>
                <span className="course-lessons__title">
                  {completed && (
                    <span className="course-lessons__check" aria-label="Completada">
                      ✓
                    </span>
                  )}
                  {lesson.title}
                </span>
                <span className="course-lessons__meta">
                  {resumeStep ? (
                    // La lección por la que vas: lo único "encendido" (ámbar) del índice.
                    <span className="course-lessons__resume">
                      <span className="pilot pilot--on pilot--sm" aria-hidden="true" />
                      Sigue en el paso {resumeStep}
                    </span>
                  ) : (
                    `${lesson.durationMin} min`
                  )}
                  {lesson.status === 'borrador' && <span className="badge">Borrador</span>}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

const STORAGE_OPEN = 'bass-tutor.course.open'

/** Qué bloques dejó el alumno abiertos o cerrados (id → abierto). Sin almacenamiento, se usan los valores por defecto. */
function readOpen(): Record<string, boolean> {
  return (readStoredObject(STORAGE_OPEN) as Record<string, boolean> | null) ?? {}
}

function writeOpen(open: Record<string, boolean>) {
  writeStored(STORAGE_OPEN, JSON.stringify(open))
}

interface TrackStats {
  done: number
  total: number
  /** Alguna lección empezada o completada, pero no todas. */
  inProgress: boolean
}

function statsOf(modules: readonly Module[], progress: ReadonlyMap<string, LessonProgress>): TrackStats {
  const lessons = modules.flatMap((m) => lessonsOf(m))
  const done = lessons.filter((l) => progress.get(l.id)?.completedAt).length
  const started = lessons.some((l) => {
    const p = progress.get(l.id)
    return Boolean(p?.completedAt) || (p?.lastStep ?? 0) > 0
  })
  return { done, total: lessons.length, inProgress: started && done < lessons.length }
}

interface AccordionProps {
  id: string
  label: string
  summary: string
  headingLevel: 2 | 3
  stats: TrackStats
  open: boolean
  onToggle: () => void
  children: ReactNode
}

/** Bloque plegable (patrón de acordeón de WAI-ARIA): el botón va dentro del encabezado. */
function Accordion({ id, label, summary, headingLevel, stats, open, onToggle, children }: AccordionProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <>
      <Heading id={`track-${id}`} className="course-accordion__heading">
        <button type="button" className="course-accordion__button" aria-expanded={open} aria-controls={`panel-${id}`} onClick={onToggle}>
          <span className="course-accordion__chevron" aria-hidden="true" />
          <span className="course-accordion__label">{label}</span>
          <span className="course-module__done" aria-label={`${stats.done} de ${stats.total} lecciones completadas`}>
            {stats.done}/{stats.total}
          </span>
        </button>
      </Heading>
      <p className="hint">{summary}</p>
      <div id={`panel-${id}`} className="course-accordion__panel" hidden={!open}>
        {children}
      </div>
    </>
  )
}

/** Índice del curso: tronco común, itinerarios por estilo y tu progreso. */
export function CourseIndex() {
  const common = getTrack('comun')
  const commonModules = modulesOf(common.id)
  const extra = getTrack('ampliacion')
  const extraModules = modulesOf(extra.id)
  const progress = useLessonsProgress()
  const [stored, setStored] = useState(readOpen)

  // Por defecto se abre lo que tienes a medias; si no hay nada empezado, el tronco común.
  const trackIds = TRACK_IDS
  const stats = new Map(trackIds.map((id) => [id, statsOf(modulesOf(id), progress)]))
  const anyInProgress = trackIds.some((id) => stats.get(id)!.inProgress)
  const isOpen = (id: TrackId) => stored[id] ?? (anyInProgress ? stats.get(id)!.inProgress : id === 'comun')
  const toggle = (id: TrackId) => {
    const next = { ...stored, [id]: !isOpen(id) }
    setStored(next)
    writeOpen(next)
  }

  return (
    <section className="panel course" aria-labelledby="course-title">
      <PanelTitle id="course-title">Curso</PanelTitle>
      <PracticeReminder />

      <section className="course-track" data-track="comun" aria-labelledby="track-comun">
        <Accordion
          id="comun"
          label={common.label}
          summary={common.summary}
          headingLevel={2}
          stats={stats.get('comun')!}
          open={isOpen('comun')}
          onToggle={() => toggle('comun')}
        >
          {commonModules.length === 0 && <p className="hint">Todavía no hay lecciones.</p>}
          {commonModules.map((m) => (
            <ModuleBlock key={m.id} module={m} progress={progress} headingLevel={3} />
          ))}
        </Accordion>
      </section>

      {extraModules.length > 0 && (
        <section className="course-track" data-track="ampliacion" aria-labelledby="track-ampliacion">
          <Accordion
            id="ampliacion"
            label={extra.label}
            summary={extra.summary}
            headingLevel={2}
            stats={stats.get('ampliacion')!}
            open={isOpen('ampliacion')}
            onToggle={() => toggle('ampliacion')}
          >
            {extraModules.map((m) => (
              <ModuleBlock key={m.id} module={m} progress={progress} headingLevel={3} />
            ))}
          </Accordion>
        </section>
      )}

      <section className="course-track" aria-labelledby="track-styles">
        <h2 id="track-styles">Itinerarios por estilo</h2>
        <p className="hint">Cuando termines el tronco común, elige uno (o varios).</p>
        {STYLE_TRACKS.map((track) => {
          const modules = modulesOf(track.id)
          return (
            <section key={track.id} className="course-style" data-track={track.id} aria-labelledby={`track-${track.id}`}>
              {modules.length === 0 ? (
                <>
                  <h3 id={`track-${track.id}`}>
                    {track.label}
                    <span className="badge badge--muted">En preparación</span>
                  </h3>
                  <p className="hint">{track.summary}</p>
                </>
              ) : (
                <Accordion
                  id={track.id}
                  label={track.label}
                  summary={track.summary}
                  headingLevel={3}
                  stats={stats.get(track.id)!}
                  open={isOpen(track.id)}
                  onToggle={() => toggle(track.id)}
                >
                  {modules.map((m) => (
                    <ModuleBlock key={m.id} module={m} progress={progress} headingLevel={4} />
                  ))}
                </Accordion>
              )}
            </section>
          )
        })}
      </section>

      <ProgressPanel />
    </section>
  )
}
