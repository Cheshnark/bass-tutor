import { Dictionary } from './components/Dictionary/Dictionary'
import { FretboardExplorer } from './components/FretboardExplorer'
import { CourseIndex } from './components/Lesson/CourseIndex'
import { LessonView } from './components/Lesson/LessonView'
import { MetronomePanel } from './components/Metronome/MetronomePanel'
import { SettingsBar } from './components/SettingsBar'
import { useHashRoute } from './useHashRoute'

const VIEWS = [
  { id: 'curso', label: 'Curso' },
  { id: 'mastil', label: 'Mástil' },
  { id: 'diccionario', label: 'Diccionario' },
  { id: 'metronomo', label: 'Metrónomo' },
] as const

type ViewId = (typeof VIEWS)[number]['id']
const VIEW_IDS: readonly ViewId[] = VIEWS.map((v) => v.id)

function App() {
  const { view, param } = useHashRoute<ViewId>(VIEW_IDS, 'curso')

  return (
    <>
      <header className="app-header">
        <h1>Bass Tutor</h1>
        <nav className="app-nav" aria-label="Herramientas">
          {VIEWS.map((v) => (
            <a key={v.id} href={`#/${v.id}`} aria-current={view === v.id ? 'page' : undefined}>
              {v.label}
            </a>
          ))}
        </nav>
      </header>
      <main className="app-main">
        {view === 'curso' && (param ? <LessonView key={param} lessonId={param} /> : <CourseIndex />)}
        {(view === 'mastil' || view === 'diccionario') && <SettingsBar />}
        {view === 'mastil' && <FretboardExplorer />}
        {view === 'diccionario' && <Dictionary />}
        {/* Siempre montado: el metrónomo sigue sonando mientras navegas por otras vistas. */}
        <div hidden={view !== 'metronomo'}>
          <MetronomePanel />
        </div>
      </main>
    </>
  )
}

export default App
