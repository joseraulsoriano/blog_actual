/**
 * El expediente (/bio) — identidad + partidor de secciones de bio.mdx.
 * El contenido real vive en content/paginas/bio.mdx; este archivo no debe
 * fabricar texto sobre José, solo presentarlo (fechas, corte de secciones).
 */

export const expedienteNacimiento = "2004-12-25";

export function getExpedienteEdad(): number {
  const nacimiento = new Date(expedienteNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

export const expedienteAlias = "Chasse";
export const expedienteLugar = "Puebla, México";

export type BioSection = {
  id: string;
  title: string;
  body: string;
};

function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

/** Corta el body de bio.mdx en la intro (antes del primer `## `) y sus secciones. */
export function splitBioSections(markdown: string): {
  intro: string;
  sections: BioSection[];
} {
  const parts = markdown.split(/\n##\s+/);
  const intro = (parts[0] ?? "").trim();
  const sections = parts.slice(1).map((chunk) => {
    const newline = chunk.indexOf("\n");
    const title = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const body = (newline === -1 ? "" : chunk.slice(newline + 1)).trim();
    return { id: slugify(title), title, body };
  });
  return { intro, sections };
}
