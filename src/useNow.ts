import { useEffect, useState } from 'react'

/**
 * Hora actual (ms) que se refresca cada `everyMs` mientras `active`. Solo sirve para pintar contadores
 * (nunca para disparar sonidos). Devuelve también `sync`, que la actualiza al instante y devuelve ese valor:
 * úsalo al arrancar un contador para que no muestre una hora vieja hasta el primer refresco.
 */
export function useNow(active: boolean, everyMs: number): [now: number, sync: () => number] {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setNow(Date.now()), everyMs)
    return () => window.clearInterval(id)
  }, [active, everyMs])
  const sync = () => {
    const t = Date.now()
    setNow(t)
    return t
  }
  return [now, sync]
}
