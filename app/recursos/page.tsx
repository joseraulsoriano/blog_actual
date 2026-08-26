import type { Metadata } from "next";
import Link from "next/link";
import {
  getRecursos,
  type Entry,
  type RecursoMeta,
  type RecursoTipo,
} from "@/lib/content";
import { metaPagina } from "@/lib/seo";
import { EstadoVacio } from "@/components/site/estado-vacio";
import { PageHeader, PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = metaPagina({
  title: "Recursos",
  description:
    "Libros, cursos, herramientas y repos que sí valieron la pena, con el porqué.",
  path: "/recursos",
});

/** Orden de las secciones; lo que no esté aquí cae al final. */
const GRUPOS: { tipo: RecursoTipo; titulo: string }[] = [
  { tipo: "libro", titulo: "Libros" },
  { tipo: "curso", titulo: "Cursos" },
  { tipo: "herramienta", titulo: "Herramientas" },
  { tipo: "repo", titulo: "Repos" },
  { tipo: "articulo", titulo: "Artículos" },
  { tipo: "video", titulo: "Videos" },
  { tipo: "podcast", titulo: "Podcasts" },
];

function TarjetaRecurso({ r }: { r: Entry<RecursoMeta> }) {
  return (
    <li className="border border-white/[0.12] bg-white/[0.02] p-5 transition-colors hover:border-white/25">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {r.data.tipo}
        {r.data.autor ? (
          <>
            <span className="mx-2 text-white/25">·</span>
            {r.data.autor}
          </>
        ) : null}
      </p>

      <h3 className="mt-3 text-pretty text-lg leading-snug tracking-[-0.02em] text-primary">
        <Link href={`/recursos/${r.slug}`} className="hover:neon-text">
          {r.data.title}
        </Link>
      </h3>

      <p className="mt-2.5 text-pretty text-sm leading-relaxed text-foreground/70">
        {r.data.resumen}
      </p>

      <p className="mt-4 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.16em] text-white/55">
        <Link
          href={`/recursos/${r.slug}`}
          className="transition-colors hover:text-primary"
        >
          Mis notas →
        </Link>
        {r.data.enlace ? (
          <a
            href={r.data.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Ir al recurso ↗
          </a>
        ) : null}
      </p>
    </li>
  );
}

export default function RecursosPage() {
  const recursos = getRecursos();
  const secciones = GRUPOS.map((g) => ({
    ...g,
    items: recursos.filter((r) => r.data.tipo === g.tipo),
  })).filter((g) => g.items.length > 0);

  const sueltos = recursos.filter(
    (r) => !GRUPOS.some((g) => g.tipo === r.data.tipo)
  );

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Biblioteca"
        title="Recursos"
        lede="Lo que de verdad me sirvió: libros, cursos, herramientas y repos, con el contexto de por qué."
      />

      {recursos.length === 0 ? (
        <EstadoVacio
          titulo="La biblioteca está vacía."
          detalle="Los recursos se publican desde el archivo privado."
        />
      ) : (
        <div className="space-y-14">
          {secciones.map((s) => (
            <section key={s.tipo} aria-labelledby={`${s.tipo}-heading`}>
              <h2
                id={`${s.tipo}-heading`}
                className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
              >
                {s.titulo}
                <span className="ml-2 tabular-nums text-white/35">
                  {s.items.length}
                </span>
              </h2>
              <ul role="list" className="grid gap-4 sm:grid-cols-2">
                {s.items.map((r) => (
                  <TarjetaRecurso key={r.slug} r={r} />
                ))}
              </ul>
            </section>
          ))}

          {sueltos.length > 0 ? (
            <section aria-labelledby="otros-heading">
              <h2
                id="otros-heading"
                className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
              >
                Otros
              </h2>
              <ul role="list" className="grid gap-4 sm:grid-cols-2">
                {sueltos.map((r) => (
                  <TarjetaRecurso key={r.slug} r={r} />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </PageShell>
  );
}
