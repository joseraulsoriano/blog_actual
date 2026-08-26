import type { Metadata } from "next";
import Link from "next/link";
import { getOpiniones } from "@/lib/content";
import { metaPagina } from "@/lib/seo";
import { EstadoVacio } from "@/components/site/estado-vacio";
import { PageHeader, PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = metaPagina({
  title: "Opiniones",
  description:
    "Posturas firmadas y fechadas sobre tecnología, industria y educación.",
  path: "/opiniones",
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

export default function OpinionesPage() {
  const opiniones = getOpiniones();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Postura"
        title="Opiniones"
        lede="Lo que pienso hoy, con fecha encima. Si dentro de tres años me contradice, la fecha explica por qué."
      />

      {opiniones.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no he firmado ninguna opinión."
          detalle="Se publican desde el archivo privado. La primera está por venir."
        />
      ) : (
        <ul
          role="list"
          className="divide-y divide-white/[0.07] border-y border-white/[0.07]"
        >
          {opiniones.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/opiniones/${o.slug}`}
                className="group block py-7 transition-colors hover:bg-white/[0.02]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <time dateTime={o.data.fecha}>
                    {formatFecha(o.data.fecha)}
                  </time>
                  {o.data.tema ? (
                    <>
                      <span className="mx-2 text-white/25">·</span>
                      {o.data.tema}
                    </>
                  ) : null}
                </p>

                <h2 className="mt-3 text-pretty text-xl leading-snug tracking-[-0.02em] text-primary group-hover:neon-text sm:text-2xl">
                  {o.data.title}
                </h2>

                <p className="mt-2.5 max-w-prose text-pretty leading-relaxed text-foreground/75">
                  {o.data.resumen}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
