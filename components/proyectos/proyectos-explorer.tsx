"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ProyectoCategoria } from "@/lib/content";
import { cn } from "@/lib/utils";

export type ProyectoListItem = {
  slug: string;
  title: string;
  resumen: string;
  categoria: ProyectoCategoria;
  año: number;
  origen?: string;
  enlace?: string;
};

const CATEGORIAS: { id: ProyectoCategoria; label: string }[] = [
  { id: "tech", label: "Tech" },
  { id: "hackathon", label: "Hackathon" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "hub", label: "Hubs" },
  { id: "producto", label: "Producto" },
  { id: "ia-arte", label: "IA + arte" },
  { id: "escrito", label: "Escrito" },
  { id: "libro", label: "Libro" },
  { id: "video", label: "Video" },
  { id: "ux", label: "UX" },
];

export function ProyectosExplorer({
  proyectos,
}: {
  proyectos: ProyectoListItem[];
}) {
  const [cat, setCat] = useState<ProyectoCategoria | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const detalleRef = useRef<HTMLElement>(null);

  const counts = useMemo(() => {
    const m = new Map<ProyectoCategoria, number>();
    for (const p of proyectos) {
      m.set(p.categoria, (m.get(p.categoria) ?? 0) + 1);
    }
    return m;
  }, [proyectos]);

  const deCategoria = useMemo(
    () => (cat ? proyectos.filter((p) => p.categoria === cat) : []),
    [proyectos, cat]
  );

  const activo = slug
    ? (proyectos.find((p) => p.slug === slug) ?? null)
    : null;

  useEffect(() => {
    if (!activo || !detalleRef.current) return;
    detalleRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activo]);

  function elegirCategoria(id: ProyectoCategoria) {
    setCat((prev) => (prev === id ? null : id));
    setSlug(null);
  }

  function elegirProyecto(s: string) {
    setSlug(s);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Categorías
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {proyectos.length} proyectos. Elige una categoría para ver la lista.
        </p>
        <ul className="flex flex-wrap gap-2" role="list">
          {CATEGORIAS.map((c) => {
            const n = counts.get(c.id) ?? 0;
            if (n === 0) return null;
            const active = cat === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => elegirCategoria(c.id)}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 border px-3.5 text-xs uppercase tracking-[0.14em] transition-colors",
                    active
                      ? "border-white/45 bg-white/[0.1] text-primary"
                      : "border-white/15 text-muted-foreground hover:border-white/30 hover:text-foreground"
                  )}
                >
                  {c.label}
                  <span className="tabular-nums text-white/35">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {cat ? (
        <div>
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {CATEGORIAS.find((c) => c.id === cat)?.label} · {deCategoria.length}
          </h2>
          <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {deCategoria.map((p) => {
              const on = slug === p.slug;
              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => elegirProyecto(p.slug)}
                    className={cn(
                      "flex w-full min-h-12 items-baseline justify-between gap-4 px-1 py-3.5 text-left transition-colors",
                      on
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary"
                    )}
                  >
                    <span className="text-base tracking-[-0.01em] sm:text-lg">
                      {p.title}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {p.año}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Selecciona una categoría para desplegar los proyectos.
        </p>
      )}

      {activo ? (
        <article
          ref={detalleRef}
          id={activo.slug}
          className="scroll-mt-24 border border-white/[0.12] bg-white/[0.02] p-5 sm:p-7"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {CATEGORIAS.find((c) => c.id === activo.categoria)?.label}
            {activo.origen ? ` · ${activo.origen}` : ""} · {activo.año}
          </p>
          <h3 className="mt-3 text-2xl tracking-[-0.02em] text-primary neon-text sm:text-3xl">
            {activo.title}
          </h3>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-foreground/80 sm:text-base">
            {activo.resumen}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={`/proyectos/${activo.slug}`}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Leer ficha completa →
            </Link>
            {activo.enlace ? (
              <a
                href={activo.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Enlace externo
              </a>
            ) : null}
          </div>
        </article>
      ) : null}
    </div>
  );
}
