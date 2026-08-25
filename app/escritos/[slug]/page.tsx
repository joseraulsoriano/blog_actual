import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEntry,
  getEscritos,
  minutosLectura,
  type EscritoMeta,
} from "@/lib/content";
import { metaPagina, urlAbsoluta } from "@/lib/seo";
import { Prosa } from "@/components/retro/prosa";
import { MediaGallery } from "@/components/site/media-gallery";
import { BackLink, PageShell } from "@/components/site/page-shell";

export function generateStaticParams() {
  return getEscritos().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntry<EscritoMeta>("escritos", slug);
  if (!e) return {};
  return metaPagina({
    title: e.data.title,
    description: e.data.resumen,
    path: `/escritos/${slug}`,
    tipo: "article",
    publicado: e.data.fecha,
  });
}

export default async function EscritoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getEntry<EscritoMeta>("escritos", slug);
  if (!e) notFound();

  const fecha = new Date(`${e.data.fecha}T12:00:00`);
  const fechaLegible = Number.isNaN(fecha.getTime())
    ? e.data.fecha
    : new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(fecha);

  // Datos estructurados: así entiende Google que esto es un artículo.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: e.data.title,
    description: e.data.resumen,
    datePublished: e.data.fecha,
    author: { "@type": "Person", name: "José Raúl Soriano Cazabal" },
    url: urlAbsoluta(`/escritos/${slug}`),
    keywords: e.data.tags?.join(", "),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        // El contenido lo escribo yo desde el panel, no viene de terceros.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <time dateTime={e.data.fecha}>{fechaLegible}</time>
        <span className="mx-2 text-white/30">·</span>
        {minutosLectura(e.content)} min de lectura
      </p>

      <h1 className="mb-5 text-balance text-[clamp(1.9rem,4.8vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-primary neon-text">
        {e.data.title}
      </h1>

      <p className="mb-10 max-w-prose text-pretty text-lg leading-relaxed text-foreground/75">
        {e.data.resumen}
      </p>

      <MediaGallery fotos={e.data.portada ?? []} className="mb-10" />

      <article className="max-w-prose">
        <Prosa source={e.content} />
      </article>

      {e.data.tags?.length ? (
        <p className="mt-10 flex flex-wrap gap-2">
          {e.data.tags.map((t) => (
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
        ¿Te sirvió o lo harías distinto?{" "}
        <Link
          href="/proponer"
          className="text-primary underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
        >
          Cuéntamelo
        </Link>
        .
      </p>

      <BackLink href="/escritos" label="Todos los escritos" />
    </PageShell>
  );
}
