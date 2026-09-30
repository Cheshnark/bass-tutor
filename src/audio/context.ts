/**
 * AudioContext único para toda la app (metrónomo, notas del mástil...).
 * Tiene que obtenerse dentro de un gesto del usuario la primera vez (iOS/Safari).
 */

let shared: AudioContext | null = null

export async function getAudioContext(): Promise<AudioContext> {
  if (!shared || shared.state === 'closed') {
    shared = new AudioContext({ latencyHint: 'interactive' })
  }
  if (shared.state !== 'running') await shared.resume()
  return shared
}

