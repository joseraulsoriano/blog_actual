import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/site/section-placeholder";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Hackathons, conferencias y eventos en la vida de José Raúl Soriano.",
};

export default function EventosPage() {
  return (
    <SectionPlaceholder
      title="Eventos"
      description="Hackathons, conferencias y momentos que marcaron el camino."
      fase="Fase 2"
    />
  );
}
