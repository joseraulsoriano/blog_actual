import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  esBorrador,
  getEntry,
  getRecuerdos,
  type RecuerdoMeta,
} from "@/lib/content";
import { etiquetaRecuerdo, textoRecuerdo } from "@/lib/recuerdos";
import { metaPagina } from "@/lib/seo";
import { PostCard } from "@/components/recuerdos/post-card";
import { BackLink, PageShell } from "@/components/site/page-shell";

export function generateStaticParams() {
  return getRecuerdos().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getEntry<RecuerdoMeta>("recuerdos", slug);
  if (!r) return {};
  const texto = textoRecuerdo(r);
  return metaPagina({
    title: etiquetaRecuerdo(r, 60),
    description: texto.slice(0, 160),
    path: `/recuerdos/${slug}`,
    tipo: "article",
    publicado: r.data.fecha,
  });
}

/**
 * Cada post tiene URL propia: antes esto era un redirect a /recuerdos#slug,
 * así que ningún recuerdo era compartible ni indexable por separado.
 */
export default async function RecuerdoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getEntry<RecuerdoMeta>("recuerdos", slug);
  if (!r || esBorrador(r.data)) notFound();

  return (
    <PageShell className="max-w-2xl">
      <article>
        <PostCard r={{ ...r, slug }} permalink={false} />
      </article>
      <BackLink href="/recuerdos" label="Todos los recuerdos" />
    </PageShell>
  );
}
