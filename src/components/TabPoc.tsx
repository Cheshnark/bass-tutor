import { AlphaTabApi, PlayerMode, synth } from '@coderline/alphatab'
import { useEffect, useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL

type Status = 'cargando' | 'listo' | 'error'

interface TabPocProps {
  /** Código alphaTex del ejercicio. */
  tex: string
}

/** Prueba de concepto de alphaTab (Fase 0): partitura + tab + reproducción. */
export function TabPoc({ tex }: TabPocProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<AlphaTabApi | null>(null)
  const [status, setStatus] = useState<Status>('cargando')
  const [errorMessage, setErrorMessage] = useState('')
  const [playerReady, setPlayerReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [looping, setLooping] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const instance = new AlphaTabApi(el, {
      core: { fontDirectory: `${BASE}font/` },
      display: { scale: 0.9 },
      player: {
        playerMode: PlayerMode.EnabledSynthesizer,
        soundFont: `${BASE}soundfont/sonivox.sf2`,
      },
    })
    instance.renderFinished.on(() => setStatus('listo'))
    instance.error.on((e) => {
      setStatus('error')
      setErrorMessage(e.message)
    })
    instance.playerReady.on(() => setPlayerReady(true))
    instance.playerStateChanged.on((e) => {
      setPlaying(e.state === synth.PlayerState.Playing)
    })
    instance.tex(tex)
    apiRef.current = instance
    return () => {
      instance.destroy()
      apiRef.current = null
      setPlayerReady(false)
      setPlaying(false)
    }
  }, [tex])

  const changeSpeed = (value: number) => {
    setSpeed(value)
    if (apiRef.current) apiRef.current.playbackSpeed = value
  }

  const toggleLoop = () => {
    const next = !looping
    setLooping(next)
    if (apiRef.current) apiRef.current.isLooping = next
  }

  return (
    <section className="panel" aria-labelledby="tab-title">
      <h2 id="tab-title">Tablatura y partitura</h2>

      <div className="row">
        <button
          type="button"
          className="btn btn--primary"
          disabled={!playerReady}
          onClick={() => apiRef.current?.playPause()}
          aria-pressed={playing}
        >
          {playerReady ? (playing ? 'Pausa' : 'Reproducir') : 'Cargando sonido…'}
        </button>
        <button type="button" className="btn" disabled={!playerReady} onClick={() => apiRef.current?.stop()}>
          Parar
        </button>
        <button type="button" className="btn" onClick={toggleLoop} aria-pressed={looping}>
          Bucle: {looping ? 'sí' : 'no'}
        </button>
        <label>
          Velocidad{' '}
          <select value={speed} onChange={(e) => changeSpeed(Number(e.target.value))}>
            {[0.5, 0.75, 0.9, 1, 1.1].map((s) => (
              <option key={s} value={s}>
                {Math.round(s * 100)} %
              </option>
            ))}
          </select>
        </label>
      </div>

      {status === 'error' && (
        <p role="alert" className="error">
          Error al renderizar: {errorMessage}
        </p>
      )}

      <div className="tab-viewport">
        <div ref={containerRef} data-testid="alphatab" data-status={status} />
      </div>
    </section>
  )
}
