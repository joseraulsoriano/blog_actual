"use client";

import { useState } from "react";
import Image from "next/image";
import { AsciiGlobe, type CiudadGlobo } from "@/components/retro/ascii-globe";
import { TerminalWindow } from "@/components/retro/terminal-window";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ViajeItem = CiudadGlobo & {
  pais: string;
  año: number;
  resumen?: string;
  fotos: { src: string; alt: string }[];
};

export function ViajesExplorer({
  viajes,
  notas,
}: {
  viajes: ViajeItem[];
  notas: Record<string, React.ReactNode>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const viaje = viajes.find((v) => v.slug === selected) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-4">
        <AsciiGlobe
          cities={viajes}
          selected={selected}
          onSelect={setSelected}
        />
        <p className="text-xs text-muted-foreground">
          ○ = ciudad visitada · haz clic para seleccionar
        </p>
      </div>

      <div className="min-w-0 space-y-4">
        <TerminalWindow title="viajes — selecciona destino">
          <ul className="space-y-1.5 text-sm">
            {viajes.map((v) => (
              <li key={v.slug}>
                <button
                  onClick={() =>
                    setSelected(v.slug === selected ? null : v.slug)
                  }
                  className={cn(
                    "text-left",
                    v.slug === selected
                      ? "terminal-glow text-accent"
                      : "text-primary hover:text-accent"
                  )}
                >
                  <span className="text-accent">&gt;</span>{" "}
                  {v.slug === selected ? "◉" : "○"} {v.ciudad}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {v.pais} · desde {v.año}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </TerminalWindow>

        {viaje ? (
          <TerminalWindow title={`${viaje.ciudad.toLowerCase()} — bitácora`}>
            <article>{notas[viaje.slug]}</article>

            <h3 className="terminal-glow mt-6 mb-3 text-sm font-semibold text-primary">
              <span className="text-accent">$</span> ls fotos/
            </h3>
            {viaje.fotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {viaje.fotos.map((f) => (
                  <Dialog key={f.src}>
                    <DialogTrigger
                      render={
                        <button
                          className="group relative aspect-square overflow-hidden border border-border"
                          aria-label={`Ampliar foto: ${f.alt}`}
                        >
                          <Image
                            src={f.src}
                            alt={f.alt}
                            fill
                            sizes="(max-width: 640px) 50vw, 200px"
                            className="object-cover saturate-50 transition group-hover:saturate-100"
                          />
                        </button>
                      }
                    />
                    <DialogContent className="max-w-3xl border-border bg-card p-2">
                      <DialogTitle className="px-2 pt-2 text-sm text-primary">
                        {f.alt}
                      </DialogTitle>
                      <Image
                        src={f.src}
                        alt={f.alt}
                        width={1200}
                        height={800}
                        className="h-auto w-full object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                ls: fotos/: directorio vacío —{" "}
                <span className="text-foreground/70">
                  añade fotos en{" "}
                  <code className="text-accent">
                    content/viajes/{viaje.slug}.mdx
                  </code>{" "}
                  (campo <code className="text-accent">fotos:</code>)
                </span>
              </p>
            )}
          </TerminalWindow>
        ) : (
          <p className="text-sm text-muted-foreground">
            <span className="text-accent">$</span> selecciona una ciudad en el
            globo o en la lista<span className="cursor-blink" />
          </p>
        )}
      </div>
    </div>
  );
}
