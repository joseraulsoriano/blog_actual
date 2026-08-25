"use client";

import { useMemo, useState } from "react";
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

const LABEL = new Map(CATEGORIAS.map((c) => [c.id, c.label]));

/** Sin acentos ni mayúsculas: "diseño" encuentra "Diseno". */
function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Chip({
  activo,
  onClick,
  children,
  n,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
  n: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 border px-3.5 text-xs uppercase tracking-[0.14em] transition-colors",
        activo
          ? "border-white/45 bg-white/[0.1] text-primary"
          : "border-white/15 text-muted-foreground hover:border-white/30 hover:text-foreground"
      )}
    >
      {children}
      <span className="tabular-nums text-white/55">{n}</span>
    </button>
  );
}

function TarjetaProyecto({ p }: { p: ProyectoListItem }) {
  return (
    <li>
      <Link
        href={`/proyectos/${p.slug}`}
        className={cn(
          "group flex h-full flex-col border border-white/[0.12] bg-white/[0.02] p-5",
          "transition-colors hover:border-white/35 hover:bg-white/[0.05]"
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {LABEL.get(p.categoria) ?? p.categoria}
          <span className="float-right tabular-nums text-white/55">
            {p.año}
          </span>
        </p>

        <h3 className="mt-3 text-pretty text-lg leading-snug tracking-[-0.02em] text-primary group-hover:neon-text sm:text-xl">
          {p.title}
        </h3>

        <p className="mt-2.5 line-clamp-3 text-pretty text-sm leading-relaxed text-foreground/70">
          {p.resumen}
        </p>

        <p className="mt-4 flex items-center justify-between pt-1 text-[10px] uppercase tracking-[0.16em] text-white/55">
          <span>{p.origen ?? ""}</span>
          <span className="text-white/55 transition-colors group-hover:text-primary">
            Ver ficha →
          </span>
        </p>
      </Link>
    </li>
  );
}

export function ProyectosExplorer({
  proyectos,
}: {
  proyectos: ProyectoListItem[];
}) {
  const [cat, setCat] = useState<ProyectoCategoria | null>(null);
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const m = new Map<ProyectoCategoria, number>();
    for (const p of proyectos) {
      m.set(p.categoria, (m.get(p.categoria) ?? 0) + 1);
    }
    return m;
  }, [proyectos]);

  const visibles = useMemo(() => {
    const term = normalizar(q.trim());
    return proyectos.filter((p) => {
      if (cat && p.categoria !== cat) return false;
      if (!term) return true;
      return normalizar(`${p.title} ${p.resumen} ${p.origen ?? ""}`).includes(
        term
      );
    });
  }, [proyectos, cat, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="buscar-proyecto" className="sr-only">
          Buscar proyecto
        </label>
        <input
          id="buscar-proyecto"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o tema…"
          className={cn(
            "min-h-11 w-full max-w-sm border border-white/15 bg-transparent px-3.5 text-sm text-foreground",
            "outline-none transition-colors placeholder:text-white/50",
            "focus-visible:border-white/45"
          )}
        />
        <p
          className="text-xs tabular-nums text-muted-foreground"
          aria-live="polite"
        >
          {visibles.length} de {proyectos.length}
        </p>
      </div>

      <ul className="flex flex-wrap gap-2" role="list">
        <li>
          <Chip activo={cat === null} onClick={() => setCat(null)} n={proyectos.length}>
            Todos
          </Chip>
        </li>
        {CATEGORIAS.map((c) => {
          const n = counts.get(c.id) ?? 0;
          if (n === 0) return null;
          return (
            <li key={c.id}>
              <Chip
                activo={cat === c.id}
                onClick={() => setCat((prev) => (prev === c.id ? null : c.id))}
                n={n}
              >
                {c.label}
              </Chip>
            </li>
          );
        })}
      </ul>

      {visibles.length === 0 ? (
        <p className="border border-white/[0.12] bg-white/[0.02] p-6 text-sm text-muted-foreground">
          Nada coincide con «{q}».{" "}
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat(null);
            }}
            className="text-primary underline underline-offset-4"
          >
            Limpiar filtros
          </button>
        </p>
      ) : (
        <ul
          role="list"
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          {visibles.map((p) => (
            <TarjetaProyecto key={p.slug} p={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
