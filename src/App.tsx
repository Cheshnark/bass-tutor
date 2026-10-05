import { useEffect } from 'react'
import { APP_NAME, documentTitle } from './brand'
import { Dictionary } from './components/Dictionary/Dictionary'
import { FretboardExplorer } from './components/FretboardExplorer'
import { HeaderPilot } from './components/HeaderPilot'
import { CourseIndex } from './components/Lesson/CourseIndex'
import { LessonView } from './components/Lesson/LessonView'
import { MetronomePanel } from './components/Metronome/MetronomePanel'
import { PracticeView } from './components/Practice/PracticeView'
import { Tuner } from './components/Tuner/Tuner'
import { SettingsBar } from './components/SettingsBar'
import { SettingsView } from './components/SettingsView'
import { UpdatePrompt } from './components/UpdatePrompt'
import { useSettings } from './state/settings'
import { useAppearance } from './useAppearance'
import { useHashRoute } from './useHashRoute'

const VIEWS = [
  { id: 'curso', label: 'Curso' },
  { id: 'practica', label: 'Práctica' },
  { id: 'mastil', label: 'Mástil' },
  { id: 'diccionario', label: 'Diccionario' },
  { id: 'metronomo', label: 'Metrónomo' },
  { id: 'afinador', label: 'Afinador' },
] as const

type ViewId = (typeof VIEWS)[number]['id'] | 'ajustes'
/** Título de la pestaña por vista. Las lecciones ponen el suyo (LessonView). */
const VIEW_TITLES: Record<ViewId, string> = {
  ...(Object.fromEntries(VIEWS.map((v) => [v.id, v.label])) as Record<(typeof VIEWS)[number]['id'], string>),
  ajustes: 'Ajustes',
}
/** "ajustes" no es una pestaña: se llega desde el botón de la cabecera. */
const VIEW_IDS: readonly ViewId[] = [...VIEWS.map((v) => v.id), 'ajustes']

function App() {
  const { view, params } = useHashRoute<ViewId>(VIEW_IDS, 'curso')
  const [lessonId, step] = params
  const { standMode } = useAppearance()
  const setStandMode = useSettings((s) => s.setStandMode)
  const inLesson = view === 'curso' && Boolean(lessonId)

  useEffect(() => {
    if (!inLesson) document.title = documentTitle(VIEW_TITLES[view])
  }, [view, inLesson])

  return (
    <>
      {standMode ? (
        // Modo atril: solo una barra mínima para volver y salir; el resto de la pantalla, para la lección.
        <header className="stand-bar">
          <a href="#/curso">Curso</a>
          <HeaderPilot />
          <button type="button" className="btn" onClick={() => setStandMode(false)}>
            Salir del atril
          </button>
        </header>
      ) : (
        <>
          <header className="app-header">
            <div className="app-header__top">
              {/* Logotipo: el nombre con cuatro cuerdas debajo. No es el h1: cada vista tiene el suyo en su rótulo. */}
              <a className="brand" href="#/curso">
                <span className="brand__name">{APP_NAME}</span>
                <span className="brand__strings" aria-hidden="true" />
              </a>
              <HeaderPilot />
              <a className="header-settings" href="#/ajustes" aria-current={view === 'ajustes' ? 'page' : undefined}>
                Ajustes
              </a>
            </div>
            <nav className="app-nav" aria-label="Herramientas">
              {VIEWS.map((v) => (
                <a key={v.id} href={`#/${v.id}`} aria-current={view === v.id ? 'page' : undefined}>
                  {v.label}
                </a>
              ))}
            </nav>
          </header>
          {/* Rejilla de altavoz: solo decoración, nunca detrás de texto. */}
          <div className="grill" aria-hidden="true" />
        </>
      )}
      <main className="app-main">
        <UpdatePrompt />
        {view === 'curso' &&
          (lessonId ? <LessonView key={lessonId} lessonId={lessonId} stepParam={step} /> : <CourseIndex />)}
        {view === 'practica' && <PracticeView params={params} />}
        {(view === 'mastil' || view === 'diccionario') && <SettingsBar />}
        {view === 'mastil' && <FretboardExplorer />}
        {view === 'diccionario' && <Dictionary />}
        {view === 'afinador' && <Tuner />}
        {view === 'ajustes' && <SettingsView />}
        {/* Siempre montado: el metrónomo sigue sonando mientras navegas por otras vistas. */}
        <div hidden={view !== 'metronomo'}>
          <MetronomePanel />
        </div>
      </main>
    </>
  )
}

export default App
