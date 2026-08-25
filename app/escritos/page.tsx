import type { Metadata } from "next";
import Link from "next/link";
import { getEscritos, minutosLectura } from "@/lib/content";
import { metaPagina } from "@/lib/seo";
import { PageHeader, PageShell } from "@/components/site/page-shell";
import { EstadoVacio } from "@/components/site/estado-vacio";

export const metadata: Metadata = metaPagina({
  title: "Escritos",
  description:
    "Artículos técnicos: arquitectura, Next.js, Django, cloud y las decisiones detrás de cada proyecto.",
  path: "/escritos",
});

function formatFecha(fecha: string): string {
  const d = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(d.getTime())) return fecha;
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function EscritosPage() {
  const escritos = getEscritos();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Técnico"
        title="Escritos"
        lede="Lo que aprendí resolviendo problemas reales, con el código y las decisiones que costaron."
      />

      {escritos.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hay nada escrito."
          detalle="Los artículos se publican desde el archivo privado. El primero está pendiente."
        />
      ) : (
        <ul role="list" className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {escritos.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/escritos/${e.slug}`}
                className="group block py-7 transition-colors hover:bg-white/[0.02]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <time dateTime={e.data.fecha}>{formatFecha(e.data.fecha)}</time>
                  <span className="mx-2 text-white/25">·</span>
                  {minutosLectura(e.content)} min
                </p>

                <h2 className="mt-3 text-pretty text-xl leading-snug tracking-[-0.02em] text-primary group-hover:neon-text sm:text-2xl">
                  {e.data.title}
                </h2>

                <p className="mt-2.5 max-w-prose text-pretty leading-relaxed text-foreground/75">
                  {e.data.resumen}
                </p>

                {e.data.tags?.length ? (
                  <p className="mt-3 flex flex-wrap gap-2">
                    {e.data.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
