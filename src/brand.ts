/**
 * Nombre visible de la app. Cambiarlo aquí basta para la cabecera, el título de la pestaña, el manifest y los avisos.
 * Los identificadores internos (carpetas, ruta `/bass-tutor/`, `app: 'bass-tutor'` de las copias de progreso, claves
 * de almacenamiento) NO dependen de él y no deben cambiar: romperían las apps instaladas y las copias antiguas.
 */
export const APP_NAME = 'Basscraft'

/** Título de la pestaña para una vista: "Metrónomo · Basscraft". */
export function documentTitle(view?: string): string {
  return view ? `${view} · ${APP_NAME}` : APP_NAME
}
