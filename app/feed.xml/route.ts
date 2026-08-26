import {
  getEscritos,
  getOpiniones,
  getRecuerdos,
  getRecursos,
} from "@/lib/content";
import { fechaRecuerdoISO, etiquetaRecuerdo, textoRecuerdo } from "@/lib/recuerdos";
import { urlAbsoluta } from "@/lib/seo";

export const dynamic = "force-static";

/** Escapa para XML: los títulos traen comillas, guiones y ampersands. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type Item = {
  url: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
};

export function GET() {
  const items: Item[] = [
    ...getEscritos().map((e) => ({
      url: urlAbsoluta(`/escritos/${e.slug}`),
      titulo: e.data.title,
      descripcion: e.data.resumen,
      fecha: new Date(`${e.data.fecha}T12:00:00`),
    })),
    ...getOpiniones().map((o) => ({
      url: urlAbsoluta(`/opiniones/${o.slug}`),
      titulo: o.data.title,
      descripcion: o.data.resumen,
      fecha: new Date(`${o.data.fecha}T12:00:00`),
    })),
    ...getRecursos().map((r) => ({
      url: urlAbsoluta(`/recursos/${r.slug}`),
      titulo: r.data.title,
      descripcion: r.data.resumen,
      fecha: new Date(`${r.data.fecha}T12:00:00`),
    })),
    ...getRecuerdos().map((r) => ({
      url: urlAbsoluta(`/recuerdos/${r.slug}`),
      titulo: etiquetaRecuerdo(r, 80),
      descripcion: textoRecuerdo(r),
      fecha: new Date(fechaRecuerdoISO(r.data.fecha)),
    })),
  ]
    .filter((i) => !Number.isNaN(i.fecha.getTime()))
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, 50);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>José Raúl Soriano — Escritos y recuerdos</title>
    <link>${esc(urlAbsoluta("/"))}</link>
    <description>Artículos técnicos y notas del archivo de José Raúl Soriano Cazabal.</description>
    <language>es-MX</language>
    <lastBuildDate>${(items[0]?.fecha ?? new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${esc(urlAbsoluta("/feed.xml"))}" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.titulo)}</title>
      <link>${esc(i.url)}</link>
      <guid isPermaLink="true">${esc(i.url)}</guid>
      <pubDate>${i.fecha.toUTCString()}</pubDate>
      <description>${esc(i.descripcion)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
