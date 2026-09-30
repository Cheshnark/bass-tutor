import { Dictionary } from './components/Dictionary/Dictionary'
import { FretboardExplorer } from './components/FretboardExplorer'
import { MetronomePanel } from './components/Metronome/MetronomePanel'
import { SettingsBar } from './components/SettingsBar'
import { TabPoc } from './components/TabPoc'
import exerciseTex from './content/exercises/fundamental-quinta.atex?raw'
import { useHashRoute } from './useHashRoute'

const VIEWS = [
  { id: 'mastil', label: 'Mástil' },
  { id: 'diccionario', label: 'Diccionario' },
  { id: 'metronomo', label: 'Metrónomo' },
  { id: 'tablatura', label: 'Tablatura' },
] as const

type ViewId = (typeof VIEWS)[number]['id']
const VIEW_IDS: readonly ViewId[] = VIEWS.map((v) => v.id)

function App() {
  const view = useHashRoute<ViewId>(VIEW_IDS, 'mastil')

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
        {(view === 'mastil' || view === 'diccionario') && <SettingsBar />}
        {view === 'mastil' && <FretboardExplorer />}
        {view === 'diccionario' && <Dictionary />}
        {/* Siempre montado: el metrónomo sigue sonando mientras navegas por otras vistas. */}
        <div hidden={view !== 'metronomo'}>
          <MetronomePanel />
        </div>
        {view === 'tablatura' && <TabPoc tex={exerciseTex} />}
      </main>
    </>
  )
}

export default App
