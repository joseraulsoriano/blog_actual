/**
 * URL pública del blog (incluye basePath /blog).
 * En producción detrás del portafolio: https://joserauldev.qzz.io/blog
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}/blog`;
  }

  return "http://localhost:3000/blog";
}

/**
 * ¿Estamos sirviendo desde el dominio público real?
 * En preview o en blog-actual.vercel.app la respuesta es no, y entonces
 * el sitio no debe permitir indexación (contenido duplicado).
 */
export function esHostCanonico(): boolean {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return false;
  }
  const canonico = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!canonico) return process.env.VERCEL !== "1";

  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (!host) return true;
  try {
    return new URL(canonico).hostname === host;
  } catch {
    return true;
  }
}
