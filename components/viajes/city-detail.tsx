"use client";

import Link from "next/link";
import type { ViajeEtapa } from "@/lib/content";
import type { CityRelated } from "@/lib/viajes/related";
import { MediaGallery } from "@/components/site/media-gallery";
import { cn } from "@/lib/utils";

const TIPO_LABEL: Record<string, string> = {
  hackathon: "Hackathon",
  concierto: "Concierto",
  conferencia: "Conferencia",
  etapa: "Etapa",
  recuerdo: "Recuerdo",
};

type TimelineItem = {
  key: string;
  sort: string;
  yearLabel: string;
  title: string;
  meta?: string;
  href?: string;
  kind: string;
};

function buildTimeline(
  etapas: ViajeEtapa[],
  related: CityRelated
): TimelineItem[] {
  const items: TimelineItem[] = [];

  for (const e of etapas) {
    const yearLabel =
      e.hasta && e.hasta !== e.año ? `${e.año}–${e.hasta}` : String(e.año);
    items.push({
      key: `etapa-${e.año}-${e.texto}`,
      sort: `${e.año}-00-00-etapa`,
      yearLabel,
      title: e.texto,
      href: e.href,
      kind: "etapa",
    });
  }

  for (const e of related.eventos) {
    items.push({
      key: `evento-${e.slug}`,
      sort: `${e.año}-06-01-evento-${e.slug}`,
      yearLabel: String(e.año),
      title: e.title,
      meta: TIPO_LABEL[e.tipo] ?? e.tipo,
      href: `/eventos/${e.slug}`,
      kind: e.tipo,
    });
  }

  // Recuerdos solo si no hay eventos (evita duplicar conciertos/hackathons)
  if (related.eventos.length === 0) {
    for (const r of related.recuerdos) {
      const y = r.fecha.slice(0, 4);
      items.push({
        key: `recuerdo-${r.slug}`,
        sort: `${r.fecha}-recuerdo`,
        yearLabel: y,
        title: r.title,
        meta: "Recuerdo",
        href: `/recuerdos#${r.slug}`,
        kind: "recuerdo",
      });
    }
  }

  return items.sort((a, b) => b.sort.localeCompare(a.sort));
}

type CityDetailProps = {
  ciudad: string;
  pais: string;
  año: number;
  resumen?: string;
  fotos: { src: string; alt: string }[];
  etapas: ViajeEtapa[];
  related: CityRelated;
  hideHeader?: boolean;
};

export function CityDetail({
  ciudad,
  pais,
  año,
  resumen,
  fotos,
  etapas,
  related,
  hideHeader,
}: CityDetailProps) {
  const timeline = buildTimeline(etapas, related);

  return (
    <div className="space-y-6">
      {!hideHeader ? (
        <header className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {pais} · desde {año}
          </p>
          <h2 className="text-[clamp(1.5rem,5vw,1.85rem)] font-semibold tracking-[-0.02em] text-primary">
            {ciudad}
          </h2>
          {resumen ? (
            <p className="text-sm text-muted-foreground">{resumen}</p>
          ) : null}
        </header>
      ) : resumen ? (
        <p className="text-sm text-muted-foreground">{resumen}</p>
      ) : null}

      {timeline.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sin entradas documentadas aún.
        </p>
      ) : (
        <ol className="relative m-0 list-none border-l border-white/20 pl-0">
          {timeline.map((item, i) => {
            const row = (
              <div className="flex gap-4 sm:gap-5">
                <time
                  className={cn(
                    "w-[4.5rem] shrink-0 pt-0.5 text-right font-mono text-xs tabular-nums tracking-wide text-muted-foreground sm:w-20 sm:text-sm",
                    item.href && "group-hover:text-foreground"
                  )}
                >
                  {item.yearLabel}
                </time>
                <div className="relative min-w-0 flex-1 pb-5 last:pb-0">
                  <span
                    className="absolute -left-[1.28rem] top-1.5 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_oklch(1_0_0_/_0.45)] sm:-left-[1.35rem]"
                    aria-hidden
                  />
                  <p
                    className={cn(
                      "text-[0.95rem] leading-snug text-primary sm:text-base",
                      item.href && "group-hover:underline group-hover:underline-offset-4"
                    )}
                  >
                    {item.title}
                  </p>
                  {item.meta ? (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {item.meta}
                    </p>
                  ) : null}
                </div>
              </div>
            );

            return (
              <li
                key={item.key}
                className={cn(
                  "relative pl-5 sm:pl-6",
                  i === timeline.length - 1 && "pb-0"
                )}
              >
                {item.href ? (
                  <Link href={item.href} className="group block min-h-11 py-1">
                    {row}
                  </Link>
                ) : (
                  <div className="py-1">{row}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <MediaGallery fotos={fotos} className="pt-2" />
    </div>
  );
}
