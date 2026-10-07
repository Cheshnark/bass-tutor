/**
 * Genera la tabla de docs/legal-provenance.md a partir de src/content (módulos, lecciones, ejercicios).
 * Uso: npx tsx scripts/legal-provenance.ts > $TEMP/prov.md
 * Solo vuelca hechos medibles del repo; la columna "revisado por el autor" se deja vacía.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'

const ROOT = 'src/content'
const FM = /^---\r?\n([\s\S]*?)\r?\n---/
const front = (src: string) => (parse(FM.exec(src)?.[1] ?? '') ?? {}) as Record<string, unknown>
const PEOPLE = /Jamerson|Larry Graham|Steve Harris|Geezer Butler|Black Sabbath|Sly and the Family/g

const out: string[] = []
const mods = readdirSync(join(ROOT, 'modules')).sort()
let nl = 0
let ne = 0
const seenEx = new Set<string>()
for (const m of mods) {
  const dir = join(ROOT, 'modules', m)
  const mod = parse(readFileSync(join(dir, 'module.yaml'), 'utf8')) as { title: string; track?: string; lessons: string[] }
  out.push(`\n### ${m} · ${mod.title} (${mod.track ?? 'tronco común'})\n`)
  out.push('| ID / ruta | Descripción | Origen | Fuente / enlaces de terceros | ¿Reproduce expresión de terceros? | Riesgo | Acción propuesta | Revisado por el autor |')
  out.push('|---|---|---|---|---|---|---|---|')
  for (const l of mod.lessons) {
    nl++
    const p = join(dir, `${l}.mdx`)
    const src = readFileSync(p, 'utf8')
    const fm = front(src)
    const vids = [...src.matchAll(/<Video url="([^"]+)" title="([^"]+)" source="([^"]+)"/g)]
    const people = [...new Set(src.match(PEOPLE) ?? [])]
    const notes: string[] = []
    if (vids.length) notes.push(`${vids.length} vídeo(s) enlazado(s): ` + vids.map((v) => `${v[3]} (${v[1].replace('https://www.youtube.com/watch?v=', 'yt:')})`).join('; '))
    if (people.length) notes.push(`menciona: ${people.join(', ')} (dato histórico)`)
    out.push(`| \`modules/${m}/${l}.mdx\` | Lección «${String(fm.title)}» (${String(fm.status)}) | redactado por IA, pendiente de revisión | ${notes.join(' — ') || '—'} | No se ha detectado (solo teoría y técnica general); texto no contrastado frase a frase con las fuentes de pedagogy.md | bajo | Revisión del autor${vids.length ? '; comprobar que los enlaces siguen vigentes' : ''} | |`)
    for (const e of (fm.exercises as string[] | undefined) ?? []) {
      const f = join(ROOT, 'exercises', `${e}.yaml`)
      if (!existsSync(f)) { out.push(`| \`exercises/${e}.yaml\` | **NO EXISTE** | DESCONOCIDO | | | | | |`); continue }
      seenEx.add(e)
      ne++
      const ex = parse(readFileSync(f, 'utf8')) as { title: string; status: string; alphaTex: string; tags?: string[] }
      const orig = /Ejercicio original/.test(ex.alphaTex)
      out.push(`| \`exercises/${e}.yaml\` | Ejercicio «${ex.title}» (${ex.status}) | redactado por IA, pendiente de revisión; subtítulo ${orig ? '«Ejercicio original»' : '**sin** «Ejercicio original»'} | — | Notación propia en alphaTex; no se ha comparado con ninguna obra concreta (NO VERIFICADO de oído) | bajo | Revisión del autor | |`)
    }
  }
}
const all = readdirSync(join(ROOT, 'exercises')).filter((f) => f.endsWith('.yaml')).map((f) => f.replace('.yaml', ''))
const orphan = all.filter((e) => !seenEx.has(e))
console.log(`<!-- lecciones: ${nl}; referencias a ejercicios: ${ne}; ejercicios en disco: ${all.length}; sin lección: ${orphan.join(', ') || 'ninguno'} -->`)
console.log(out.join('\n'))
