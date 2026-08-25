import { haySesion } from "@/lib/admin/auth";
import { escribirArchivo } from "@/lib/admin/store";

/**
 * Subida de imágenes del panel: escribe en public/uploads vía el store
 * (fs en local, GitHub Contents API en Vercel → redeploy).
 * Devuelve la ruta pública que se guarda en el frontmatter.
 */

/** Extensión derivada del tipo real, nunca del nombre del archivo. */
const TIPOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const MAX_BYTES = 6 * 1024 * 1024;

function segmento(valor: string, porDefecto: string): string {
  const limpio = valor
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return limpio || porDefecto;
}

export async function POST(req: Request) {
  if (!(await haySesion())) {
    return new Response("No autorizado", { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new Response("Cuerpo inválido", { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return new Response("Falta el archivo", { status: 400 });
  }

  const ext = TIPOS[file.type];
  if (!ext) {
    return new Response(
      `Formato no permitido (${file.type || "desconocido"}). Usa JPG, PNG, WEBP, AVIF o GIF.`,
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return new Response(
      `La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB; el máximo es 6 MB.`,
      { status: 413 }
    );
  }

  const coleccion = segmento(String(form.get("coleccion") ?? ""), "general");
  const slug = segmento(String(form.get("slug") ?? ""), "general");
  const único = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const rel = `public/uploads/${coleccion}/${slug}-${único}.${ext}`;

  try {
    await escribirArchivo(
      rel,
      Buffer.from(await file.arrayBuffer()),
      `contenido: sube ${coleccion}/${slug} (${ext})`
    );
  } catch (e) {
    const detalle = e instanceof Error ? e.message : "error desconocido";
    return new Response(`No se pudo guardar: ${detalle}`, { status: 500 });
  }

  return Response.json({ src: rel.replace(/^public/, "") });
}
