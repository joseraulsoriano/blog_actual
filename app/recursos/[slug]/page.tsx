import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  esBorrador,
  getEntry,
  getRecursos,
  type RecursoMeta,
} from "@/lib/content";
import { metaPagina, urlAbsoluta } from "@/lib/seo";
import { Prosa } from "@/components/retro/prosa";
import { BackLink, PageShell } from "@/components/site/page-shell";

export function generateStaticParams() {
  return getRecursos().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getEntry<RecursoMeta>("recursos", slug);
  if (!r) return {};
  return metaPagina({
    title: r.data.title,
    description: r.data.resumen,
    path: `/recursos/${slug}`,
    tipo: "article",
    publicado: r.data.fecha,
  });
}

export default async function RecursoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getEntry<RecursoMeta>("recursos", slug);
  if (!r || esBorrador(r.data)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "CreativeWork",
      name: r.data.title,
      ...(r.data.autor
        ? { author: { "@type": "Person", name: r.data.autor } }
        : {}),
      ...(r.data.enlace ? { url: r.data.enlace } : {}),
    },
    reviewBody: r.data.resumen,
    datePublished: r.data.fecha,
    author: { "@type": "Person", name: "José Raúl Soriano Cazabal" },
    url: urlAbsoluta(`/recursos/${slug}`),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        // El contenido lo escribo yo desde el panel, no viene de terceros.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {r.data.tipo}
        {r.data.autor ? (
          <>
            <span className="mx-2 text-white/30">·</span>
            {r.data.autor}
          </>
        ) : null}
      </p>

      <h1 className="mb-5 text-balance text-[clamp(1.9rem,4.8vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-primary neon-text">
        {r.data.title}
      </h1>

      <p className="mb-8 max-w-prose text-pretty text-lg leading-relaxed text-foreground/75">
        {r.data.resumen}
      </p>

      {r.data.enlace ? (
        <p className="mb-10">
          <a
            href={r.data.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-primary transition-colors hover:border-white/45"
          >
            Ir al recurso ↗
          </a>
        </p>
      ) : null}

      {r.content.trim() ? (
        <article className="max-w-prose">
          <Prosa source={r.content} />
        </article>
      ) : null}

      {r.data.tags?.length ? (
        <p className="mt-10 flex flex-wrap gap-2">
          {r.data.tags.map((t) => (
            <span
              key={t}
              className="border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </p>
      ) : null}

      <BackLink href="/recursos" label="Todos los recursos" />
    </PageShell>
  );
}
