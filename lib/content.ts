import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Entry<T> = {
  slug: string;
  data: T;
  content: string;
};

export type ProyectoCategoria =
  | "tech"
  | "hackathon"
  | "escrito"
  | "libro"
  | "video"
  | "ia-arte"
  | "ux"
  | "web"
  | "mobile"
  | "producto"
  | "hub";

export type ProyectoMeta = {
  title: string;
  resumen: string;
  categoria: ProyectoCategoria;
  año: number;
  origen?: string;
  enlace?: string;
  /** id original en el portafolio (si viene de allí). */
  portafolioId?: string;
};

export type EventoMeta = {
  title: string;
  tipo: "hackathon" | "concierto" | "conferencia";
  lugar: string;
  año: number;
  calificacion?: number;
  resumen?: string;
};

export function getCollection<T>(dir: string): Entry<T>[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(full, f), "utf8")
      );
      return { slug: f.replace(/\.mdx$/, ""), data: data as T, content };
    });
}

export function getEntry<T>(dir: string, slug: string): Entry<T> | null {
  const file = path.join(CONTENT_DIR, dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { slug, data: data as T, content };
}

/**
 * Post corto tipo timeline (publicado desde /privado).
 * El texto vive en el body del MDX; frontmatter mínimo.
 */
export type RecuerdoMeta = {
  /** ISO `yyyy-mm-dd` o `yyyy-mm-ddTHH:mm`. */
  fecha: string;
  enlace?: string;
  /** @deprecated legado — usar body */
  title?: string;
  /** @deprecated legado — usar body */
  resumen?: string;
  /** @deprecated legado */
  tipo?: "hito" | "evento" | "proyecto" | "personal";
};

export function getRecuerdos() {
  return getCollection<RecuerdoMeta>("recuerdos").sort((a, b) =>
    b.data.fecha.localeCompare(a.data.fecha)
  );
}

export type ViajeEtapa = {
  /** Año de inicio (o año único). */
  año: number;
  /** Año final opcional (p. ej. 2019–2022). */
  hasta?: number;
  texto: string;
  href?: string;
};

export type ViajeMeta = {
  ciudad: string;
  pais: string;
  lat: number;
  lon: number;
  año: number;
  resumen?: string;
  fotos?: { src: string; alt: string }[];
  /** Hechos fijos de la ciudad (estudio, etapas…) — se mezclan en la timeline. */
  etapas?: ViajeEtapa[];
};

export function getViajes() {
  return getCollection<ViajeMeta>("viajes").sort(
    (a, b) => a.data.año - b.data.año
  );
}

export function getProyectos() {
  return getCollection<ProyectoMeta>("proyectos").sort(
    (a, b) => b.data.año - a.data.año
  );
}

export function getEventos() {
  return getCollection<EventoMeta>("eventos").sort(
    (a, b) => b.data.año - a.data.año
  );
}
