# Nombre y marcas

_Fecha: 2026-10-07. Auditoría técnica preliminar, **no asesoramiento legal**. La búsqueda de abajo **no es un estudio
de marca ni descarta conflictos**: solo muestra lo que aparece en búsquedas web abiertas._

## 1. Apariciones de «Basscraft» y «bass-tutor» (hechos del repo)

| Nombre | Dónde | Cuántas |
|---|---|---|
| **Basscraft** (nombre visible) | `src/brand.ts` (`APP_NAME`), `index.html` (`<title>`), manifest PWA (`name`/`short_name`, desde `APP_NAME`), cabecera y títulos de pestaña (UI), `README.md`, `CLAUDE.md`, `.claude/rules/content.md`, `public/icon.svg` (comentario), subtítulo alphaTex `Ejercicio original · Basscraft` en los **123** ejercicios, 3 docs de proyecto, `e2e/progress.spec.ts` | ~140 |
| **bass-tutor** (identificador interno) | nombre del repositorio (`Cheshnark/bass-tutor`), URL pública `cheshnark.github.io/bass-tutor/`, `package.json` (`name`), `vite.config.ts` (base), BD IndexedDB `bass-tutor`, claves de `localStorage` (`bass-tutor:settings`, `bass-tutor:metronome`, `bass-tutor.course.open`, `bass-tutor.tuner.*`), campo `app: 'bass-tutor'` en la copia de progreso exportada, workflow de despliegue, `docs/architecture.md` | ~35 |
| **Bass Tutor** (nombre antiguo) | solo `docs/maquetas/identidad.html:284` (maqueta histórica; se dejó a propósito, ver `project_state.md`) | 1 |

### Inconsistencias
1. **Nombre público ≠ nombre técnico**: lo que ve el usuario es «Basscraft»; la URL, el repositorio, el paquete y las claves de
   almacenamiento dicen `bass-tutor`. Es una decisión consciente (`docs/decisions.md`, 2026-10-06; cambiar las claves rompería
   instalaciones y copias existentes), pero **la URL pública sigue exponiendo el nombre antiguo**.
2. La copia de progreso lleva `app: 'bass-tutor'`: al importar se comprueba ese valor. Renombrar exigiría aceptar ambos.
3. Descripción distinta según el sitio: manifest/`index.html` dicen «Profesor de bajo eléctrico…»; README/spec dicen «Guía de
   práctica…». El contenido es IA + borrador sin revisar; llamarlo «profesor» puede inducir a pensar que lo es (conviene el
   mismo término en todas partes). `CLAUDE.md` titula «profesor de bajo».
4. `docs/maquetas/identidad.html` conserva «Bass Tutor».

## 2. Búsqueda preliminar de «Basscraft» (2026-10-07)

| Dónde | Resultado | Fuente / estado |
|---|---|---|
| **basscraft.com** | Existe y está ocupado por **Basscraft Sound System**, empresa de **sonido profesional para eventos** (Humboldt County, California). **Es del mismo sector amplio (audio/música)**, aunque no del educativo | https://basscraft.com (leído con WebFetch) |
| GitHub | 3 repositorios llamados `basscraft`, 0 estrellas: `Braindnb1975/basscraft` (HTML, 2025), `iSammyC/basscraft` («bass theme», CSS, 2015), `astrozine/BASSCRAFT` (HTML) | https://api.github.com/search/repositories?q=basscraft (total_count 3) |
| App Store (iOS) | La API de búsqueda de iTunes para «basscraft» devolvió 10 apps de **pesca** (Bass Pro Shops, BassForecast…), ninguna llamada Basscraft | https://itunes.apple.com/search?term=basscraft&entity=software |
| Búsqueda web general | Sin resultados de una app, marca o software llamado «Basscraft» (solo apps de pesca con «bass» y apps de bajo como BassBuzz) | WebSearch, varias consultas |
| **EUIPO / TMview, OEPM, USPTO** | **NO VERIFICADO.** Las bases de marcas son aplicaciones dinámicas que no pude consultar. Comprobar a mano: https://www.tmdn.org/tmview/ (EUIPO y oficinas nacionales), https://consultas2.oepm.es/LocalizadorWeb/ (OEPM) y https://tmsearch.uspto.gov/ (USPTO), buscando «BASSCRAFT» y variantes («BASS CRAFT», «BASSKRAFT») en clases 9, 41 y 42 | — |
| Google Play | **NO VERIFICADO** (no hay API pública sin navegador) | Comprobar en https://play.google.com/store/search?q=basscraft |
| Dominios `.app`, `.es`, `.io`, `.net`, `.org` | **NO VERIFICADO** (solo `.com` comprobado: ocupado) | Comprobar con un registrador |
| Softwares musicales educativos similares | No se ha hecho una búsqueda sistemática de nombres parecidos (fonética: «Bass Kraft», «Bass Craft») | — |

**Lectura (inferencia):** el nombre no tiene un uso evidente como app o marca de software educativo, pero `basscraft.com` es una
empresa de audio en activo, lo que **podría** dar pie a confusión en el sector sonido/música. Valorar una búsqueda formal antes de
invertir en el nombre (dominio, tienda, redes). Si piensas monetizar o publicar en tiendas, es un caso para consultar con un
profesional de marcas.

## 3. Menciones a marcas de terceros

Criterio: solo referencias nominativas, sin logos ni imágenes del fabricante ni frases que sugieran respaldo.

| Marca | Dónde | Uso | Valoración |
|---|---|---|---|
| **Vox** (amPlug 3 → «Amplug 3») | `docs/afinador-pruebas.md` (l. 30, 46–47), `docs/project_state.md` (l. 82, 88), `docs/todos.md` (l. 21). **No aparece en `src/`** | Equipo con el que se probó el afinador | Referencial. Además se ha escrito «Amplug» sin «Vox». OK; no hay logos |
| **Korg** | `docs/afinador-pruebas.md` (l. 30), `project_state.md` (l. 89) | «Afinador Korg» como comparación | Referencial; no usar frases como «mejor que» en la app (el testimonio del autor sobre «supera a un afinador físico de ~40 €» está en `project_state.md`, no en la app) |
| **Fender** | `src/content/modules/00-arranque/equipo-y-afinacion.mdx:49` | Enlace a vídeo con `source="Fender"` | Referencial (se cita el canal) |
| **BassBuzz, Scott's Bass Lessons, StudyBass, TalkingBass, D'Addario, Ryan Madora, Dan Hawkins, Mrs. Musical Pants** | Lecciones (`<Video …/>`) y `docs/pedagogy.md` | Citas de fuente y enlaces a vídeos | Referencial. Añadido el aviso «sin vínculo ni respaldo» en *Créditos y avisos* |
| **Hal Leonard, BassBuzz (curso)** | `docs/research.md` | Comparativa de mercado | Referencial, solo docs |
| **YouTube** | 56 enlaces en lecciones | Destino de los enlaces | Referencial |
| **Orange (Amps)** | `CLAUDE.md`, `docs/spec.md`, `src/index.css` (comentario) | Se **evita** su identidad visual a propósito | Correcto: sin elementos de Orange |
| **Guitar Pro** | solo en cadenas internas de alphaTab (`dist/`) | — | No es mención propia |
| **Black Sabbath, Iron Maiden, Sly and the Family Stone** (nombres de grupos) | `coger-la-pua.mdx`, `frigio-y-tritono.mdx`, `slap-pulgar.mdx` | Datos históricos | Referencial; sin logos ni material |

No hay logos, imágenes ni audios de ningún fabricante o artista en `src/` ni `public/` (comprobado: solo iconos propios).

## 4. Propuesta (no aplicada)

**Criterio para unificar:** que **un solo nombre público** aparezca en lo que ve un usuario externo (URL, título, manifest, README,
repositorio) y que los identificadores internos sigan estables para no romper datos.

Si decides **mantener «Basscraft»** (coste bajo):
1. Renombrar el repositorio a `basscraft` (GitHub redirige el antiguo) y la ruta de Pages (`BASE_PATH=/basscraft/`); el
   service worker y la instalación PWA cambian de ámbito, así que **las apps instaladas se reinstalan y pierden el progreso
   local salvo exportación previa** (avisar y recomendar exportar).
2. Mantener `bass-tutor` solo en claves internas (BD y `localStorage`) y en `app: 'bass-tutor'`; aceptar también `app: 'basscraft'` al importar.
3. `package.json` → `"name": "basscraft"`; actualizar `docs/architecture.md`, el workflow y la maqueta antigua.
4. Descripción unificada a «Profesor de bajo eléctrico» (hecho 2026-10-07 en manifest, `index.html`, README, CLAUDE.md, spec y créditos).

Si decides **renombrar** (por el conflicto con `basscraft.com` u otro): el nombre visible está centralizado en
`src/brand.ts` (`APP_NAME`), así que cambia la cabecera, el título, el manifest y los avisos; **hay que reescribir a mano**:
- el subtítulo `Ejercicio original · Basscraft` en 123 archivos `exercises/*.yaml` (un `sed` masivo y `npm run content:check`),
- `README.md`, `CLAUDE.md`, `.claude/rules/content.md`, `index.html`, `public/icon.svg` (comentario) y los docs,
- el logotipo (`.brand` en CSS; el diseño es genérico, 4 cuerdas), y las capturas externas si las hay,
- y decidir si se migran las claves internas (no necesario).

Orden sugerido: (1) búsqueda formal de marca y dominios; (2) decidir nombre; (3) renombrar repositorio y URL; (4) cambiar
`APP_NAME` y el subtítulo; (5) avisar a quienes tengan la app instalada.
