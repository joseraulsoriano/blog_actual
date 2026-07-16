import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntry, getProyectos, type ProyectoMeta } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import { PageShell } from "@/components/site/page-shell";

export function generateStaticParams() {
  return getProyectos().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getEntry<ProyectoMeta>("proyectos", slug);
  if (!p) return {};
  return { title: p.data.title, description: p.data.resumen };
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getEntry<ProyectoMeta>("proyectos", slug);
  if (!p) notFound();

  return (
    <PageShell>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        Proyecto · {p.data.año}
        {p.data.origen ? ` · ${p.data.origen}` : ""}
      </p>
      <h1 className="mb-8 text-balance text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-primary neon-text">
        {p.data.title}
      </h1>
      <article className="max-w-prose">
        <MDXRemote source={p.content} components={mdxComponents} />
      </article>
      {p.data.enlace ? (
        <p className="mt-8 text-sm">
          <a
            href={p.data.enlace}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
          >
            Visitar enlace
          </a>
        </p>
      ) : null}
    </PageShell>
  );
}
