/**
 * Importa fichas del portafolio → content/proyectos/*.mdx
 * Uso (desde blog_actual):
 *   npx tsx scripts/import-portafolio-projects.ts
 *
 * No sobrescribe MDX editoriales ya existentes (escritos, historias).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  projects,
  getProjectPortfolioGroup,
} from "../../../portafolio/lib/projects/index.ts";
import type { Project } from "../../../portafolio/lib/types.ts";

const OUT = path.join(process.cwd(), "content", "proyectos");

/** Slugs del blog que no se tocan (narrativa editorial). */
const PRESERVE = new Set([
  "365-dias-escribiendote",
  "para-mejorar-hay-que-crecer",
  "satisfaccion-dolorosa",
  "legado-digital",
  "portafolio-ux",
  "check-driver",
  "conectidoc",
  "future-funds",
  "ia-plus-art",
]);

/** Portafolio → blog (evitar duplicar la misma historia). */
const SKIP_IDS = new Set([
  "hack-mty", // → future-funds
  "hack-morelos", // → conectidoc
  "ia-arte", // → ia-plus-art
  "portfolio", // → legado-digital / portafolio-ux
]);

type Categoria =
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

const HUB_IDS = new Set([
  "cpp",
  "astro",
  "react-hub",
  "swift",
  "mongo-stack",
  "angular-hub",
  "mcp",
  "aws-hub",
  "django-hub",
]);

function inferAño(p: Project): number {
  const t = p.technical.timeEstimate ?? "";
  const m = t.match(/\b(20\d{2})\b/);
  if (m) return Number(m[1]);
  return new Date().getFullYear();
}

function inferCategoria(p: Project): Categoria {
  if (p.id.startsWith("hack-") || p.hackBadge) return "hackathon";
  if (p.technical.demoVideoUrl) return "video";
  if (p.id === "ia-arte" || p.id === "ia-astro" || p.id.includes("ia-"))
    return "ia-arte";
  if (p.id.includes("escritura") || p.id.includes("escrito")) return "escrito";
  if (p.id.includes("libro") || p.id.includes("poema")) return "libro";
  if (HUB_IDS.has(p.id)) return "hub";
  if (getProjectPortfolioGroup(p.id) === "real") return "producto";
  if (
    p.id.includes("swift") ||
    p.id.includes("app-") ||
    p.id.includes("mobile") ||
    p.id.includes("arduino")
  )
    return "mobile";
  if (
    p.id.includes("web") ||
    p.id.includes("astro") ||
    p.id.includes("angular") ||
    p.id.includes("react")
  )
    return "web";
  return "tech";
}

function enlace(p: Project): string | undefined {
  return (
    p.technical.demoUrl ||
    p.technical.demoVideoUrl ||
    p.technical.repo ||
    undefined
  );
}

function body(p: Project): string {
  const lines: string[] = [];
  lines.push(p.design.description.trim(), "");
  if (p.design.tagline) {
    lines.push(`> ${p.design.tagline}`, "");
  }
  if (p.design.highlights?.length) {
    lines.push("### Destacados", "");
    for (const h of p.design.highlights) {
      lines.push(`- **${h.title}** — ${h.description}`);
    }
    lines.push("");
  }
  if (p.technical.stack?.length) {
    lines.push("### Stack", "");
    lines.push(p.technical.stack.map((s) => `\`${s}\``).join(" · "), "");
  }
  if (p.technical.repo) {
    lines.push(`[Repositorio](${p.technical.repo})`, "");
  }
  if (p.technical.demoUrl) {
    lines.push(`[Demo](${p.technical.demoUrl})`, "");
  }
  if (p.technical.demoVideoUrl) {
    lines.push(`[Video](${p.technical.demoVideoUrl})`, "");
  }
  return lines.join("\n").trim() + "\n";
}

function origen(p: Project): string {
  const g = getProjectPortfolioGroup(p.id);
  if (g === "hacks") return "Hackathon";
  if (g === "real") return "Producción";
  return "Escuela / laboratorio";
}

let created = 0;
let skipped = 0;

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

for (const p of projects) {
  if (SKIP_IDS.has(p.id)) {
    skipped++;
    continue;
  }
  const slug = p.id;
  if (PRESERVE.has(slug)) {
    skipped++;
    continue;
  }
  const file = path.join(OUT, `${slug}.mdx`);
  if (fs.existsSync(file) && PRESERVE.has(slug)) {
    skipped++;
    continue;
  }
  // Si ya existe un MDX importado, lo regeneramos para mantener sync
  const data = {
    title: p.title,
    resumen: p.shortDescription,
    categoria: inferCategoria(p),
    año: inferAño(p),
    origen: origen(p),
    ...(enlace(p) ? { enlace: enlace(p) } : {}),
    portafolioId: p.id,
  };
  const md = matter.stringify(body(p), data);
  fs.writeFileSync(file, md);
  created++;
  console.log("+", slug);
}

console.log(`\nListo: ${created} creados/actualizados, ${skipped} omitidos.`);
