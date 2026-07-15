import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/site/section-placeholder";

export const metadata: Metadata = {
  title: "Privado",
  description: "Sección privada del legado digital.",
  robots: { index: false, follow: false },
};

export default function PrivadoPage() {
  return (
    <SectionPlaceholder
      title="Privado"
      description="Los recuerdos personales, protegidos con inicio de sesión. Solo para quien deba verlos."
      fase="Fase 4"
    />
  );
}
