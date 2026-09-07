/**
 * El blog se sirve bajo /blog (el portafolio hace el rewrite).
 * next/link antepone el basePath solo; un `<img src="/…">` de MDX no.
 */
export const BASE_PATH = "/blog";

/** Ruta de un asset propio de `public/`, ya con el basePath incluido. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
