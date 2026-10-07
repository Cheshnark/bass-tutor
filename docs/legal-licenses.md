# Inventario de licencias

_Fecha: 2026-10-07. Auditoría técnica, **no asesoramiento legal**. Datos tomados de `node_modules` (campo `license` de
cada `package.json` y archivo `LICENSE` del paquete), de `npx license-checker` y de la salida de `npm run build` (`dist/`)._

## 1. Dependencias npm

### 1.1 Lo que viaja al navegador (resumen)

Contenido de `dist/` (comprobado): React/React DOM/Scheduler, Zustand, Dexie, Tonal (`tonal` + `@tonaljs/*`), alphaTab
(+ worker y worklet), Workbox (service worker y `workbox-window`) y las fuentes de `@fontsource`.
**Zod y YAML no llegan al navegador** (se usan en el build; `grep` de `zod` en `dist/assets/index-*.js` da 0).

| Paquete | Versión | Licencia (fuente) | Titular del copyright (LICENSE del paquete) | ¿Qué exige? |
|---|---|---|---|---|
| react, react-dom, scheduler | 19.3.0 / 0.28.0 | MIT | Meta Platforms, Inc. | Conservar aviso y texto MIT |
| zustand | 5.0.15 | MIT | Paul Henschel (2019) | Ídem |
| dexie, dexie-react-hooks | 4.4.6 / 4.4.0 | **Apache-2.0** | David Fahlander | Conservar licencia; aviso `NOTICE` si existe; indicar cambios (no hay) |
| tonal + 28 `@tonaljs/*` | 6.4.3 | MIT | danigb (2015) | Conservar aviso y texto MIT |
| workbox-* (precaching, routing, core…) | 7.4.1 | MIT | Google LLC (2018) | Ídem |
| **@coderline/alphatab** | 1.8.4 | **MPL-2.0** | Daniel Kuschny y colaboradores | Ver 1.2 |
| @fontsource/oswald | 5.3.0 | OFL-1.1 | The Oswald Project Authors | Ver sección 2 |
| @fontsource/atkinson-hyperlegible-next | 5.3.0 | OFL-1.1 | The Atkinson Hyperlegible Next Project Authors | Ver sección 2 |
| yaml | 2.9.1 | ISC | Eemeli Aro | Solo build |
| zod | 4.6.5 | MIT | Colin McDonnell | Solo build |

### 1.2 alphaTab (MPL-2.0) — cómo se usa

- **Hecho:** se usa `@coderline/alphatab@1.8.4` **sin modificar** desde npm; `@coderline/alphatab-vite` (también MPL-2.0)
  solo empaqueta workers/worklets en el build. `scripts/vite-plugin-alphatab-assets.ts` solo **copia** `font/` y
  `soundfont/` a `public/`, sin editar los archivos (compara tamaños y copia).
- **Hecho:** el repo no contiene ficheros de alphaTab modificados (`git grep` de `alphatab` solo encuentra imports,
  configuración y docs).
- **Inferencia (no es consejo legal):** la MPL-2.0 es copyleft **a nivel de archivo**: obliga a ofrecer el código
  fuente de los archivos MPL que se distribuyan (se cumple con el enlace al paquete original) y a conservar sus avisos;
  no contagia el código propio. Mientras no se modifiquen sus archivos, la obligación práctica es: **atribuir,
  incluir el aviso de licencia y enlazar la fuente** (`https://github.com/coderline/alphaTab`). Si en el futuro se parchea
  alphaTab, esos archivos modificados deberán publicarse bajo MPL-2.0.
- alphaTab integra otras librerías (`LICENSE.header` del paquete): TinySoundFont (MIT, Bernhard Schelling), SFZero (MIT,
  Steve Folta), Haxe Standard Library (MIT), SharpZipLib (MIT), NVorbis (MIT, Andrew Ward) y libvorbis (BSD-3-Clause,
  Xiph.org). Van embebidas en el JS de alphaTab: hay que mantener sus avisos (ver `THIRD_PARTY_NOTICES.md`).
- **Hecho:** el aviso de copyright de alphaTab ("Kuschny") sobrevive en `dist/assets/alphaTab.worker-*.js` y `alphaTab.worklet-*.js`. **NO VERIFICADO** en el chunk principal de alphaTab (`TabView-*.js`): comprobar con `grep -l Kuschny dist/assets/*.js`.

### 1.3 Solo desarrollo (no se distribuyen)

569 paquetes en total (504 MIT). Conviene señalar los no-MIT por si se redistribuyera el repo con `node_modules`
(no se hace):

| Paquete | Licencia | Comentario |
|---|---|---|
| axe-core, @axe-core/playwright, lightningcss, ico-endec, @coderline/alphatab-vite | MPL-2.0 | Herramientas de test/build; no se distribuyen |
| sharp, @img/sharp-* | Apache-2.0 **AND LGPL-3.0-or-later** (libvips) | Solo en `@vite-pwa/assets-generator` (genera iconos). **LGPL presente solo en desarrollo**; no se entrega en la app |
| caniuse-lite | CC-BY-4.0 | Dato de browserslist (dev) |
| glob, minimatch, lru-cache, jackspeak… | BlueOak-1.0.0 | Permisiva (dev) |
| tslib | 0BSD | Permisiva |
| `bass-tutor` | `UNLICENSED` | Es el propio proyecto (`package.json` sin campo `license`): **resolver con el `LICENSE` nuevo** |

**No hay GPL ni AGPL en nada que se distribuya.** `license-checker` marca como «raro» solo `UNLICENSED` (el propio
proyecto) y la combinación Apache-2.0 AND LGPL de sharp (dev).

## 2. Recursos que no son código

| Recurso | Dónde | Origen / titular | Licencia | Fuente primaria | ¿Se puede redistribuir con la app? |
|---|---|---|---|---|---|
| **Bravura** (fuente de notación SMuFL; `Bravura.woff2` precacheado) | `public/font/` (copiado desde alphaTab; en `.gitignore`) | Steinberg Media Technologies GmbH, 2015, «Reserved Font Name Bravura» | SIL OFL 1.1 (texto en `Bravura-OFL.txt`) | https://github.com/steinbergmedia/bravura · archivos en el paquete alphaTab | Sí, con el aviso de copyright y la licencia, **sin vender la fuente sola ni renombrar una versión modificada** (no se modifica). Se incluyen `Bravura-OFL.txt` y `Bravura-FONTLOG.txt` en `dist/font/` (comprobado) |
| **Oswald** (rótulos) | `@fontsource/oswald`, empaquetada en `dist/assets/oswald-latin-*.woff2` | The Oswald Project Authors | SIL OFL 1.1 (LICENSE del paquete) | https://github.com/googlefonts/OswaldFont | Sí, con aviso de copyright y licencia |
| **Atkinson Hyperlegible Next** (texto) | `@fontsource/atkinson-hyperlegible-next`, `dist/assets/atkinson-*.woff2` | The Atkinson Hyperlegible Next Project Authors | SIL OFL 1.1 | https://github.com/googlefonts/atkinson-hyperlegible-next | Sí, con aviso de copyright y licencia |
| **SoundFont `sonivox.sf2`** (instrumentos de la reproducción; ~1,3 MB, precacheado) | `public/soundfont/` (copiado desde alphaTab; en `.gitignore`) | Banco GM «SONiVOX EAS» **convertido a SF2 por un tercero** (según el README: «Ported from Samsung…»; «Using a Creative Sound Blaster GM bank… wt210k_G.sf2 from 3.5 Floppy Disk»); publicado en musical-artifacts.com/artifacts/1517 | El `LICENSE` del paquete es **Apache-2.0** («Copyright (c) 2004-2006 Sonic Network Inc.») | https://musical-artifacts.com/artifacts/1517 y https://android.googlesource.com/platform/external/sonivox/ | **NO VERIFICADO.** Ver «Dudas abiertas», nº 1. Se distribuye hoy con la app |
| Iconos PWA (`icon.svg`, `pwa-*.png`, `apple-touch-icon`, `favicon.ico`) | `public/` (en git) | Propios («Icono original de Basscraft», comentario en `icon.svg`); los PNG/ICO se generan con `@vite-pwa/assets-generator` | Sin licencia hasta que se ponga el `LICENSE` | `pwa-assets.config.ts` | Sí (son tuyos); confirmar autoría |
| Sonidos del metrónomo, batería, acordes, slap, tono de referencia | `src/audio/*` | **Sintetizados por código** (Web Audio); no hay ficheros de audio (`find` sin .mp3/.wav/.ogg) | Código propio | — | Sí |
| Audios de oído (intervalos) | `src/audio` / práctica | Sintetizados por código | Código propio | — | Sí |
| Imágenes | — | No hay imágenes en `src/` ni en `public/` salvo los iconos | — | — | — |
| Notas, esquemas del mástil, VU, logotipo | SVG/CSS | Dibujados por código | Propio | — | Sí |

### Fuentes que no hay en el árbol pero sí en el despliegue
`public/font/` y `public/soundfont/` están en `.gitignore`: **no están en el repositorio**, se copian en cada build desde
`node_modules`. Por eso `THIRD_PARTY_NOTICES.md` tiene que ir en el repo y servirse con la app.

## 3. Recursos de terceros cargados en tiempo de ejecución

**Hecho (comprobado en código y en `dist/`):**
- **Ninguno.** No hay CDNs, ni Google Fonts, ni analítica, ni `fetch`/`XMLHttpRequest`/`WebSocket`/`sendBeacon`
  en `src/` (`grep` sin resultados). Las fuentes, el soundfont y alphaTab se sirven desde el mismo origen y se precachean.
- En `dist/` aparecen URLs de terceros solo como **texto**: enlaces de vídeo de YouTube (56, abiertos en pestaña nueva con
  `rel="noopener noreferrer"` solo si el usuario hace clic) y cadenas internas de alphaTab (alphatab.net, github.com…).
  `index.html` no tiene ningún `https://` salvo lo propio.
- Al **hacer clic** en un enlace de vídeo, el navegador pasa a youtube.com, que tiene su propia política de privacidad; la app no
  carga nada de YouTube por sí misma.
- El despliegue está en **GitHub Pages**: GitHub, como alojamiento, ve la IP y la petición de cada visita (su política
  de privacidad aplica; la app no puede evitarlo).
- Primera visita: necesita conexión para descargar la app; después, funciona sin conexión.

## 4. Dudas y conflictos abiertos

1. **SoundFont `sonivox.sf2` (la duda más importante).** El paquete alphaTab lo trae y declara Apache-2.0 (copyright de Sonic
   Network, 2004–2006), pero su README admite que es una **conversión hecha por un tercero** a partir de un banco de un
   disquete y de teléfonos Samsung, y la página de origen (musical-artifacts.com/artifacts/1517) devolvió **403** al intentar
   leerla: no he podido verificar autoría ni licencia declarada allí. La licencia Apache del propio motor Sonivox EAS
   (AOSP) es un dato verificable, pero **no está probado que cubra esta conversión del banco de muestras**.
   Qué comprobar: la página de musical-artifacts (campo *License*), el repositorio de alphaTab (issue/commit que añadió el
   soundfont) y, si queda duda, preguntar a alphaTab o cambiar a un soundfont con licencia clara.
   Riesgo mientras tanto: **no lo has creado ni modificado tú, lo redistribuyes tal cual**, igual que miles de apps que usan
   alphaTab; riesgo práctico bajo, pero conviene dejarlo documentado.
2. **`bass-tutor` figura como `UNLICENSED`** en `npm`: se arregla con el `LICENSE` (MIT propuesto).
3. **alphaTab MPL-2.0:** mantener sin modificar; si se parchea, publicar los cambios.
4. **LGPL de libvips** solo en dev; no hay que hacer nada salvo no distribuir `node_modules`.
5. **Aviso de licencia en el chunk principal de alphaTab:** presente en worker y worklet; NO VERIFICADO en `TabView` (ver 1.2).
6. **Licencia del contenido del curso:** sin decidir hasta terminar la revisión (ver `CONTENT-LICENSE.md`).
7. **Enlaces a vídeos:** 56 URLs sin verificar hoy (ver [legal-provenance.md](legal-provenance.md)).
