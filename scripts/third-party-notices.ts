/**
 * Genera THIRD_PARTY_NOTICES.md (y su copia servida con la app, public/third-party-notices.txt)
 * a partir de los LICENSE reales de node_modules. Uso: npm run notices
 * Solo incluye lo que viaja en dist/ (ver docs/legal-licenses.md); lo demás es herramienta de desarrollo.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const NM = 'node_modules'
const pkg = (name: string) => JSON.parse(readFileSync(join(NM, name, 'package.json'), 'utf8')) as {
  name: string
  version: string
  license: string
  homepage?: string
  author?: string | { name: string }
  repository?: string | { url: string }
}
const licenseFile = (name: string) => {
  const f = readdirSync(join(NM, name)).find((x) => /^licen[sc]e(\.md|\.txt)?$/i.test(x))
  return f ? readFileSync(join(NM, name, f), 'utf8').replace(/\r\n/g, '\n').trim() : ''
}
const copyright = (text: string, author?: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^(Copyright|©)/.test(l) && !/notice|owner|holder/i.test(l))
    .join(' / ') || (author ? `Autor según package.json: ${author}` : '(sin línea de copyright en el LICENSE del paquete)')
const repoOf = (p: ReturnType<typeof pkg>) =>
  (typeof p.repository === 'string' ? p.repository : p.repository?.url ?? p.homepage ?? '').replace(/^git\+/, '').replace(/\.git$/, '')

const tonal = readdirSync(join(NM, '@tonaljs')).map((n) => `@tonaljs/${n}`)
const RUNTIME = [
  'react', 'react-dom', 'scheduler', 'zustand', 'dexie', 'dexie-react-hooks', 'tonal', ...tonal,
  'workbox-core', 'workbox-precaching', 'workbox-routing', 'workbox-strategies', 'workbox-window',
  '@coderline/alphatab', '@fontsource/oswald', '@fontsource/atkinson-hyperlegible-next',
]

const out: string[] = []
out.push('# Avisos de software y recursos de terceros\n')
out.push('Basscraft se distribuye con los componentes siguientes. Cada uno conserva su licencia y sus derechos.')
out.push('Generado con `npm run notices` a partir de los `LICENSE` de `node_modules`. Fecha: ' + new Date().toISOString().slice(0, 10) + '.\n')
out.push('No implica respaldo de sus autores. El código propio va bajo MIT (`LICENSE`); el contenido del curso, sin licencia hasta que se active `CONTENT-LICENSE.md`.\n')
out.push('## Componentes\n')
out.push('| Componente | Versión | Licencia | Copyright (según su LICENSE) | Fuente |')
out.push('|---|---|---|---|---|')
for (const n of RUNTIME) {
  const p = pkg(n)
  const notice = existsSync(join(NM, n, 'NOTICE')) ? readFileSync(join(NM, n, 'NOTICE'), 'utf8') : ''
  const author = typeof p.author === 'string' ? p.author : p.author?.name
  out.push(`| ${p.name} | ${p.version} | ${p.license} | ${copyright(`${licenseFile(n)}\n${notice}`, author)} | ${repoOf(p) || '—'} |`)
}
out.push(`| Bravura (fuente de notación SMuFL, vía alphaTab) | — | OFL-1.1 | Copyright © 2015, Steinberg Media Technologies GmbH, con el nombre reservado «Bravura» | https://github.com/steinbergmedia/bravura |`)
out.push(`| SoundFont «sonivox.sf2» (vía alphaTab) | — | Apache-2.0 (según el LICENSE del paquete; ver nota) | Copyright (c) 2004-2006 Sonic Network Inc. | https://musical-artifacts.com/artifacts/1517 |`)
out.push(`| Librerías integradas en alphaTab: TinySoundFont (MIT, © 2017-2018 Bernhard Schelling), SFZero (MIT, © 2012 Steve Folta), Haxe Standard Library (MIT, © 2005-2025 Haxe Foundation), SharpZipLib (MIT, © 2000-2018 SharpZipLib Contributors), NVorbis (MIT, © 2020 Andrew Ward), libvorbis (BSD-3-Clause, © 2002-2020 Xiph.org Foundation) | — | ver columna | ver LICENSE.header de alphaTab | https://github.com/coderline/alphaTab |`)
out.push('')

out.push('## Notas\n')
out.push('- **alphaTab** (MPL-2.0): se usa sin modificar. Código fuente: https://github.com/coderline/alphaTab · Texto de la licencia: https://www.mozilla.org/MPL/2.0/')
out.push('- **SoundFont**: el paquete de alphaTab lo declara Apache-2.0 (Sonic Network / Sonivox EAS de Android Open Source Project), pero es una conversión hecha por un tercero; su origen y licencia exactos están **pendientes de verificar** (ver `docs/legal-licenses.md`).')
out.push('- Zod y YAML se usan solo al compilar el curso y no se distribuyen con la app.')
out.push('- Los iconos y los sonidos de la app son propios (los sonidos se sintetizan por código).\n')

out.push('## Textos de licencia\n')
out.push('### MIT (React, Zustand, Tonal, Workbox y librerías integradas en alphaTab)\n')
out.push('Cada componente MIT de la tabla se licencia con estos términos, con el copyright indicado en la tabla:\n')
out.push('```text')
out.push(
  licenseFile('zustand').replace(/Copyright \(c\) 2019 Paul Henschel/, 'Copyright (c) <año y titulares de la tabla>'),
)
out.push('```\n')
out.push('### Apache License 2.0 (Dexie, dexie-react-hooks, SoundFont)\n')
out.push('```text')
out.push(licenseFile('dexie'))
out.push('```\n')
out.push('### SIL Open Font License 1.1 (Oswald, Atkinson Hyperlegible Next, Bravura)\n')
out.push('Fuentes sin modificar. Copyrights: ver tabla. Texto completo:\n')
out.push('```text')
out.push(licenseFile('@fontsource/oswald'))
out.push('```\n')
out.push('### Mozilla Public License 2.0 (alphaTab)\n')
out.push('Texto completo en https://www.mozilla.org/MPL/2.0/ y en `node_modules/@coderline/alphatab/LICENSE`. Aviso: «This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.»\n')

const text = out.join('\n')
if (!existsSync('public')) throw new Error('falta public/')
writeFileSync('THIRD_PARTY_NOTICES.md', text)
writeFileSync('public/third-party-notices.txt', text)
console.log(`${RUNTIME.length} componentes → THIRD_PARTY_NOTICES.md y public/third-party-notices.txt`)
