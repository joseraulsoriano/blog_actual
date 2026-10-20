/**
 * El blog vive en su propio subdominio (blog.joseraulsoriano.com), así que no lleva basePath.
 * Antes se servía bajo joseraulsoriano.com/blog por un rewrite del portafolio; si algún día vuelve
 * a una subruta, basta con poner aquí "/blog": next/link antepone el basePath solo, pero un
 * `<img src="/…">` de MDX no, y para eso existe withBasePath.
 */
export const BASE_PATH: string = "";

/** Ruta de un asset propio de `public/`, ya con el basePath incluido. */
export function withBasePath(path: string): string {
  if (!BASE_PATH || !path.startsWith("/")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
