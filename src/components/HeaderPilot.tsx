import { useMetronome } from '../state/metronome'
import { useBeatPulse } from './Metronome/useBeatPulse'

/**
 * Piloto de la cabecera (el "jewel light" del cabezal): luce con cada pulso mientras el metrónomo suena, en
 * cualquier vista, y lleva al metrónomo. Apagado, es solo decoración.
 */
export function HeaderPilot() {
  const running = useMetronome((s) => s.running)
  const bpm = useMetronome((s) => s.bpm)
  const pulse = useBeatPulse(running)

  if (!running) return <span className="pilot header-pilot" aria-hidden="true" />
  return (
    <a className="header-pilot-link" href="#/metronomo" aria-label={`Metrónomo sonando a ${bpm} BPM`}>
      <span className="pilot pilot--flash header-pilot" key={pulse} aria-hidden="true" />
      <span className="header-pilot-bpm">{bpm}</span>
    </a>
  )
}
