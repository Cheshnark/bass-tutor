// alphaTab (~1 MB) va en su propio chunk: solo se descarga al mostrar una tablatura.
export const loadTabView = () => import('./TabView')

/**
 * Empieza a descargar alphaTab sin esperar a tener la partitura. `ExerciseTab` la llama al montar, en paralelo con
 * la descarga del detalle del ejercicio: sin esto, los dos chunks se piden uno detrás de otro.
 */
export const preloadTabView = () => void loadTabView()
