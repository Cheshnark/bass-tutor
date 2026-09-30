import { MetronomePoc } from './components/MetronomePoc'
import { TabPoc } from './components/TabPoc'
import exerciseTex from './content/exercises/fundamental-quinta.atex?raw'

function App() {
  return (
    <>
      <header className="app-header">
        <h1>Bass Tutor</h1>
        <p className="subtitle">Fase 0 · pruebas de concepto</p>
      </header>
      <main className="app-main">
        <MetronomePoc />
        <TabPoc tex={exerciseTex} />
      </main>
    </>
  )
}

export default App
