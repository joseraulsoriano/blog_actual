import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** URL absoluta de una ruta del blog (`path` sin /blog). */
export function urlAbsoluta(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Metadata de página con canónica explícita.
 * `metadataBase` por sí solo NO emite <link rel="canonical">: sin esto,
 * blog-actual.vercel.app y joserauldev.qzz.io/blog compiten por el mismo
 * contenido en el índice de Google.
 */
export function metaPagina({
  title,
  description,
  path,
  imagen,
  tipo = "website",
  publicado,
}: {
  title: string;
  description?: string;
  path: string;
  imagen?: string;
  tipo?: "website" | "article";
  publicado?: string;
}): Metadata {
  const url = urlAbsoluta(path);
  const images = imagen ? [{ url: imagen }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: tipo,
      url,
      title,
      description,
      siteName: "José Raúl Soriano",
      locale: "es_MX",
      ...(images ? { images } : {}),
      ...(publicado ? { publishedTime: publicado } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
