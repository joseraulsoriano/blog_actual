import { getEntry, type RecuerdoMeta } from "@/lib/content";
import { etiquetaRecuerdo, formatFechaPost } from "@/lib/recuerdos";
import { OG_SIZE, OG_TYPE, tarjetaOG } from "@/lib/og";

export const alt = "Recuerdo";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getEntry<RecuerdoMeta>("recuerdos", slug);
  return tarjetaOG({
    eyebrow: "Recuerdo",
    titulo: r ? etiquetaRecuerdo(r, 120) : "Recuerdo",
    pie: r ? formatFechaPost(r.data.fecha) : undefined,
  });
}
