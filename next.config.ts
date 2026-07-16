import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Zona /blog bajo joserauldev.qzz.io (portafolio hace rewrite → este proyecto).
  basePath: "/blog",
  // Incluye el contenido MDX en el bundle serverless (lib/content lee con fs).
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
