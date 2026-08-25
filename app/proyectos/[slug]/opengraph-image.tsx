import { getEntry, type ProyectoMeta } from "@/lib/content";
import { OG_SIZE, OG_TYPE, tarjetaOG } from "@/lib/og";

export const alt = "Proyecto";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getEntry<ProyectoMeta>("proyectos", slug);
  return tarjetaOG({
    eyebrow: p ? `Proyecto · ${p.data.categoria}` : "Proyecto",
    titulo: p?.data.title ?? "Proyecto",
    pie: p ? String(p.data.año) : undefined,
  });
}
