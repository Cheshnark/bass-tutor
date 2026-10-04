import { AlphaTabApi, PlayerMode, synth } from '@coderline/alphatab'
import { useEffect, useRef, useState } from 'react'
import { playbackSpeedFor, tempoOptions } from './playbackTempo'

const BASE = import.meta.env.BASE_URL

type Status = 'cargando' | 'listo' | 'error'

interface TabViewProps {
  /** Código alphaTex del ejercicio. */
  tex: string
  /** Nombre accesible del bloque (lectores de pantalla). */
  title?: string
  /**
   * Tempo de práctica (BPM): la reproducción suena a este tempo en vez del escrito en la partitura,
   * para tocar encima (con batería) al tempo en que estás. El alumno puede cambiarlo en el selector.
   */
  bpm?: number
}

/**
 * Partitura + tablatura con reproducción (alphaTab). Se carga de forma diferida
 * (ver LazyTabView.tsx) para que alphaTab no pese en el bundle principal.
 */
export default function TabView({ tex, title = 'Tablatura y partitura', bpm }: TabViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<AlphaTabApi | null>(null)
  const [status, setStatus] = useState<Status>('cargando')
  const [errorMessage, setErrorMessage] = useState('')
  const [playerReady, setPlayerReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [looping, setLooping] = useState(false)
  /** Tempo escrito en la partitura (`\tempo`), conocido al cargarla. */
  const [scoreBpm, setScoreBpm] = useState<number | null>(null)
  /** Tempo elegido a mano en el selector; deja de valer si cambia el tempo de práctica. */
  const [choice, setChoice] = useState<{ practiceBpm?: number; bpm: number } | null>(null)
  /** Pistas de la partitura: la 1.ª es el bajo; las demás, acompañamiento (batería, acordes…). */
  const [trackCount, setTrackCount] = useState(0)
  const [bassOn, setBassOn] = useState(true)
  const [backingOn, setBackingOn] = useState(true)
  const chosenBpm = choice && choice.practiceBpm === bpm ? choice.bpm : undefined
  const playbackBpm = chosenBpm ?? bpm ?? scoreBpm

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const instance = new AlphaTabApi(el, {
      core: { fontDirectory: `${BASE}font/` },
      display: { scale: 0.9 },
      player: {
        playerMode: PlayerMode.EnabledSynthesizer,
        soundFont: `${BASE}soundfont/sonivox.sf2`,
        // alphaTab sigue el cursor con la vista y por defecto lo deja pegado al borde de arriba; con este margen se
        // ve algo de lo anterior y el cursor no queda en el borde de la pantalla.
        scrollOffsetY: -80,
      },
    })
    instance.scoreLoaded.on((score) => {
      setScoreBpm(score.tempo)
      setTrackCount(score.tracks.length)
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
      setScoreBpm(null)
      setTrackCount(0)
    }
  }, [tex])

  // Silenciar el bajo (para tocar tú su parte con la banda) o el acompañamiento. Se reaplica si alphaTab se recrea.
  useEffect(() => {
    const api = apiRef.current
    if (!api?.score || !playerReady) return
    const [bass, ...backing] = api.score.tracks
    api.changeTrackMute([bass], !bassOn)
    if (backing.length > 0) api.changeTrackMute(backing, !backingOn)
  }, [bassOn, backingOn, playerReady, trackCount])

  // La velocidad se aplica también si alphaTab se recrea (cambia `tex`) o si cambia el tempo de práctica.
  useEffect(() => {
    if (apiRef.current && scoreBpm && playbackBpm) apiRef.current.playbackSpeed = playbackSpeedFor(playbackBpm, scoreBpm)
  }, [playbackBpm, scoreBpm, playerReady])

  const toggleLoop = () => {
    const next = !looping
    setLooping(next)
    if (apiRef.current) apiRef.current.isLooping = next
  }

  return (
    <section className="tab-view" aria-label={title}>

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
        {trackCount > 1 && (
          <>
            <button type="button" className="btn" aria-pressed={bassOn} onClick={() => setBassOn(!bassOn)}>
              Bajo: {bassOn ? 'suena' : 'silenciado'}
            </button>
            <button type="button" className="btn" aria-pressed={backingOn} onClick={() => setBackingOn(!backingOn)}>
              Acompañamiento: {backingOn ? 'suena' : 'silenciado'}
            </button>
          </>
        )}
        <label>
          Tempo{' '}
          <select
            value={playbackBpm ?? ''}
            disabled={!scoreBpm}
            onChange={(e) => setChoice({ practiceBpm: bpm, bpm: Number(e.target.value) })}
          >
            {scoreBpm ? (
              tempoOptions(scoreBpm, bpm).map((option) => (
                <option key={option} value={option}>
                  {option} BPM{option === bpm ? ' (tu tempo)' : ''}
                </option>
              ))
            ) : (
              <option value="">…</option>
            )}
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
