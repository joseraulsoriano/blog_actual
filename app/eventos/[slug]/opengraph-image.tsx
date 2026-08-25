import { getEntry, type EventoMeta } from "@/lib/content";
import { OG_SIZE, OG_TYPE, tarjetaOG } from "@/lib/og";

export const alt = "Evento";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getEntry<EventoMeta>("eventos", slug);
  return tarjetaOG({
    eyebrow: e ? `${e.data.tipo} · ${e.data.lugar}` : "Evento",
    titulo: e?.data.title ?? "Evento",
    pie: e ? String(e.data.año) : undefined,
  });
}
