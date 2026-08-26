import { redirect } from "next/navigation";

/** Ruta vieja: todo lo nuevo se crea desde /privado/publicar. */
export default async function NuevoPage({
  params,
}: {
  params: Promise<{ coleccion: string }>;
}) {
  const { coleccion } = await params;
  redirect(`/privado/publicar/${coleccion}`);
}
