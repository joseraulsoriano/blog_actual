import type { Metadata } from "next";
import Link from "next/link";
import { getEventos, type EventoMeta, type Entry } from "@/lib/content";
import { PageHeader, PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Conferencias y conciertos en la vida de José Raúl Soriano.",
};

function Estrellas({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <span className="text-xs tracking-widest text-primary/80" aria-label={`${value} de 5`}>
      {"★".repeat(filled)}
      <span className="text-white/25">{"★".repeat(5 - filled)}</span>
    </span>
  );
}

function FilaEvento({ e }: { e: Entry<EventoMeta> }) {
  return (
    <Link
      href={`/eventos/${e.slug}`}
      className="group block border-b border-white/[0.08] py-5 transition-colors first:pt-0 last:border-0 hover:bg-white/[0.02]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="text-lg tracking-[-0.01em] text-primary group-hover:underline group-hover:underline-offset-4 sm:text-xl">
          {e.data.title}
        </h3>
        {typeof e.data.calificacion === "number" ? (
          <Estrellas value={e.data.calificacion} />
        ) : (
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Próximamente
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {e.data.lugar} · {e.data.año}
      </p>
      {e.data.resumen ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/75">
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
    <PageShell>
      <PageHeader
        eyebrow="Agenda vivida"
        title="Eventos"
        lede="Conferencias y las noches que todavía resuenan. Los hackathons viven en Proyectos."
      />

      {tech.length > 0 ? (
        <section className="mb-14" aria-labelledby="tech-heading">
          <h2
            id="tech-heading"
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
          >
            Conferencias
          </h2>
          <div>
            {tech.map((e) => (
              <FilaEvento key={e.slug} e={e} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="conciertos-heading">
        <h2
          id="conciertos-heading"
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
        >
          Conciertos
        </h2>
        <div>
          {conciertos.map((e) => (
            <FilaEvento key={e.slug} e={e} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
