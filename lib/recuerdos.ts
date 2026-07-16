import type { Entry, RecuerdoMeta } from "@/lib/content";

/** Texto del post (body del MDX). Fallbacks para archivos legacy. */
export function textoRecuerdo(r: Entry<RecuerdoMeta>): string {
  const body = r.content.replace(/\r\n/g, "\n").trim();
  if (body) return body;
  if (r.data.resumen?.trim()) return r.data.resumen.trim();
  return (r.data.title ?? "").trim();
}

/** Etiqueta corta para el panel admin. */
export function etiquetaRecuerdo(r: Entry<RecuerdoMeta>, max = 72): string {
  const t = textoRecuerdo(r).replace(/\s+/g, " ");
  if (!t) return r.slug;
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

/** Normaliza fecha a ISO usable (con o sin hora). */
export function fechaRecuerdoISO(fecha: string): string {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(fecha)) {
    return fecha.length === 16 ? `${fecha}:00` : fecha;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return `${fecha}T12:00:00`;
  return fecha;
}

export function formatFechaPost(fecha: string): string {
  const iso = fechaRecuerdoISO(fecha);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fecha.slice(0, 10);

  const hasTime = /T\d{2}:\d{2}/.test(fecha);
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(hasTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(d);
}

/** Valor para input datetime-local. */
export function fechaParaInput(fecha: string): string {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(fecha)) return fecha.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return `${fecha}T12:00`;
  return "";
}

export function slugDesdeFecha(fecha: string): string {
  const iso = fechaRecuerdoISO(fecha);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return `p-${Date.now().toString(36)}`;
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `p-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
