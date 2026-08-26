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

export type Foto = { src: string; alt: string };

export type EventoMeta = {
  title: string;
  tipo: "hackathon" | "concierto" | "conferencia";
  lugar: string;
  año: number;
  calificacion?: number;
  resumen?: string;
  fotos?: Foto[];
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
 * Una entrada con `borrador: true` vive en el repo pero no en el sitio:
 * no sale en listas, feed, sitemap ni en su propia URL.
 */
export function esBorrador(data: unknown): boolean {
  return (data as { borrador?: boolean } | null)?.borrador === true;
}

/** Colección sin borradores: lo que el público puede ver. */
export function getPublicados<T>(dir: string): Entry<T>[] {
  return getCollection<T>(dir).filter((e) => !esBorrador(e.data));
}

/**
 * Post corto tipo timeline (publicado desde /privado).
 * El texto vive en el body del MDX; frontmatter mínimo.
 */
export type RecuerdoMeta = {
  /** ISO `yyyy-mm-dd` o `yyyy-mm-ddTHH:mm`. */
  fecha: string;
  enlace?: string;
  fotos?: Foto[];
  /** @deprecated legado — usar body */
  title?: string;
  /** @deprecated legado — usar body */
  resumen?: string;
  /** @deprecated legado */
  tipo?: "hito" | "evento" | "proyecto" | "personal";
};

export function getRecuerdos() {
  return getPublicados<RecuerdoMeta>("recuerdos").sort((a, b) =>
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
  fotos?: Foto[];
  /** Hechos fijos de la ciudad (estudio, etapas…) — se mezclan en la timeline. */
  etapas?: ViajeEtapa[];
};

export function getViajes() {
  return getPublicados<ViajeMeta>("viajes").sort(
    (a, b) => a.data.año - b.data.año
  );
}

/** Artículo largo: la escritura técnica del blog. */
export type EscritoMeta = {
  title: string;
  resumen: string;
  /** ISO `yyyy-mm-dd`. */
  fecha: string;
  tags?: string[];
  portada?: Foto[];
};

export function getEscritos() {
  return getPublicados<EscritoMeta>("escritos").sort((a, b) =>
    b.data.fecha.localeCompare(a.data.fecha)
  );
}

/** Minutos de lectura a 200 palabras/minuto. */
export function minutosLectura(texto: string): number {
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

export function getProyectos() {
  return getPublicados<ProyectoMeta>("proyectos").sort(
    (a, b) => b.data.año - a.data.año
  );
}

export function getEventos() {
  return getPublicados<EventoMeta>("eventos").sort(
    (a, b) => b.data.año - a.data.año
  );
}

/** Recurso recomendado: libro, curso, herramienta, repo, video… */
export type RecursoTipo =
  | "libro"
  | "curso"
  | "herramienta"
  | "articulo"
  | "video"
  | "podcast"
  | "repo";

export type RecursoMeta = {
  title: string;
  resumen: string;
  tipo: RecursoTipo;
  /** URL externa al recurso. */
  enlace?: string;
  autor?: string;
  /** ISO `yyyy-mm-dd` — cuándo lo recomendé. */
  fecha: string;
  tags?: string[];
  borrador?: boolean;
};

export function getRecursos() {
  return getPublicados<RecursoMeta>("recursos").sort((a, b) =>
    b.data.fecha.localeCompare(a.data.fecha)
  );
}

/** Opinión: una postura firmada, con fecha, para poder releerla después. */
export type OpinionMeta = {
  title: string;
  /** La tesis en una frase. */
  resumen: string;
  /** ISO `yyyy-mm-dd`. */
  fecha: string;
  tema?: "tecnologia" | "industria" | "educacion" | "cultura" | "personal";
  tags?: string[];
  borrador?: boolean;
};

export function getOpiniones() {
  return getPublicados<OpinionMeta>("opiniones").sort((a, b) =>
    b.data.fecha.localeCompare(a.data.fecha)
  );
}
