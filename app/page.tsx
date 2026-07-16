import { getRecuerdos, getViajes } from "@/lib/content";
import { HomeGlobeHero } from "@/components/home/home-globe-hero";
import { HomeArchivo } from "@/components/home/home-archivo";
import { HomeUltimo } from "@/components/home/home-ultimo";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sellado?: string }>;
}) {
  const { sellado } = await searchParams;
  const ultimo = getRecuerdos()[0] ?? null;
  const cities = getViajes().map((v) => ({
    slug: v.slug,
    ciudad: v.data.ciudad,
    lat: v.data.lat,
    lon: v.data.lon,
  }));

  return (
    <div className="relative overflow-hidden">
      {sellado === "1" ? (
        <p className="border-b border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs tracking-[0.14em] text-muted-foreground">
          El umbral se cerró.
        </p>
      ) : null}

      {/* Acto 1 — presencia */}
      <HomeGlobeHero cities={cities} />

      {/* Pulso tipográfico */}
      <p
        className="relative mx-auto max-w-md px-5 pb-20 text-center text-pretty text-base italic leading-relaxed text-white/45 sm:pb-28 sm:text-lg"
        aria-hidden={false}
      >
        «Sin sacrificio no hay victoria.»
      </p>

      {/* Acto 2 — puertas */}
      <div
        className="pointer-events-none mx-auto h-px w-12 bg-white/40 shadow-[0_0_12px_oklch(1_0_0_/_0.4)]"
        aria-hidden
      />
      <HomeArchivo />

      {/* Acto 3 — un recuerdo */}
      <div
        className="pointer-events-none mx-auto h-px w-12 bg-white/40 shadow-[0_0_12px_oklch(1_0_0_/_0.4)]"
        aria-hidden
      />
      {ultimo ? <HomeUltimo post={ultimo} /> : null}
    </div>
  );
}
