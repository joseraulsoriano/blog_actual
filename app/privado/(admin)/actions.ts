"use server";

import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cerrarSesion, exigirAdmin } from "@/lib/admin/auth";
import { borrarArchivo, escribirArchivo } from "@/lib/admin/store";
import {
  ESQUEMAS,
  esColeccionValida,
  esSlugValido,
} from "@/lib/admin/schemas";
import { getEntry } from "@/lib/content";

/** Título → slug: sin acentos, minúsculas y guiones. */
function normalizarSlug(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function construirData(coleccion: string, formData: FormData) {
  const esquema = ESQUEMAS[coleccion];
  const data: Record<string, unknown> = {};
  for (const campo of esquema.campos) {
    const crudo = formData.get(`fm_${campo.name}`);
    if (campo.tipo === "tags") {
      const tags = String(crudo ?? "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      if (tags.length) data[campo.name] = [...new Set(tags)];
      continue;
    }
    if (campo.tipo === "etapas") {
      try {
        const etapas = JSON.parse(String(crudo ?? "[]")) as {
          año: unknown;
          hasta?: unknown;
          texto?: string;
          href?: string;
        }[];
        const limpias = etapas
          .filter((e) => String(e.texto ?? "").trim() && Number(e.año))
          .map((e) => ({
            año: Number(e.año),
            ...(Number(e.hasta) ? { hasta: Number(e.hasta) } : {}),
            texto: String(e.texto).trim(),
            ...(String(e.href ?? "").trim()
              ? { href: String(e.href).trim() }
              : {}),
          }))
          .sort((a, b) => a.año - b.año);
        if (limpias.length) data[campo.name] = limpias;
      } catch {
        // Entrada corrupta: mejor no escribir el campo que romper el YAML.
      }
      continue;
    }
    if (campo.tipo === "fotos") {
      try {
        const fotos = JSON.parse(String(crudo ?? "[]")) as {
          src: string;
          alt: string;
        }[];
        const limpias = fotos
          .filter((f) => f.src?.trim())
          .map((f) => ({ src: f.src.trim(), alt: f.alt?.trim() ?? "" }));
        if (limpias.length) data[campo.name] = limpias;
      } catch {
        // Entrada corrupta: mejor no escribir el campo.
      }
      continue;
    }
    const valor = String(crudo ?? "").trim();
    if (!valor) {
      if (campo.requerido) throw new Error(`Falta el campo ${campo.label}`);
      continue;
    }
    data[campo.name] = campo.tipo === "numero" ? Number(valor) : valor;
  }
  return data;
}

/** "borrador" guarda sin publicar; cualquier otra cosa publica. */
function esBorradorPedido(coleccion: string, formData: FormData): boolean {
  if (!ESQUEMAS[coleccion]?.borradores) return false;
  return String(formData.get("estado") ?? "") === "borrador";
}

async function persistir(
  coleccion: string,
  slug: string,
  formData: FormData,
  mensaje: string
) {
  const data = construirData(coleccion, formData);
  if (esBorradorPedido(coleccion, formData)) data.borrador = true;
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n");
  // gray-matter serializa el YAML con las comillas necesarias
  // (adiós al bug de los dos puntos en los títulos).
  const md = matter.stringify(body.endsWith("\n") ? body : body + "\n", data);
  await escribirArchivo(`content/${coleccion}/${slug}.mdx`, Buffer.from(md), mensaje);
  revalidatePath("/", "layout");
}

export async function guardarEntrada(formData: FormData) {
  await exigirAdmin();
  const coleccion = String(formData.get("coleccion") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!esColeccionValida(coleccion) || !esSlugValido(slug)) {
    throw new Error("Colección o slug inválidos");
  }
  await persistir(coleccion, slug, formData, `contenido: actualiza ${coleccion}/${slug}`);
  redirect(
    `/privado?ok=${coleccion}/${slug}${
      esBorradorPedido(coleccion, formData) ? "&estado=borrador" : ""
    }`
  );
}

export async function crearEntrada(formData: FormData) {
  await exigirAdmin();
  const coleccion = String(formData.get("coleccion") ?? "");
  let slug = normalizarSlug(String(formData.get("slug") ?? ""));

  // Si el formulario no trajo slug, se deriva del campo título del esquema.
  if (!slug && esColeccionValida(coleccion)) {
    const campo = ESQUEMAS[coleccion].campoTitulo;
    if (campo) slug = normalizarSlug(String(formData.get(`fm_${campo}`) ?? ""));
  }

  // Posts: si el slug choca, añade un sufijo
  if (coleccion === "recuerdos" && slug && getEntry(coleccion, slug)) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  if (!esColeccionValida(coleccion) || !esSlugValido(slug)) {
    throw new Error("Colección o slug inválidos (usa minúsculas y guiones)");
  }
  if (getEntry(coleccion, slug)) {
    throw new Error(`Ya existe ${coleccion}/${slug}`);
  }
  await persistir(coleccion, slug, formData, `contenido: crea ${coleccion}/${slug}`);
  redirect(
    `/privado?ok=${coleccion}/${slug}${
      esBorradorPedido(coleccion, formData) ? "&estado=borrador" : ""
    }`
  );
}

export async function eliminarEntrada(formData: FormData) {
  await exigirAdmin();
  const coleccion = String(formData.get("coleccion") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!esColeccionValida(coleccion) || !esSlugValido(slug)) {
    throw new Error("Colección o slug inválidos");
  }
  await borrarArchivo(
    `content/${coleccion}/${slug}.mdx`,
    `contenido: elimina ${coleccion}/${slug}`
  );
  revalidatePath("/", "layout");
  redirect(`/privado?borrado=${coleccion}/${slug}`);
}

export async function salir() {
  await cerrarSesion();
  redirect("/");
}
