import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntry } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import { PageHeader, PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Bio",
  description:
    "Quién es José Raúl Soriano: biografía, formación, certificaciones y redes.",
};

export default function BioPage() {
  const bio = getEntry<{ title: string }>("paginas", "bio");
  if (!bio) notFound();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Sobre mí"
        title={bio.data.title || "Bio"}
        lede="Un poco de contexto antes de mirar el resto del legado."
      />
      <article className="max-w-prose">
        <MDXRemote source={bio.content} components={mdxComponents} />
      </article>
    </PageShell>
  );
}
