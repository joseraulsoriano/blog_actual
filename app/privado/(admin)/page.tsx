import Link from "next/link";
import { esBorrador, getCollection, type RecuerdoMeta } from "@/lib/content";
import { ESQUEMAS } from "@/lib/admin/schemas";
import { etiquetaRecuerdo } from "@/lib/recuerdos";
import { PageHeader } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

function etiqueta(
  coleccion: string,
  entry: { slug: string; data: Record<string, unknown>; content: string }
): string {
  if (coleccion === "recuerdos") {
    return etiquetaRecuerdo({
      slug: entry.slug,
      data: entry.data as RecuerdoMeta,
      content: entry.content,
    });
  }
  return String(entry.data.title ?? entry.data.ciudad ?? entry.slug);
}

/** Enlace público de lo recién guardado, si su colección tiene página propia. */
function rutaPublica(ok: string): string | null {
  const [coleccion, slug] = ok.split("/");
  const base = coleccion ? ESQUEMAS[coleccion]?.rutaPublica : undefined;
  return base && slug ? `${base}/${slug}` : null;
}

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; borrado?: string; estado?: string }>;
}) {
  const { ok, borrado, estado } = await searchParams;
  const enlace = ok ? rutaPublica(ok) : null;

  return (
    <div>
      <PageHeader
        eyebrow="Administración"
        title="Contenido"
        lede="Publica escritos, opiniones, recursos, eventos y posts sin tocar código."
        className="mb-8"
      />

      <div className="mb-8 flex flex-wrap items-center gap-3 border border-white/[0.12] bg-white/[0.02] px-4 py-3">
        <p className="flex-1 text-sm text-muted-foreground">
          Lo importante es publicar.
        </p>
        <Button render={<Link href="/privado/publicar">Publicar algo</Link>} />
      </div>

      {ok ? (
        <p className="mb-4 text-sm text-primary">
          {estado === "borrador" ? "Guardado como borrador" : "Publicado"}: {ok}
          {estado !== "borrador" && enlace ? (
            <>
              {" · "}
              <Link
                href={enlace}
                className="underline underline-offset-4"
                target="_blank"
              >
                verlo en el sitio ↗
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
      {borrado ? (
        <p className="mb-4 text-sm text-destructive">Eliminado: {borrado}</p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {Object.values(ESQUEMAS).map((esquema) => {
          const entradas = getCollection<Record<string, unknown>>(
            esquema.coleccion
          ).sort((a, b) => a.slug.localeCompare(b.slug));
          return (
            <section
              key={esquema.coleccion}
              className="border border-white/[0.12] bg-white/[0.02] p-5"
            >
              <h2 className="text-lg tracking-[-0.01em] text-primary">
                {esquema.coleccion}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {entradas.length}
                </span>
              </h2>
              <p className="mt-1 mb-4 text-xs text-muted-foreground">
                {esquema.descripcion}
              </p>
              <ul className="mb-4 space-y-2 text-sm">
                {entradas.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/privado/editar/${esquema.coleccion}/${e.slug}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {etiqueta(esquema.coleccion, e)}
                    </Link>
                    {esBorrador(e.data) ? (
                      <span className="ml-2 border border-white/20 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                        borrador
                      </span>
                    ) : null}
                  </li>
                ))}
                {entradas.length === 0 ? (
                  <li className="text-muted-foreground">Sin entradas aún</li>
                ) : null}
              </ul>
              <Button
                size="sm"
                variant="outline"
                render={
                  <Link href={`/privado/publicar/${esquema.coleccion}`}>
                    {esquema.coleccion === "recuerdos"
                      ? "Publicar post"
                      : "Nueva entrada"}
                  </Link>
                }
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
