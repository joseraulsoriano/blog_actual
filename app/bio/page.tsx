import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/site/section-placeholder";

export const metadata: Metadata = {
  title: "Bio",
  description: "Quién es José Raúl Soriano: biografía, formación y camino.",
};

export default function BioPage() {
  return (
    <SectionPlaceholder
      title="Bio"
      description="Aquí vivirá mi biografía, migrada y actualizada desde la versión 2021."
      fase="Fase 2"
    />
  );
}
