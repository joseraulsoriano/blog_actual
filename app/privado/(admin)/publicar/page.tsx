import Link from "next/link";
import { esBorrador, getCollection } from "@/lib/content";
import { esquemasPublicables } from "@/lib/admin/schemas";
import { PageHeader } from "@/components/site/page-shell";

/**
 * Hub de publicación: un solo lugar para decidir qué vas a publicar.
 * Las tarjetas salen de ESQUEMAS — añadir una colección la añade aquí.
 */
export default function PublicarPage() {
  const esquemas = esquemasPublicables();

  return (
    <div>
      <PageHeader
        eyebrow="Publicar"
        title="¿Qué vas a publicar?"
        lede="Todo lo que escribas aquí termina en un .mdx dentro del repo. Elige el formato y escribe."
        className="mb-8"
      />

      <ul role="list" className="grid gap-4 sm:grid-cols-2">
        {esquemas.map((esquema) => {
          const entradas = getCollection<Record<string, unknown>>(
            esquema.coleccion
          );
          const borradores = entradas.filter((e) => esBorrador(e.data)).length;

          return (
            <li key={esquema.coleccion}>
              <Link
                href={`/privado/publicar/${esquema.coleccion}`}
                className="group flex h-full flex-col border border-white/[0.12] bg-white/[0.02] p-5 transition-colors hover:border-white/35 hover:bg-white/[0.05]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {esquema.coleccion}
                  <span className="float-right tabular-nums text-white/55">
                    {entradas.length}
                  </span>
                </p>

                <h2 className="mt-3 text-lg tracking-[-0.02em] text-primary group-hover:neon-text">
                  {esquema.titulo}
                </h2>

                <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-foreground/70">
                  {esquema.quePublica ?? esquema.descripcion}
                </p>

                <p className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/55">
                  <span>{borradores > 0 ? `${borradores} en borrador` : ""}</span>
                  <span className="transition-colors group-hover:text-primary">
                    Escribir →
                  </span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-sm text-muted-foreground">
        ¿Buscas editar algo ya publicado?{" "}
        <Link
          href="/privado"
          className="text-primary underline-offset-4 hover:underline"
        >
          Ir al panel
        </Link>
        .
      </p>
    </div>
  );
}
