# Plan de refactorización — Blog of Chasse: 2021 → 2026

> Objetivo: transformar `blog_actual` en un **legado digital** — mezcla de blog y red social personal — preservando la versión original como pieza histórica y construyendo la nueva versión con Next.js como framework full-stack único (sin backend aparte).

---

## 1. Estrategia de versiones

El blog viejo no se borra: **se empaqueta como "Versión 2021"** y queda navegable dentro del sitio nuevo, como primera pieza del museo del legado digital.

| Versión | Qué es | Dónde vive |
|---|---|---|
| **2021** | Blog actual (HTML + Bootstrap 5 + jQuery) congelado tal cual | `public/2021/` — accesible en `/2021/index.html` |
| **2026** | Blog nuevo (Next.js 16 full-stack) | Raíz del repo, sirve todo el sitio |

Pasos de empaquetado:

1. `git tag v2021` sobre el último commit del blog viejo (respaldo permanente en el historial).
2. Mover `index.html`, `bio_info.html`, `proyectos.html`, `eventos.html`, `redes.html`, `viaje.html` y `assets/` a `public/2021/` (las rutas relativas de assets siguen funcionando sin tocar nada).
3. Añadir un banner mínimo "Estás viendo la versión 2021 — volver a 2026" inyectado con un `<script>` pequeño, sin modificar el contenido original.
4. En el sitio nuevo, una entrada tipo "cápsula del tiempo" en el timeline que enlaza a `/2021`.

## 2. Stack de la versión 2026 (Next.js full-stack, cero backend externo)

| Área | Elección | Nota |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript + pnpm** | Mismo stack que el portafolio; Route Handlers y Server Actions cubren todo lo que haría un backend |
| UI | **Tailwind CSS + shadcn/ui (Radix)** | Dark mode, accesibilidad, componentes compartibles con el portafolio |
| Animación | **Motion + GSAP** | El dinamismo pedido; ya se dominan del portafolio |
| Contenido | **MDX en el repo** (`content/`) | Los recuerdos viven en Git, versionados — sin CMS de terceros que pueda desaparecer |
| Media | `next/image` + **Vercel Blob** para fotos | Optimización automática, blur placeholders |
| Auth (sección privada) | **Auth.js v5** con middleware sobre `/privado/*` | Corre dentro de Next (Route Handlers) — sigue sin haber backend aparte |
| Deploy | **Vercel** | Mismo flujo que el portafolio |

## 3. Arquitectura de rutas

```
app/
├── page.tsx                  → Home: timeline público (feed estilo red social)
├── bio/                      → Biografía (migrada de bio_info.html)
├── proyectos/                → Proyectos (migrados + actualizados)
├── eventos/                  → Eventos (migrados)
├── viajes/                   → Mapa de viajes interactivo (recupera "Viajando por el mundo")
├── recuerdos/[slug]/         → Post/recuerdo individual (MDX)
├── privado/                  → Sección privada (middleware + Auth.js, noindex, fuera del sitemap)
│   └── ...                   → Mismo timeline "expandido" con recuerdos privados
├── api/auth/[...nextauth]/   → Único endpoint de servidor (Auth.js)
├── sitemap.ts / robots.ts / manifest.ts
├── opengraph-image.tsx       → OG images generadas por post
└── rss.xml/route.ts          → Feed RSS/Atom

content/
├── recuerdos/*.mdx           → Posts públicos (frontmatter: fecha, tags, ubicación, fotos)
└── privado/*.mdx             → Posts privados (solo render en servidor, nunca en bundle público)
```

**Componentes clave**: Timeline de recuerdos (corazón del sitio), galería con lightbox (adiós fancybox/jQuery), mapa de viajes, tarjetas con tags + búsqueda (Pagefind), toggle público/privado al iniciar sesión, barra de progreso de lectura, comentarios opcionales con giscus.

## 4. SEO

- Metadata API por página + **JSON-LD** (`Person` para José, `BlogPosting` por recuerdo)
- `sitemap.ts`, `robots.ts`, canonical URLs, feed RSS
- OG image dinámica por post (patrón ya probado en el portafolio)
- SSG/ISR para todo lo público; `noindex` + exclusión de sitemap para `/privado` y `/2021`
- `next/font`, imágenes optimizadas → Core Web Vitals verdes

## 5. Skill/Agente "José" (dos versiones, bilingüe ES/EN)

José es prácticamente un agente con cuatro capacidades: **redactar en tu voz, mantener el blog, responder como José y curar recuerdos**. Español por defecto, inglés cuando el interlocutor lo use.

### Estructura

```
.claude/
├── skills/jose/
│   ├── SKILL.md              → Instrucciones: voz, tono, capacidades, convenciones MDX del repo
│   └── references/
│       ├── BIO.md            → Documento maestro manual (lo escribes/apruebas tú)
│       ├── voz-y-estilo.md   → Auto-generado del portafolio y blog viejo, curado por ti
│       ├── proyectos.md      → Auto-generado, curado por ti
│       └── arquitectura.md   → Cómo está construido el blog (para la capacidad "mantener")
├── skills/jose/private/      → ⛔ .gitignore — contexto sensible, solo existe en tu máquina
└── agents/jose.md            → Definición de agente (persona José) que usa las referencias de la skill
```

### Las dos versiones

1. **Completa (en el repo, uso tuyo)**: todo lo anterior, incluida la carpeta `private/` local.
2. **Pública descargable (`dist-skill/jose/`)**: se genera con un script (`pnpm build:skill`) que copia la skill excluyendo `private/` y cualquier referencia marcada `<!-- privado -->`. Empaquetable como zip o repo aparte para que cualquiera la instale en su Claude Code y converse con el "José digital".

### Flujo de conocimiento (auto-generado + doc manual)

1. Extracción automática: bio, proyectos y estilo de escritura desde el portafolio y el HTML 2021 → archivos de `references/`.
2. Tú escribes/corriges `BIO.md` una vez (fuente de verdad manual).
3. Regla dura: nada de la sección privada del blog ni de `private/` entra jamás a la versión descargable.

## 6. Fases de ejecución

| Fase | Trabajo | Resultado verificable |
|---|---|---|
| **0. Congelar 2021** | `git tag v2021`, mover HTML+assets a `public/2021/` | El blog viejo abre intacto en `/2021/index.html` |
| **1. Scaffold 2026** | Next.js 16 + TS + Tailwind + shadcn + estructura de rutas | `pnpm dev` sirve home vacía + `/2021` |
| **2. Migración de contenido** | bio, proyectos, eventos → MDX; fotos a `public/`/Blob | Secciones públicas completas y responsivas |
| **3. Timeline + viajes** | Feed de recuerdos, galería, mapa | Home dinámica con animaciones |
| **4. Sección privada** | Auth.js, middleware, contenido privado server-only | Login funciona; privado invisible sin sesión |
| **5. SEO + performance** | JSON-LD, RSS, OG images, Lighthouse | Lighthouse ≥ 95 en las 4 métricas |
| **6. Skill José** | Extracción de conocimiento, SKILL.md, agente, script de empaquetado | `/jose` funciona; `pnpm build:skill` genera la versión pública limpia |

Estrategia git: rama `feature/2026` para las fases 0–5, merge a `main` cuando `/2021` y el sitio nuevo convivan; la skill (fase 6) puede ir en paralelo.

---

*Plan creado el 2026-07-15. La versión 2021 nunca se modifica: es la primera pieza del legado.*
