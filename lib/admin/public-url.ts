/** Origen público del blog (con /blog). */
export function blogPublicBase(req: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "joserauldev.qzz.io";
  return `${proto}://${host}/blog`;
}

/** Redirect 303 a una ruta del blog (path sin /blog, p.ej. `/privado`). */
export function redirectBlog(req: Request, path: string): Response {
  const base = blogPublicBase(req);
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return Response.redirect(`${base}${suffix}`, 303);
}
