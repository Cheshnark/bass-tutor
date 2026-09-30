# Hoja de ruta

Detalle y justificación en [research.md §8](research.md). Trabaja **una fase (o un entregable) cada vez**.

| Fase | Entregables | Criterios de aceptación |
|---|---|---|
| **0. Especificación y andamiaje** | CLAUDE.md, docs, Vite+React+TS, lint, Vitest, Playwright, CI; PoC de alphaTab y metrónomo | `npm test` y `npm run build` en verde; la PoC renderiza tab + partitura y suena en Chrome Android y Safari iOS |
| **1. Herramientas núcleo** | Mástil SVG (4/5/6 cuerdas, zurdo, etiquetas), metrónomo completo (tap tempo, escalera de tempo), diccionario de escalas/arpegios con Tonal.js | Tests de notas por traste y afinación; metrónomo sin deriva en 10 min; zurdo = espejo exacto |
| **2. Motor de lecciones** | Esquema Zod, MDX con componentes, modo "siguiendo la clase", módulos 0–3 (~10 lecciones) | El build falla si el contenido no cumple el esquema; cada lección tiene objetivos, ejercicio y criterio; usable a 1 m |
| **3. Progreso + PWA offline** | IndexedDB, tempo limpio, `persist()`, service worker, manifest | Modo avión: todo el curso funciona; el progreso sobrevive a reinicios; Lighthouse ≥ 90 |
| **4. Práctica inteligente** | Repaso espaciado (Leitner), rutinas con alternancia, quiz de mástil | La cola diaria sale del historial; tests del algoritmo |
| **5. Audio avanzado** | Backing tracks, entrenamiento auditivo, afinador experimental | Afinador < ±3 cents con tono sintético; test en bajo real documentado por dispositivo |
| **6. Diseño "cabezal" y pulido** | Tema completo, pilotos, VU, modo atril, alto contraste | WCAG 2.2 AA; objetivos ≥ 24 px (≥ 48 px en controles principales) |
| **7. Contenido restante** | Módulos 4–12 | Revisión pedagógica por módulo |
| **8. (Opcional) Multiusuario** | Autenticación y sincronización | Solo si se decide publicar |
