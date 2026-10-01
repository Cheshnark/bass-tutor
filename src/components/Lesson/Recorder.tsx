import { useEffect, useRef, useState } from 'react'
import { tunerErrorOf, type TunerError } from '../../audio/tuner'

type State = { kind: 'idle' } | { kind: 'recording'; startedAt: number } | { kind: 'recorded'; url: string } | { kind: 'error'; error: TunerError }

const ERROR_TEXT: Record<TunerError, string> = {
  'sin-permiso': 'No hay permiso para usar el micrófono.',
  'sin-microfono': 'No se ha encontrado ningún micrófono.',
  'no-soportado': 'Este navegador no puede grabar desde la web.',
  otro: 'No se ha podido grabar.',
}

const now = () => Date.now()
const mmss = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * "Grábate": graba con el micrófono y lo reproduce aquí mismo para escucharte (research.md: grabarse es la forma
 * más fiable de autoevaluarse sin profesor). La grabación no se guarda: se descarta al salir.
 */
export function Recorder() {
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [tick, setTick] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const urlRef = useRef<string | null>(null)

  // Solo para pintar el contador mientras se graba (no dispara sonidos).
  useEffect(() => {
    if (state.kind !== 'recording') return
    const id = window.setInterval(() => setTick(now()), 500)
    return () => window.clearInterval(id)
  }, [state.kind])

  // Al salir: parar la grabación y liberar el micrófono y la grabación.
  useEffect(
    () => () => {
      const recorder = recorderRef.current
      if (recorder && recorder.state !== 'inactive') recorder.stop()
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setState({ kind: 'error', error: 'no-soportado' })
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        const url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }))
        urlRef.current = url
        setState({ kind: 'recorded', url })
      }
      recorder.start()
      recorderRef.current = recorder
      const t = now()
      setTick(t)
      setState({ kind: 'recording', startedAt: t })
    } catch (e) {
      setState({ kind: 'error', error: tunerErrorOf(e) })
    }
  }

  const stop = () => recorderRef.current?.stop()

  const discard = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    setState({ kind: 'idle' })
  }

  return (
    <div className="recorder">
      {state.kind === 'recording' ? (
        <button type="button" className="btn btn--primary" onClick={stop}>
          ● Parar grabación ({mmss(tick - state.startedAt)})
        </button>
      ) : (
        <button type="button" className="btn" onClick={() => void start()}>
          {state.kind === 'recorded' ? 'Grabar otra vez' : 'Grábate'}
        </button>
      )}
      {state.kind === 'recorded' && (
        <>
          <audio controls src={state.url} data-testid="recording" aria-label="Tu grabación" />
          <button type="button" className="btn" onClick={discard}>
            Descartar
          </button>
        </>
      )}
      {state.kind === 'error' && (
        <p role="alert" className="error">
          {ERROR_TEXT[state.error]}
        </p>
      )}
      {state.kind === 'idle' && <span className="hint">Escúchate: se oye mejor que mientras tocas. No se guarda.</span>}
    </div>
  )
}
