import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/site/section-placeholder";

export const metadata: Metadata = {
  title: "Recuerdos",
  description:
    "La línea de tiempo de recuerdos: el corazón del legado digital.",
};

export default function RecuerdosPage() {
  return (
    <SectionPlaceholder
      title="Recuerdos"
      description="El timeline estilo red social con los momentos que quiero que trasciendan."
      fase="Fase 3"
    />
  );
}
