import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntry } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import { PromptLine, TerminalWindow } from "@/components/retro/terminal-window";

export const metadata: Metadata = {
  title: "Bio",
  description:
    "Quién es José Raúl Soriano: biografía, formación, certificaciones y redes.",
};

export default function BioPage() {
  const bio = getEntry<{ title: string }>("paginas", "bio");
  if (!bio) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PromptLine command="cat ~/bio.mdx" className="mb-4" />
      <TerminalWindow title="bio.mdx — chasse">
        <article>
          <MDXRemote source={bio.content} components={mdxComponents} />
        </article>
      </TerminalWindow>
    </div>
  );
}
