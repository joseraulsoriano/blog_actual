import { urlAbsoluta } from "@/lib/seo";

const APP_STORE_URL = "https://apps.apple.com/app/id6813908007";
const PORTAFOLIO_URL = "https://joseraulsoriano.com";

/**
 * JSON-LD de las apps publicadas, por slug de proyecto. Liga la app con la persona
 * (mismo `@id` que usa el portafolio) para que el buscador junte nombre, app y App Store.
 */
export function jsonLdApp(slug: string) {
  if (slug !== "collection-legend") return null;
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Collection Legend",
    alternateName: ["Legend", "Legend app"],
    description:
      "App para iPhone donde guardas las cosas de tu vida junto con el porqué importaron; con el tiempo se vuelven un archivo de quién fuiste.",
    url: urlAbsoluta(`/proyectos/${slug}`),
    installUrl: APP_STORE_URL,
    downloadUrl: APP_STORE_URL,
    sameAs: [APP_STORE_URL, `${PORTAFOLIO_URL}/projects/collection-legend`],
    operatingSystem: "iOS 18.0 o posterior",
    applicationCategory: "LifestyleApplication",
    datePublished: "2026-11-19",
    softwareVersion: "1.1",
    inLanguage: ["es", "en"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      "@id": `${PORTAFOLIO_URL}#person`,
      name: "José Raúl Soriano Cazabal",
      url: PORTAFOLIO_URL,
    },
  };
}
