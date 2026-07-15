import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Entry<T> = {
  slug: string;
  data: T;
  content: string;
};

export type ProyectoMeta = {
  title: string;
  resumen: string;
  categoria: "web" | "hackathon" | "escrito" | "ia-arte" | "ux";
  año: number;
  origen?: string;
  enlace?: string;
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
