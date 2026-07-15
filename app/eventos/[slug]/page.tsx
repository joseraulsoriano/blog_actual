import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntry, getEventos, type EventoMeta } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import {
  AsciiBar,
  PromptLine,
  TerminalWindow,
} from "@/components/retro/terminal-window";

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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PromptLine command={`cat ~/eventos/${slug}.mdx`} className="mb-4" />
      <TerminalWindow title={`${e.data.title} · ${e.data.lugar} · ${e.data.año}`}>
        {typeof e.data.calificacion === "number" ? (
          <p className="mb-4">
            <AsciiBar
              value={e.data.calificacion}
              label={`calificación: ${e.data.calificacion.toFixed(1)}/5`}
            />
          </p>
        ) : null}
        <article>
          <MDXRemote source={e.content} components={mdxComponents} />
        </article>
      </TerminalWindow>
      <p className="mt-6 text-sm">
        <Link
          href="/eventos"
          className="text-muted-foreground hover:text-foreground"
        >
          ← cd ~/eventos/
        </Link>
      </p>
    </div>
  );
}
