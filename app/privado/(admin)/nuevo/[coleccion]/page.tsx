import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorForm } from "@/components/admin/editor-form";
import { PostComposer } from "@/components/admin/post-composer";
import { PageHeader } from "@/components/site/page-shell";
import { crearEntrada } from "@/app/privado/(admin)/actions";
import { ESQUEMAS, esColeccionValida } from "@/lib/admin/schemas";

export default async function NuevoPage({
  params,
}: {
  params: Promise<{ coleccion: string }>;
}) {
  const { coleccion } = await params;
  if (!esColeccionValida(coleccion)) notFound();
  const esquema = ESQUEMAS[coleccion];

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
        eyebrow="Nueva entrada"
        title={esquema.titulo}
        lede={esquema.descripcion}
        className="mb-8"
      />

      {coleccion === "recuerdos" ? (
        <PostComposer
          slug=""
          fecha=""
          texto=""
          esNuevo
          accion={crearEntrada}
        />
      ) : (
        <EditorForm
          esquema={esquema}
          slug=""
          valores={{}}
          body={esquema.plantillaBody}
          esNuevo
          accion={crearEntrada}
        />
      )}
    </div>
  );
}
