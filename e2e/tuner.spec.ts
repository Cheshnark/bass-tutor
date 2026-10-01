import { expect, test } from '@playwright/test'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * WAV mono de 16 bits con un tono tipo bajo (fundamental + armónicos). Chromium lo usa como micrófono simulado
 * (`--use-file-for-fake-audio-capture`) y lo repite en bucle.
 */
function writeToneWav(path: string, frequency: number, seconds = 4, sampleRate = 48_000) {
  const harmonics = [0.5, 1, 0.6, 0.4, 0.25]
  const samples = seconds * sampleRate
  const buffer = Buffer.alloc(44 + samples * 2)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + samples * 2, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20) // PCM
  buffer.writeUInt16LE(1, 22) // mono
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(samples * 2, 40)
  for (let i = 0; i < samples; i++) {
    let v = 0
    harmonics.forEach((a, h) => (v += a * Math.sin((2 * Math.PI * frequency * (h + 1) * i) / sampleRate)))
    buffer.writeInt16LE(Math.round(v * 0.25 * 32767), 44 + i * 2)
  }
  writeFileSync(path, buffer)
}

// E1 desafinada 12 cents hacia arriba: el afinador tiene que decir "E1" y "baja".
const E1_SHARP = 41.203 * Math.pow(2, 12 / 1200)
const wav = join(tmpdir(), `bass-tutor-e1-${process.pid}.wav`)
writeToneWav(wav, E1_SHARP)

test.use({
  permissions: ['microphone'],
  launchOptions: {
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${wav}`],
  },
})

test('afinador: detecta una E1 sintética por el micrófono simulado', async ({ page }) => {
  await page.goto('/#/afinador')
  await page.getByRole('button', { name: 'Activar micrófono' }).click()
  await expect(page.getByRole('button', { name: 'Parar micrófono' })).toBeVisible()
  await expect(page.getByTestId('tuner-note')).toHaveText('E1', { timeout: 10_000 })
  await expect(page.getByRole('status')).toHaveText('Alto: baja (afloja la cuerda)')
  // +12 cents en el fichero. Margen de ±3 (criterio de la Fase 5), y estable: cinco lecturas seguidas.
  const readCents = async () => {
    const text = (await page.getByTestId('tuner-cents').textContent()) ?? ''
    const match = /([+-]?\d+) cents/.exec(text)
    return match ? Number(match[1]) : Number.NaN
  }
  await expect.poll(async () => Math.abs((await readCents()) - 12), { timeout: 5_000 }).toBeLessThanOrEqual(3)
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(150)
    const cents = await readCents()
    // Un hueco puntual (sin lectura) se admite: es el empalme del bucle del fichero.
    if (!Number.isNaN(cents)) expect(Math.abs(cents - 12)).toBeLessThanOrEqual(3)
  }

  // Fijando la cuerda E, la lectura es la misma.
  await page.getByRole('button', { name: 'E1', exact: true }).click()
  await expect(page.getByTestId('tuner-note')).toHaveText('E1')

  await page.getByRole('button', { name: 'Parar micrófono' }).click()
  await expect(page.getByTestId('tuner-note')).toHaveText('—')
})

test('afinador: el tono de referencia se activa y se para', async ({ page }) => {
  await page.goto('/#/afinador')
  await page.getByRole('button', { name: 'Escuchar A1' }).click()
  await expect(page.getByRole('button', { name: 'Parar A1' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Parar A1' }).click()
  await expect(page.getByRole('button', { name: 'Escuchar A1' })).toHaveAttribute('aria-pressed', 'false')
})

test('grábate: graba con el micrófono y deja escucharlo', async ({ page }) => {
  await page.goto('/#/curso/cuerdas-al-aire/4')
  const card = page.getByTestId('exercise-cuerdas-al-aire-negras')
  await card.getByRole('button', { name: 'Grábate' }).click()
  await expect(card.getByRole('button', { name: /Parar grabación/ })).toBeVisible()
  await page.waitForTimeout(1200)
  await card.getByRole('button', { name: /Parar grabación/ }).click()
  await expect(card.getByTestId('recording')).toBeVisible()
  await card.getByRole('button', { name: 'Descartar' }).click()
  await expect(card.getByTestId('recording')).toHaveCount(0)
})
