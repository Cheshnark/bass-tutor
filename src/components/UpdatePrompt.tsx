import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { APP_NAME } from '../brand'

const OFFLINE_READY_MS = 8000

/**
 * Registra el service worker y avisa cuando hay una versión nueva. No se actualiza sola: recargar en mitad
 * de una práctica cortaría el metrónomo, así que el alumno decide cuándo. Es un banner en el flujo de la
 * página (no flotante) para no tapar la barra de Anterior/Siguiente de las lecciones.
 */
export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  // "Ya funciona sin conexión" es informativo: se oculta solo (el temporizador solo afecta a la UI).
  useEffect(() => {
    if (!offlineReady) return
    const timer = setTimeout(() => setOfflineReady(false), OFFLINE_READY_MS)
    return () => clearTimeout(timer)
  }, [offlineReady, setOfflineReady])

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="update-prompt" role="status" data-testid="update-prompt">
      <p>{needRefresh ? `Hay una versión nueva de ${APP_NAME}.` : 'Listo: el curso ya funciona sin conexión.'}</p>
      {needRefresh && (
        <div className="row">
          <button type="button" className="btn btn--primary" onClick={() => void updateServiceWorker(true)}>
            Actualizar
          </button>
          <button type="button" className="btn" onClick={() => setNeedRefresh(false)}>
            Más tarde
          </button>
        </div>
      )}
    </div>
  )
}
