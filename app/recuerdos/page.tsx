import type { Metadata } from "next";
import Link from "next/link";
import { getRecuerdos, type RecuerdoMeta, type Entry } from "@/lib/content";
import { PromptLine } from "@/components/retro/terminal-window";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Recuerdos",
  description:
    "La línea de tiempo del legado digital de José Raúl Soriano: hitos, eventos, proyectos y momentos personales.",
};

const tipoEtiqueta: Record<RecuerdoMeta["tipo"], string> = {
  hito: "HITO",
  evento: "EVENTO",
  proyecto: "PROYECTO",
  personal: "PERSONAL",
};

function Fila({ r, ultima }: { r: Entry<RecuerdoMeta>; ultima: boolean }) {
  const [, mes, dia] = r.data.fecha.split("-");
  return (
    <li className="relative pl-8">
      <span
        aria-hidden
        className="absolute top-0 left-0 text-muted-foreground select-none"
      >
        {ultima ? "└──" : "├──"}
      </span>
      {!ultima ? (
        <span
          aria-hidden
          className="absolute top-6 bottom-[-0.375rem] left-0 w-4 text-muted-foreground select-none"
        >
          │
        </span>
      ) : null}
      <div className="pb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs text-muted-foreground">
            {dia}/{mes}
          </span>
          <Badge variant="outline">{tipoEtiqueta[r.data.tipo]}</Badge>
          <Link
            href={`/recuerdos/${r.slug}`}
            className="terminal-glow font-semibold text-primary underline-offset-4 hover:underline"
          >
            {r.data.title}
          </Link>
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {r.data.resumen}
        </p>
      </div>
    </li>
  );
}

export default function RecuerdosPage() {
  const recuerdos = getRecuerdos();
  const años = [...new Set(recuerdos.map((r) => r.data.fecha.slice(0, 4)))];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PromptLine command="git log --legado --reverse=false" className="mb-2" />
      <p className="mb-10 text-sm text-muted-foreground">
        {recuerdos.length} recuerdos registrados — los momentos que quiero que
        trasciendan.
      </p>

      {años.map((año) => {
        const delAño = recuerdos.filter((r) => r.data.fecha.startsWith(año));
        return (
          <section key={año} className="mb-2">
            <h2 className="terminal-glow mb-3 text-2xl font-semibold text-accent">
              {año} <span className="text-muted-foreground">─┐</span>
            </h2>
            <ul>
              {delAño.map((r, i) => (
                <Fila key={r.slug} r={r} ultima={i === delAño.length - 1} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
