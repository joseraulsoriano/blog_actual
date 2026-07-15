import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/site/section-placeholder";

export const metadata: Metadata = {
  title: "Viajes",
  description: "Viajando por el mundo: el mapa de viajes de José Raúl Soriano.",
};

export default function ViajesPage() {
  return (
    <SectionPlaceholder
      title="Viajes"
      description="Recupera la sección «Viajando por el mundo» con un mapa interactivo propio."
      fase="Fase 3"
    />
  );
}
