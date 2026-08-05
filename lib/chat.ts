import "server-only";
import fs from "node:fs";
import path from "node:path";
import { escribirArchivo } from "@/lib/admin/store";
import type { ChatMensaje } from "@/lib/chat-types";

export type { ChatMensaje };

const RUTA = "content/chat/mensajes.json";
const MAX_MENSAJES = 80;
const MAX_TEXTO = 240;
const MAX_NOMBRE = 24;

function absLocal(): string {
  return path.join(process.cwd(), RUTA);
}

function parseLista(raw: string): ChatMensaje[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (m): m is ChatMensaje =>
        !!m &&
        typeof m === "object" &&
        typeof (m as ChatMensaje).id === "string" &&
        typeof (m as ChatMensaje).nombre === "string" &&
        typeof (m as ChatMensaje).texto === "string" &&
        typeof (m as ChatMensaje).fecha === "string"
    );
  } catch {
    return [];
  }
}

async function leerRawDesdeGitHub(): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const repo = process.env.GITHUB_REPO ?? "joseraulsoriano/blog_actual";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${RUTA}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { content?: string; encoding?: string };
  if (!data.content) return null;
  return Buffer.from(data.content, "base64").toString("utf8");
}

export async function leerChat(): Promise<ChatMensaje[]> {
  const enProd =
    process.env.VERCEL === "1" || process.env.ADMIN_STORE === "github";
  if (enProd) {
    const raw = await leerRawDesdeGitHub();
    if (raw) return parseLista(raw);
  }
  const abs = absLocal();
  if (!fs.existsSync(abs)) return [];
  return parseLista(fs.readFileSync(abs, "utf8"));
}

export function sanitizarNombre(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim().slice(0, MAX_NOMBRE);
  if (!t) return "anon";
  return t.replace(/[<>]/g, "");
}

export function sanitizarTexto(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, MAX_TEXTO);
}

export async function agregarMensaje(input: {
  nombre: string;
  texto: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const nombre = sanitizarNombre(input.nombre);
  const texto = sanitizarTexto(input.texto);
  if (texto.length < 1) return { ok: false, error: "vacío" };
  if (texto.length > MAX_TEXTO) return { ok: false, error: "largo" };

  const actual = await leerChat();
  const mensaje: ChatMensaje = {
    id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    nombre,
    texto,
    fecha: new Date().toISOString(),
  };
  const lista = [...actual, mensaje].slice(-MAX_MENSAJES);
  const json = `${JSON.stringify(lista, null, 2)}\n`;
  await escribirArchivo(RUTA, Buffer.from(json), `chat: ${nombre}`);
  return { ok: true };
}
