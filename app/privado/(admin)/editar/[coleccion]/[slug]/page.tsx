import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorForm } from "@/components/admin/editor-form";
import { PostComposer } from "@/components/admin/post-composer";
import { PageHeader } from "@/components/site/page-shell";
import {
  eliminarEntrada,
  guardarEntrada,
} from "@/app/privado/(admin)/actions";
import { ESQUEMAS, esColeccionValida } from "@/lib/admin/schemas";
import { getEntry } from "@/lib/content";
import { textoRecuerdo } from "@/lib/recuerdos";

export default async function EditarPage({
  params,
}: {
  params: Promise<{ coleccion: string; slug: string }>;
}) {
  const { coleccion, slug } = await params;
  if (!esColeccionValida(coleccion)) notFound();
  const esquema = ESQUEMAS[coleccion];
  const entry = getEntry<Record<string, unknown>>(coleccion, slug);
  if (!entry) notFound();

  return (
    <div>
      <p className="mb-4 text-sm">
        <Link
          href="/privado"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Panel
        </Link>
      </p>
      <PageHeader
        eyebrow="Editar"
        title={
          coleccion === "recuerdos"
            ? "Post"
            : String(entry.data.title ?? entry.data.ciudad ?? slug)
        }
        lede={`${coleccion}/${slug}.mdx`}
        className="mb-8"
      />

      {coleccion === "recuerdos" ? (
        <PostComposer
          slug={slug}
          fecha={String(entry.data.fecha ?? "")}
          enlace={
            entry.data.enlace ? String(entry.data.enlace) : undefined
          }
          texto={textoRecuerdo({
            slug,
            data: entry.data as never,
            content: entry.content,
          })}
          esNuevo={false}
          accion={guardarEntrada}
          accionEliminar={eliminarEntrada}
        />
      ) : (
        <EditorForm
          esquema={esquema}
          slug={slug}
          valores={entry.data}
          body={entry.content}
          esNuevo={false}
          accion={guardarEntrada}
          accionEliminar={eliminarEntrada}
        />
      )}
    </div>
  );
}
