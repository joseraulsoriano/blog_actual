import type { Metadata } from "next";
import { getEventos, getRecuerdos, getViajes } from "@/lib/content";
import { buildCityRelated } from "@/lib/viajes/related";
import { PageHeader, PageShell } from "@/components/site/page-shell";
import {
  ViajesExplorer,
  type ViajeItem,
} from "@/components/viajes/viajes-explorer";

export const metadata: Metadata = {
  title: "Viajes",
  description: "Ciudades en México y la línea de tiempo de lo documentado en cada una.",
};

export default async function ViajesPage({
  searchParams,
}: {
  searchParams: Promise<{ ciudad?: string }>;
}) {
  const { ciudad } = await searchParams;
  const entradas = getViajes();
  const eventos = getEventos();
  const recuerdos = getRecuerdos();

  const viajes: ViajeItem[] = entradas.map((e) => ({
    slug: e.slug,
    ciudad: e.data.ciudad,
    pais: e.data.pais,
    lat: e.data.lat,
    lon: e.data.lon,
    año: e.data.año,
    resumen: e.data.resumen,
    fotos: e.data.fotos ?? [],
    etapas: e.data.etapas ?? [],
  }));

  const related = buildCityRelated(
    entradas.map((e) => ({ slug: e.slug, content: e.content })),
    eventos,
    recuerdos
  );

  return (
    <PageShell className="max-w-3xl px-4 sm:px-6 lg:max-w-5xl">
      <PageHeader
        eyebrow="México"
        title="Viajes"
        lede="Elige una ciudad en el mapa. Abajo, la línea de tiempo de lo que quedó documentado ahí."
        className="mb-6 sm:mb-8"
      />
      <ViajesExplorer
        viajes={viajes}
        related={related}
        initialSelected={ciudad ?? null}
      />
    </PageShell>
  );
}
