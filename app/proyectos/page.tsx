import type { Metadata } from "next";
import Link from "next/link";
import { getProyectos } from "@/lib/content";
import {
  ProyectosExplorer,
  type ProyectoListItem,
} from "@/components/proyectos/proyectos-explorer";
import { PageHeader, PageShell } from "@/components/site/page-shell";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Archivo de proyectos por categoría. ¿Tienes un proyecto? Propón una idea.",
};

export default async function ProyectosPage() {
  const proyectos: ProyectoListItem[] = getProyectos().map((p) => ({
    slug: p.slug,
    title: p.data.title,
    resumen: p.data.resumen,
    categoria: p.data.categoria,
    año: p.data.año,
    origen: p.data.origen,
    enlace: p.data.enlace,
  }));

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Archivo"
        title="Proyectos"
        lede={`${proyectos.length} piezas. Elige categoría, luego el proyecto.`}
      />

      <p className="mb-10 max-w-md text-pretty text-base leading-relaxed text-foreground/85 sm:text-lg">
        ¿Tienes un proyecto?{" "}
        <Link
          href="/proponer"
          className="text-primary underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60"
        >
          Cuéntamelo
        </Link>
        .
      </p>

      <section id="archivo" aria-labelledby="archivo-heading">
        <h2 id="archivo-heading" className="sr-only">
          Archivo por categoría
        </h2>
        <ProyectosExplorer proyectos={proyectos} />
      </section>
    </PageShell>
  );
}
