import type { MetadataRoute } from "next";
import { getSiteUrl, esHostCanonico } from "@/lib/site-url";
import { urlAbsoluta } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Previews y el dominio *.vercel.app sirven el mismo contenido que el
  // dominio real: si se indexan, competimos contra nosotros mismos.
  if (!esHostCanonico()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/privado", "/privado/", "/api/"],
    },
    sitemap: urlAbsoluta("/sitemap.xml"),
    host: getSiteUrl(),
  };
}
