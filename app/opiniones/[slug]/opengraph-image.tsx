import { getEntry, type OpinionMeta } from "@/lib/content";
import { OG_SIZE, OG_TYPE, tarjetaOG } from "@/lib/og";

export const alt = "Opinión";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = getEntry<OpinionMeta>("opiniones", slug);
  return tarjetaOG({
    eyebrow: "Opinión",
    titulo: o?.data.title ?? "Opinión",
    pie: o?.data.fecha,
  });
}
