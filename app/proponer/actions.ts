"use server";

import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { escribirArchivo } from "@/lib/admin/store";
import { esSlugValido } from "@/lib/admin/schemas";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/**
 * Formulario público → content/propuestas/*.mdx (pendiente).
 * Sin auth; honeypot anti-bots.
 */
export async function enviarPropuesta(formData: FormData) {
  // Honeypot: si se llena, fingimos OK
  if (String(formData.get("website") ?? "").trim()) {
    redirect("/proponer?ok=1");
  }

  const title = String(formData.get("title") ?? "").trim();
  const resumen = String(formData.get("resumen") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "tech").trim();
  const enlace = String(formData.get("enlace") ?? "").trim();
  const contacto = String(formData.get("contacto") ?? "").trim();
  const detalle = String(formData.get("detalle") ?? "").trim();

  if (title.length < 3 || resumen.length < 10) {
    redirect("/proponer?error=1");
  }
  if (title.length > 120 || resumen.length > 800) {
    redirect("/proponer?error=1");
  }

  const base = slugify(title) || "propuesta";
  const stamp = Date.now().toString(36);
  let slug = `prop-${base}-${stamp}`;
  if (!esSlugValido(slug)) {
    slug = `prop-${stamp}`;
  }

  const data: Record<string, unknown> = {
    title,
    resumen,
    categoria,
    estado: "pendiente",
    fecha: new Date().toISOString().slice(0, 10),
  };
  if (enlace) data.enlace = enlace;
  if (contacto) data.contacto = contacto;

  const body = (detalle || resumen) + "\n";
  const md = matter.stringify(body.endsWith("\n") ? body : body + "\n", data);
  await escribirArchivo(
    `content/propuestas/${slug}.mdx`,
    Buffer.from(md),
    `propuesta: ${title}`
  );

  revalidatePath("/privado");
  revalidatePath("/proyectos");
  redirect("/proponer?ok=1");
}
