import { useEffect, useState } from 'react'
import { metronomeEngine } from '../../state/metronome'

/**
 * Contador que sube en cada pulso del metrónomo mientras suena. Se sincroniza leyendo el reloj de audio en
 * `requestAnimationFrame` (regla de audio: nada de temporizadores propios para la UI del pulso).
 * Úsalo como `key` de un elemento con animación para que parpadee en cada pulso.
 */
export function useBeatPulse(running: boolean): number {
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    if (!running) return
    let frame = 0
    let last: number | undefined
    const loop = () => {
      const tick = metronomeEngine.currentTick()
      if (tick && tick.subInBeat === 0 && tick.time !== last) {
        last = tick.time
        setPulse((p) => p + 1)
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [running])
  return pulse
}
