import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Zona /blog bajo joserauldev.qzz.io (portafolio hace rewrite → este proyecto).
  basePath: "/blog",
  // Incluye el contenido MDX en el bundle serverless (lib/content lee con fs).
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  // CSRF de Server Actions: el Host visible es el del portafolio (proxy CDN).
  experimental: {
    serverActions: {
      allowedOrigins: [
        "joserauldev.qzz.io",
        "blog-actual.vercel.app",
        "localhost:3000",
      ],
    },
  },
  // Sin esto, https://blog-actual.vercel.app/ da 404 (Vercel NOT_FOUND).
  async redirects() {
    return [
      {
        source: "/",
        destination: "/blog",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
