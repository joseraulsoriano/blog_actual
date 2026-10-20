import type { NextConfig } from "next";
import { BASE_PATH } from "./lib/base-path";

const nextConfig: NextConfig = {
  // Subdominio propio (blog.joseraulsoriano.com): sin basePath. Ver lib/base-path.ts.
  basePath: BASE_PATH,
  // Incluye el contenido MDX en el bundle serverless (lib/content lee con fs).
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  // CSRF de Server Actions: hosts desde los que se sirve el blog.
  experimental: {
    serverActions: {
      allowedOrigins: [
        "blog.joseraulsoriano.com",
        "blog-actual.vercel.app",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
