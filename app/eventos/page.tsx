import type { Metadata } from "next";
import Link from "next/link";
import { getEventos, type EventoMeta, type Entry } from "@/lib/content";
import { EstadoVacio } from "@/components/site/estado-vacio";
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

function TarjetaEvento({ e }: { e: Entry<EventoMeta> }) {
  return (
    <li>
      <Link
        href={`/eventos/${e.slug}`}
        className="group flex h-full flex-col border border-white/[0.12] bg-white/[0.02] p-5 transition-colors hover:border-white/35 hover:bg-white/[0.05]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {e.data.lugar}
          <span className="float-right tabular-nums text-white/55">
            {e.data.año}
          </span>
        </p>

        <h3 className="mt-3 text-pretty text-lg leading-snug tracking-[-0.02em] text-primary group-hover:neon-text sm:text-xl">
          {e.data.title}
        </h3>

        {e.data.resumen ? (
          <p className="mt-2.5 line-clamp-3 text-pretty text-sm leading-relaxed text-foreground/70">
            {e.data.resumen}
          </p>
        ) : null}

        <p className="mt-4 flex items-center justify-between pt-1">
          {typeof e.data.calificacion === "number" ? (
            <Estrellas value={e.data.calificacion} />
          ) : (
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/55">
              Sin calificar
            </span>
          )}
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/55 transition-colors group-hover:text-primary">
            Ver →
          </span>
        </p>
      </Link>
    </li>
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
          <ul role="list" className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {tech.map((e) => (
              <TarjetaEvento key={e.slug} e={e} />
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="conciertos-heading">
        <h2
          id="conciertos-heading"
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
        >
          Conciertos
        </h2>
        <ul role="list" className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {conciertos.map((e) => (
            <TarjetaEvento key={e.slug} e={e} />
          ))}
        </ul>
        {conciertos.length === 0 ? (
          <EstadoVacio titulo="Ninguna noche registrada todavía." />
        ) : null}
      </section>
    </PageShell>
  );
}
