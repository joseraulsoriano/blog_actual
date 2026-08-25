import { getEntry, minutosLectura, type EscritoMeta } from "@/lib/content";
import { OG_SIZE, OG_TYPE, tarjetaOG } from "@/lib/og";

export const alt = "Escrito";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getEntry<EscritoMeta>("escritos", slug);
  return tarjetaOG({
    eyebrow: "Escrito",
    titulo: e?.data.title ?? "Escrito",
    pie: e ? `${minutosLectura(e.content)} min de lectura` : undefined,
  });
}
