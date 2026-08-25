"use client";

import { useEffect, useState } from "react";
import {
  AsciiGlobe,
  SPIN_LENTO,
  type CiudadGlobo,
} from "@/components/retro/ascii-globe";
import { CityDetail } from "@/components/viajes/city-detail";
import type { ViajeEtapa } from "@/lib/content";
import type { CityRelated } from "@/lib/viajes/related";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type ViajeItem = CiudadGlobo & {
  pais: string;
  año: number;
  resumen?: string;
  fotos: { src: string; alt: string }[];
  etapas: ViajeEtapa[];
};

function useIsMobile(breakpoint = 1024) {
  const [mobile, setMobile] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}

export function ViajesExplorer({
  viajes,
  related,
  initialSelected = null,
}: {
  viajes: ViajeItem[];
  related: Record<string, CityRelated>;
  initialSelected?: string | null;
}) {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<string | null>(() => {
    if (
      initialSelected &&
      viajes.some((v) => v.slug === initialSelected)
    ) {
      return initialSelected;
    }
    return null;
  });
  const viaje = viajes.find((v) => v.slug === selected) ?? null;
  const cityRelated = selected
    ? related[selected] ?? { eventos: [], recuerdos: [] }
    : { eventos: [], recuerdos: [] };

  function selectCity(slug: string | null) {
    setSelected(slug);
  }

  const detail = viaje ? (
    <CityDetail
      ciudad={viaje.ciudad}
      pais={viaje.pais}
      año={viaje.año}
      resumen={viaje.resumen}
      fotos={viaje.fotos}
      etapas={viaje.etapas}
      related={cityRelated}
    />
  ) : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Mismo planeta que el home, girando más lento para leer las etiquetas. */}
      <div className="flex justify-center overflow-visible py-1 sm:py-2">
        <AsciiGlobe
          cities={viajes}
          selected={selected}
          onSelect={selectCity}
          size="lg"
          showLabels
          spinSpeed={SPIN_LENTO}
        />
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <ul className="flex gap-2 pb-1 sm:flex-wrap" role="list">
          {viajes.map((v) => {
            const active = selected === v.slug;
            return (
              <li key={v.slug} className="shrink-0">
                <button
                  type="button"
                  onClick={() => selectCity(active && isMobile ? null : v.slug)}
                  className={cn(
                    "min-h-11 rounded-full border px-3.5 py-2 text-sm transition-colors",
                    active
                      ? "border-white/50 bg-white/[0.1] text-primary"
                      : "border-white/15 text-foreground/75 active:bg-white/[0.06]"
                  )}
                >
                  {v.ciudad}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {!isMobile ? (
        <div className="hidden border border-white/[0.12] bg-white/[0.02] p-5 lg:block lg:p-7">
          {detail ?? (
            <p className="text-sm text-muted-foreground">
              Selecciona una ciudad.
            </p>
          )}
        </div>
      ) : null}

      <Sheet
        open={isMobile && selected != null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent
          side="bottom"
          showCloseButton
          className="flex max-h-[88dvh] flex-col gap-0 overflow-hidden border-white/15 bg-black p-0 sm:max-w-none"
        >
          <div
            className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/25"
            aria-hidden
          />
          <SheetHeader className="shrink-0 border-b border-white/[0.08] px-5 pb-3 pt-2 text-left">
            <SheetTitle className="text-xl tracking-[-0.02em]">
              {viaje?.ciudad ?? "Ciudad"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {viaje ? `Desde ${viaje.año}` : ""}
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] md:pb-5">
            {viaje ? (
              <CityDetail
                ciudad={viaje.ciudad}
                pais={viaje.pais}
                año={viaje.año}
                resumen={viaje.resumen}
                fotos={viaje.fotos}
                etapas={viaje.etapas}
                related={cityRelated}
                hideHeader
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
