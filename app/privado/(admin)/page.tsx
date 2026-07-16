import Link from "next/link";
import { getCollection, type RecuerdoMeta } from "@/lib/content";
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

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; borrado?: string }>;
}) {
  const { ok, borrado } = await searchParams;

  return (
    <div>
      <PageHeader
        eyebrow="Administración"
        title="Contenido"
        lede="Publica posts en Recuerdos y edita el resto del archivo sin tocar código."
        className="mb-8"
      />
      {ok ? (
        <p className="mb-4 text-sm text-primary">Guardado: {ok}</p>
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
                  <Link href={`/privado/nuevo/${esquema.coleccion}`}>
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
