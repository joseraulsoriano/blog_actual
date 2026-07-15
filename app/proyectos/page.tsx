import type { Metadata } from "next";
import Link from "next/link";
import { getProyectos } from "@/lib/content";
import { PromptLine } from "@/components/retro/terminal-window";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos de José Raúl Soriano: hackathons, web, IA + arte, UX y escritos.",
};

const categorias: Record<string, string> = {
  web: "WEB",
  hackathon: "HACK",
  escrito: "TXT",
  "ia-arte": "IA+ART",
  ux: "UX",
};

export default function ProyectosPage() {
  const proyectos = getProyectos();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PromptLine command="ls -la ~/proyectos/" className="mb-2" />
      <p className="mb-8 text-sm text-muted-foreground">
        total {proyectos.length} — de escritos íntimos a apps de hackathon.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {proyectos.map((p) => (
          <Link
            key={p.slug}
            href={`/proyectos/${p.slug}`}
            className="group border border-border bg-card p-4 transition-colors hover:border-primary/60"
          >
            <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>drwxr--r-- {p.data.año}</span>
              <Badge variant="outline">{categorias[p.data.categoria]}</Badge>
            </div>
            <h2 className="terminal-glow font-semibold text-primary group-hover:cursor-blink">
              {p.data.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {p.data.resumen}
            </p>
            {p.data.origen ? (
              <p className="mt-3 text-xs text-accent"># {p.data.origen}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
