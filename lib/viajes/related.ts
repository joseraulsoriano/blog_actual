import type { Entry, EventoMeta, RecuerdoMeta } from "@/lib/content";
import { textoRecuerdo } from "@/lib/recuerdos";

export type RelatedEvento = {
  slug: string;
  title: string;
  tipo: EventoMeta["tipo"];
  año: number;
  resumen?: string;
};

export type RelatedRecuerdo = {
  slug: string;
  title: string;
  fecha: string;
  resumen: string;
};

export type CityRelated = {
  eventos: RelatedEvento[];
  recuerdos: RelatedRecuerdo[];
};

/** Palabras clave por ciudad para cruzar lugar/texto. */
const CITY_HINTS: Record<string, RegExp[]> = {
  cdmx: [
    /ciudad de m[eé]xico/i,
    /\bcdmx\b/i,
    /foro sol/i,
    /estadio azteca/i,
    /esperanza iris/i,
    /sala forum/i,
    /aut[oó]dromo/i,
  ],
  puebla: [/puebla/i, /\bbuap\b/i, /l[aá]zaro c[aá]rdenas/i],
  cuernavaca: [/cuernavaca/i, /morelos/i],
  guadalajara: [/guadalajara/i],
  monterrey: [/monterrey/i],
};

function matchesCity(haystack: string, citySlug: string): boolean {
  const hints = CITY_HINTS[citySlug];
  if (!hints) return false;
  return hints.some((re) => re.test(haystack));
}

function linkedSlugs(mdx: string, collection: string): string[] {
  const re = new RegExp(`\\]\\(/${collection}/([^)/\\s#]+)`, "g");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(mdx)) !== null) {
    if (m[1] && !out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

/**
 * Relaciona eventos y recuerdos a cada viaje:
 * 1) enlaces MDX en la nota de la ciudad
 * 2) coincidencia de lugar / título / resumen
 */
export function buildCityRelated(
  viajes: { slug: string; content: string }[],
  eventos: Entry<EventoMeta>[],
  recuerdos: Entry<RecuerdoMeta>[]
): Record<string, CityRelated> {
  const byEvento = new Map(eventos.map((e) => [e.slug, e]));
  const byRecuerdo = new Map(recuerdos.map((r) => [r.slug, r]));
  const result: Record<string, CityRelated> = {};

  for (const viaje of viajes) {
    const eventSlugs = new Set(linkedSlugs(viaje.content, "eventos"));
    const recuerdoSlugs = new Set(linkedSlugs(viaje.content, "recuerdos"));

    for (const e of eventos) {
      const blob = `${e.data.lugar} ${e.data.title} ${e.data.resumen ?? ""}`;
      if (matchesCity(blob, viaje.slug)) eventSlugs.add(e.slug);
    }
    for (const r of recuerdos) {
      const blob = `${textoRecuerdo(r)} ${r.data.enlace ?? ""}`;
      if (
        matchesCity(blob, viaje.slug) ||
        r.data.enlace === `/viajes` ||
        r.data.enlace?.includes(viaje.slug)
      ) {
        recuerdoSlugs.add(r.slug);
      }
    }

    // Enlaces a /eventos/... y recuerdos cuyo enlace apunta a evento de esta ciudad
    for (const r of recuerdos) {
      if (!r.data.enlace?.startsWith("/eventos/")) continue;
      const eslug = r.data.enlace.replace("/eventos/", "").split("/")[0];
      if (eslug && eventSlugs.has(eslug)) recuerdoSlugs.add(r.slug);
    }

    result[viaje.slug] = {
      eventos: [...eventSlugs]
        .map((s) => byEvento.get(s))
        .filter((e): e is Entry<EventoMeta> => e != null)
        .sort((a, b) => b.data.año - a.data.año)
        .map((e) => ({
          slug: e.slug,
          title: e.data.title,
          tipo: e.data.tipo,
          año: e.data.año,
          resumen: e.data.resumen,
        })),
      recuerdos: [...recuerdoSlugs]
        .map((s) => byRecuerdo.get(s))
        .filter((r): r is Entry<RecuerdoMeta> => r != null)
        .sort((a, b) => b.data.fecha.localeCompare(a.data.fecha))
        .map((r) => {
          const texto = textoRecuerdo(r);
          return {
            slug: r.slug,
            title: texto.slice(0, 80),
            fecha: r.data.fecha,
            resumen: texto,
          };
        }),
    };
  }

  return result;
}
