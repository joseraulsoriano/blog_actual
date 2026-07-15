import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntry, getProyectos, type ProyectoMeta } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import { PromptLine, TerminalWindow } from "@/components/retro/terminal-window";

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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PromptLine command={`cat ~/proyectos/${slug}.mdx`} className="mb-4" />
      <TerminalWindow title={`${p.data.title} · ${p.data.año}`}>
        {p.data.origen ? (
          <p className="mb-4 text-xs text-accent"># {p.data.origen}</p>
        ) : null}
        <article>
          <MDXRemote source={p.content} components={mdxComponents} />
        </article>
        {p.data.enlace ? (
          <p className="mt-6 text-sm">
            <span className="text-muted-foreground">└─ enlace:</span>{" "}
            <a
              href={p.data.enlace}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline underline-offset-4 hover:text-primary"
            >
              {p.data.enlace}
            </a>
          </p>
        ) : null}
      </TerminalWindow>
      <p className="mt-6 text-sm">
        <Link
          href="/proyectos"
          className="text-muted-foreground hover:text-foreground"
        >
          ← cd ~/proyectos/
        </Link>
      </p>
    </div>
  );
}
