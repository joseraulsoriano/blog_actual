import type { Metadata } from "next";
import Link from "next/link";
import { getEventos, type EventoMeta, type Entry } from "@/lib/content";
import { AsciiBar, PromptLine } from "@/components/retro/terminal-window";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Hackathons, conferencias y conciertos en la vida de José Raúl Soriano.",
};

function FilaEvento({ e }: { e: Entry<EventoMeta> }) {
  return (
    <Link
      href={`/eventos/${e.slug}`}
      className="group block border border-border bg-card p-4 transition-colors hover:border-primary/60"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="terminal-glow font-semibold text-primary">
          {e.data.title}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {e.data.año}
          </span>
        </h3>
        {typeof e.data.calificacion === "number" ? (
          <AsciiBar
            value={e.data.calificacion}
            label={`${e.data.calificacion.toFixed(1)}/5`}
          />
        ) : (
          <span className="text-sm text-accent">[ próximamente ]</span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">@ {e.data.lugar}</p>
      {e.data.resumen ? (
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {e.data.resumen}
        </p>
      ) : null}
    </Link>
  );
}

export default function EventosPage() {
  const eventos = getEventos();
  const tech = eventos.filter((e) => e.data.tipo !== "concierto");
  const conciertos = eventos.filter((e) => e.data.tipo === "concierto");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PromptLine command="ls ~/eventos/ --sort=fecha" className="mb-8" />

      <h2 className="terminal-glow mb-4 text-lg font-semibold text-primary">
        <span className="text-accent">##</span> Hackathons &amp; tech
      </h2>
      <div className="mb-10 space-y-3">
        {tech.map((e) => (
          <FilaEvento key={e.slug} e={e} />
        ))}
      </div>

      <h2 className="terminal-glow mb-4 text-lg font-semibold text-primary">
        <span className="text-accent">##</span> Conciertos
      </h2>
      <div className="space-y-3">
        {conciertos.map((e) => (
          <FilaEvento key={e.slug} e={e} />
        ))}
      </div>
    </div>
  );
}
