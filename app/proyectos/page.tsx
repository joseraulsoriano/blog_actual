import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/site/section-placeholder";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Proyectos de código, hardware e ideas de José Raúl Soriano.",
};

export default function ProyectosPage() {
  return (
    <SectionPlaceholder
      title="Proyectos"
      description="Los proyectos de la versión 2021, actualizados y con los nuevos que vienen."
      fase="Fase 2"
    />
  );
}
