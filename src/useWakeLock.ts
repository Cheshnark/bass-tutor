import { useEffect, useState } from 'react'

/**
 * - "activo": la pantalla no se apagará.
 * - "no-disponible": el navegador no tiene Screen Wake Lock API.
 * - "denegado": existe pero lo rechazó (p. ej., ahorro de batería o documento no visible).
 * - "inactivo": no se ha pedido.
 */
export type WakeLockStatus = 'activo' | 'no-disponible' | 'denegado' | 'inactivo'

/**
 * Mantiene la pantalla encendida mientras `enabled` sea true (Screen Wake Lock API).
 * El navegador suelta el bloqueo al ocultar la pestaña: se vuelve a pedir al volver.
 */
export function useWakeLock(enabled: boolean): WakeLockStatus {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  const [status, setStatus] = useState<WakeLockStatus>('inactivo')

  useEffect(() => {
    if (!enabled || !supported) return
    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          await lock.release()
          return
        }
        sentinel = lock
        setStatus('activo')
        lock.addEventListener('release', () => {
          if (!cancelled) setStatus('inactivo')
        })
      } catch {
        if (!cancelled) setStatus('denegado')
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && (!sentinel || sentinel.released)) void request()
    }

    void request()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      void sentinel?.release()
    }
  }, [enabled, supported])

  if (!supported) return 'no-disponible'
  return enabled ? status : 'inactivo'
}
