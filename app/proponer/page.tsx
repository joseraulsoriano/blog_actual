import type { Metadata } from "next";
import { PropuestaForm } from "@/components/proyectos/propuesta-form";
import { PageHeader, PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Proponer proyecto",
  description:
    "Envía una idea o colaboración para el archivo de proyectos.",
};

export default async function ProponerPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;

  return (
    <PageShell className="max-w-xl">
      <PageHeader
        eyebrow="Colaboración"
        title="¿Tienes un proyecto?"
        lede="Cuéntame la idea. Llega como pendiente; yo la reviso en el área privada."
      />
      <PropuestaForm
        ok={ok === "1"}
        error={error === "1"}
        limite={error === "limite"}
      />
    </PageShell>
  );
}
