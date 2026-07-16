import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Incluye el contenido MDX en el bundle serverless (lib/content lee con fs).
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
