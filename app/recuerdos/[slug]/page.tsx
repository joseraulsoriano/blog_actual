import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntry, getRecuerdos, type RecuerdoMeta } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import { PromptLine, TerminalWindow } from "@/components/retro/terminal-window";

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
  return { title: r.data.title, description: r.data.resumen };
}

export default async function RecuerdoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getEntry<RecuerdoMeta>("recuerdos", slug);
  if (!r) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PromptLine command={`git show legado/${slug}`} className="mb-4" />
      <TerminalWindow title={`${r.data.fecha} · ${r.data.tipo}`}>
        <h1 className="terminal-glow mb-4 text-xl font-semibold text-primary">
          {r.data.title}
        </h1>
        <article>
          <MDXRemote source={r.content} components={mdxComponents} />
        </article>
        {r.data.enlace ? (
          <p className="mt-6 text-sm">
            <span className="text-muted-foreground">└─ relacionado:</span>{" "}
            <Link
              href={r.data.enlace}
              className="text-accent underline underline-offset-4 hover:text-primary"
            >
              {r.data.enlace}
            </Link>
          </p>
        ) : null}
      </TerminalWindow>
      <p className="mt-6 text-sm">
        <Link
          href="/recuerdos"
          className="text-muted-foreground hover:text-foreground"
        >
          ← cd ~/recuerdos/
        </Link>
      </p>
    </div>
  );
}
