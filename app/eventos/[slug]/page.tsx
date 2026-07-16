import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntry, getEventos, type EventoMeta } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import { PageShell } from "@/components/site/page-shell";

export function generateStaticParams() {
  return getEventos().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntry<EventoMeta>("eventos", slug);
  if (!e) return {};
  return { title: e.data.title, description: e.data.resumen };
}

export default async function EventoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getEntry<EventoMeta>("eventos", slug);
  if (!e) notFound();

  return (
    <PageShell>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        {e.data.lugar} · {e.data.año}
        {typeof e.data.calificacion === "number"
          ? ` · ${e.data.calificacion.toFixed(1)}/5`
          : ""}
      </p>
      <h1 className="mb-8 text-balance text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-primary neon-text">
        {e.data.title}
      </h1>
      <article className="max-w-prose">
        <MDXRemote source={e.content} components={mdxComponents} />
      </article>
    </PageShell>
  );
}
