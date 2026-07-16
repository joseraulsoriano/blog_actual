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

function construirData(coleccion: string, formData: FormData) {
  const esquema = ESQUEMAS[coleccion];
  const data: Record<string, unknown> = {};
  for (const campo of esquema.campos) {
    const crudo = formData.get(`fm_${campo.name}`);
    if (campo.tipo === "fotos") {
      try {
        const fotos = JSON.parse(String(crudo ?? "[]")) as {
          src: string;
          alt: string;
        }[];
        data[campo.name] = fotos
          .filter((f) => f.src?.trim())
          .map((f) => ({ src: f.src.trim(), alt: f.alt?.trim() ?? "" }));
      } catch {
        data[campo.name] = [];
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

async function persistir(
  coleccion: string,
  slug: string,
  formData: FormData,
  mensaje: string
) {
  const data = construirData(coleccion, formData);
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
  redirect(`/privado?ok=${coleccion}/${slug}`);
}

export async function crearEntrada(formData: FormData) {
  await exigirAdmin();
  const coleccion = String(formData.get("coleccion") ?? "");
  let slug = String(formData.get("slug") ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

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
  redirect(`/privado?ok=${coleccion}/${slug}`);
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
