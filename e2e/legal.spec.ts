import { expect, test } from '@playwright/test'

test('el pie lleva a créditos y a privacidad, y los avisos de terceros se sirven', async ({ page, request }) => {
  await page.goto('/#/curso')
  await page.getByRole('link', { name: 'Créditos y avisos' }).click()
  await expect(page.getByRole('heading', { name: 'Créditos y avisos', level: 1 })).toBeVisible()
  await expect(page.getByText('tal cual', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: 'alphaTab' })).toBeVisible()

  await page.getByRole('link', { name: 'Aviso de privacidad' }).click()
  await expect(page.getByRole('heading', { name: 'Privacidad', level: 1 })).toBeVisible()

  const href = await page.goto('/#/creditos').then(() => page.getByRole('link', { name: 'avisos de terceros' }).getAttribute('href'))
  const res = await request.get(new URL(href ?? '', page.url()).toString())
  expect(res.ok()).toBe(true)
  expect(await res.text()).toContain('MPL-2.0')
})

test('la app no hace peticiones a otros orígenes al cargar el curso', async ({ page, baseURL }) => {
  const foreign: string[] = []
  page.on('request', (r) => {
    const u = new URL(r.url())
    if (u.protocol.startsWith('http') && u.origin !== new URL(baseURL ?? '').origin) foreign.push(r.url())
  })
  await page.goto('/#/curso')
  await page.goto('/#/mastil')
  await page.goto('/#/metronomo')
  await page.waitForLoadState('networkidle')
  expect(foreign).toEqual([])
})
