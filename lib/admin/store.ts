import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Capa de escritura estandarizada:
 * - En local escribe directo al sistema de archivos (y tú haces commit cuando quieras).
 * - En producción (Vercel u otro fs de solo lectura) escribe vía GitHub Contents API,
 *   lo que dispara un redeploy — el contenido sigue viviendo en Git, como manda el legado.
 * Requiere en producción: GITHUB_TOKEN (repo scope) y opcional GITHUB_REPO / GITHUB_BRANCH.
 */

const REPO = process.env.GITHUB_REPO ?? "joseraulsoriano/blog_actual";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

function usaGitHub(): boolean {
  return process.env.VERCEL === "1" || process.env.ADMIN_STORE === "github";
}

function rutaSegura(rel: string): string {
  const norm = path.posix.normalize(rel);
  if (
    norm.startsWith("..") ||
    path.posix.isAbsolute(norm) ||
    !(norm.startsWith("content/") || norm.startsWith("public/uploads/"))
  ) {
    throw new Error(`Ruta no permitida: ${rel}`);
  }
  return norm;
}

async function githubApi(ruta: string, init?: RequestInit) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN no está definido");
  const res = await fetch(`https://api.github.com/repos/${REPO}/${ruta}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
  return res;
}

async function shaExistente(rel: string): Promise<string | undefined> {
  const res = await githubApi(`contents/${rel}?ref=${BRANCH}`);
  if (!res.ok) return undefined;
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

export async function escribirArchivo(
  rel: string,
  contenido: Buffer,
  mensaje: string
): Promise<void> {
  const ruta = rutaSegura(rel);
  if (!usaGitHub()) {
    const abs = path.join(process.cwd(), ruta);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contenido);
    return;
  }
  const sha = await shaExistente(ruta);
  const res = await githubApi(`contents/${ruta}`, {
    method: "PUT",
    body: JSON.stringify({
      message: mensaje,
      content: contenido.toString("base64"),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub respondió ${res.status}: ${await res.text()}`);
  }
}

export async function borrarArchivo(rel: string, mensaje: string): Promise<void> {
  const ruta = rutaSegura(rel);
  if (!usaGitHub()) {
    const abs = path.join(process.cwd(), ruta);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
    return;
  }
  const sha = await shaExistente(ruta);
  if (!sha) return;
  const res = await githubApi(`contents/${ruta}`, {
    method: "DELETE",
    body: JSON.stringify({ message: mensaje, sha, branch: BRANCH }),
  });
  if (!res.ok) {
    throw new Error(`GitHub respondió ${res.status}: ${await res.text()}`);
  }
}
