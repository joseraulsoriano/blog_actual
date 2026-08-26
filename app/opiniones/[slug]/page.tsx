import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  esBorrador,
  getEntry,
  getOpiniones,
  minutosLectura,
  type OpinionMeta,
} from "@/lib/content";
import { metaPagina, urlAbsoluta } from "@/lib/seo";
import { Prosa } from "@/components/retro/prosa";
import { BackLink, PageShell } from "@/components/site/page-shell";

export function generateStaticParams() {
  return getOpiniones().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const o = getEntry<OpinionMeta>("opiniones", slug);
  if (!o) return {};
  return metaPagina({
    title: o.data.title,
    description: o.data.resumen,
    path: `/opiniones/${slug}`,
    tipo: "article",
    publicado: o.data.fecha,
  });
}

export default async function OpinionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = getEntry<OpinionMeta>("opiniones", slug);
  if (!o || esBorrador(o.data)) notFound();

  const fecha = new Date(`${o.data.fecha}T12:00:00`);
  const fechaLegible = Number.isNaN(fecha.getTime())
    ? o.data.fecha
    : new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(fecha);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OpinionNewsArticle",
    headline: o.data.title,
    description: o.data.resumen,
    datePublished: o.data.fecha,
    author: { "@type": "Person", name: "José Raúl Soriano Cazabal" },
    url: urlAbsoluta(`/opiniones/${slug}`),
    keywords: o.data.tags?.join(", "),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        // El contenido lo escribo yo desde el panel, no viene de terceros.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <time dateTime={o.data.fecha}>{fechaLegible}</time>
        <span className="mx-2 text-white/30">·</span>
        {minutosLectura(o.content)} min de lectura
        {o.data.tema ? (
          <>
            <span className="mx-2 text-white/30">·</span>
            {o.data.tema}
          </>
        ) : null}
      </p>

      <h1 className="mb-5 text-balance text-[clamp(1.9rem,4.8vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-primary neon-text">
        {o.data.title}
      </h1>

      <p className="mb-10 max-w-prose text-pretty text-lg leading-relaxed text-foreground/75">
        {o.data.resumen}
      </p>

      <article className="max-w-prose">
        <Prosa source={o.content} />
      </article>

      {o.data.tags?.length ? (
        <p className="mt-10 flex flex-wrap gap-2">
          {o.data.tags.map((t) => (
            <span
              key={t}
              className="border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </p>
      ) : null}

      <p className="mt-10 border-t border-white/[0.08] pt-6 text-sm text-muted-foreground">
        Esto es lo que pienso hoy.{" "}
        <Link
          href="/proponer"
          className="text-primary underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
        >
          Convénceme de lo contrario
        </Link>
        .
      </p>

      <BackLink href="/opiniones" label="Todas las opiniones" />
    </PageShell>
  );
}
