import type { Metadata } from "next";
import { getRecuerdos } from "@/lib/content";
import { PostCard } from "@/components/recuerdos/post-card";
import { PageHeader, PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Recuerdos",
  description:
    "Momentos cortos del legado de José Raúl Soriano.",
};

export default function RecuerdosPage() {
  const posts = getRecuerdos();

  return (
    <PageShell className="max-w-2xl">
      <PageHeader
        eyebrow="Archivo vivo"
        title="Recuerdos"
        lede="Notas breves. Lo que publico desde el área privada."
        className="mb-10 sm:mb-12"
      />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay posts.</p>
      ) : (
        <div className="divide-y divide-white/[0.07]">
          {posts.map((r) => (
            <PostCard key={r.slug} r={r} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
