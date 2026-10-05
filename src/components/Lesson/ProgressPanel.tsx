import { useEffect, useRef, useState } from 'react'
import { exportProgress, importProgress } from '../../state/progress/db'
import { parseProgressExport, type ProgressExport } from '../../state/progress/model'

type Stored = 'persistente' | 'puede-borrarse' | 'no-disponible' | null

const STORAGE_TEXT: Record<Exclude<Stored, null>, string> = {
  persistente: 'El navegador no borrará tu progreso aunque falte espacio.',
  'puede-borrarse':
    'El navegador podría borrar tu progreso si le falta espacio (sobre todo en iPhone si no instalas la app). Haz una copia de vez en cuando.',
  'no-disponible': 'Tu navegador no indica si conservará el progreso. Haz una copia de vez en cuando.',
}

const plural = (n: number, singular: string, pluralForm: string) => `${n} ${n === 1 ? singular : pluralForm}`

const summary = (data: ProgressExport) =>
  `${plural(data.exercises.length, 'ejercicio', 'ejercicios')}, ${plural(data.lessons.length, 'lección', 'lecciones')}`

/** "Tu progreso": dónde se guarda y copia de seguridad (exportar/importar JSON). */
export function ProgressPanel() {
  const [stored, setStored] = useState<Stored>(null)
  const [message, setMessage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      if (!navigator.storage?.persisted) return 'no-disponible' as const
      return (await navigator.storage.persisted()) ? ('persistente' as const) : ('puede-borrarse' as const)
    }
    check()
      .then((s) => !cancelled && setStored(s))
      .catch(() => !cancelled && setStored('no-disponible'))
    return () => {
      cancelled = true
    }
  }, [])

  const download = async () => {
    const data = await exportProgress()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bass-tutor-progreso-${data.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage(`Copia descargada (${summary(data)}).`)
  }

  const upload = async (file: File) => {
    try {
      // Validar antes de preguntar: no tiene sentido pedir confirmación para un fichero que no sirve.
      const data = parseProgressExport(JSON.parse(await file.text()))
      if (!window.confirm(`La copia tiene ${summary(data)}. Sustituirá todo tu progreso actual. ¿Seguir?`)) return
      const imported = await importProgress(data)
      setMessage(`Progreso importado (${summary(imported)}).`)
    } catch (e) {
      setMessage(e instanceof SyntaxError ? 'El fichero no es un JSON válido.' : (e as Error).message)
    }
  }

  return (
    <section className="course-progress" aria-labelledby="progress-title">
      <h2 id="progress-title">Tu progreso</h2>
      <p className="hint">
        Se guarda solo en este dispositivo, sin cuenta. {stored ? STORAGE_TEXT[stored] : ''}
      </p>
      <div className="row">
        <button type="button" className="btn" onClick={download}>
          Exportar copia
        </button>
        <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
          Importar copia
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          data-testid="import-progress"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void upload(file)
            e.target.value = ''
          }}
        />
      </div>
      {message && (
        <p className="hint" aria-live="polite" data-testid="progress-message">
          {message}
        </p>
      )}
    </section>
  )
}
