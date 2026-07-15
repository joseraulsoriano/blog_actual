import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getViajes } from "@/lib/content";
import { mdxComponents } from "@/components/retro/mdx";
import { PromptLine } from "@/components/retro/terminal-window";
import {
  ViajesExplorer,
  type ViajeItem,
} from "@/components/viajes/viajes-explorer";

export const metadata: Metadata = {
  title: "Viajes",
  description:
    "Viajando por el mundo: las ciudades de José Raúl Soriano en un planeta ASCII.",
};

export default function ViajesPage() {
  const entradas = getViajes();

  const viajes: ViajeItem[] = entradas.map((e) => ({
    slug: e.slug,
    ciudad: e.data.ciudad,
    pais: e.data.pais,
    lat: e.data.lat,
    lon: e.data.lon,
    año: e.data.año,
    resumen: e.data.resumen,
    fotos: e.data.fotos ?? [],
  }));

  const notas: Record<string, React.ReactNode> = {};
  for (const e of entradas) {
    notas[e.slug] = (
      <MDXRemote source={e.content} components={mdxComponents} />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PromptLine command="./planeta --render --marcar-ciudades" className="mb-2" />
      <p className="mb-8 text-sm text-muted-foreground">
        Viajando por el mundo — {viajes.length} ciudades registradas en la
        bitácora.
      </p>
      <ViajesExplorer viajes={viajes} notas={notas} />
    </div>
  );
}
