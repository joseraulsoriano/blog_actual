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
