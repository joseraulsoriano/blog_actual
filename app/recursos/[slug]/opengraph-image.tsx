import { getEntry, type RecursoMeta } from "@/lib/content";
import { OG_SIZE, OG_TYPE, tarjetaOG } from "@/lib/og";

export const alt = "Recurso";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getEntry<RecursoMeta>("recursos", slug);
  return tarjetaOG({
    eyebrow: r?.data.tipo ?? "Recurso",
    titulo: r?.data.title ?? "Recurso",
    pie: r?.data.autor,
  });
}
