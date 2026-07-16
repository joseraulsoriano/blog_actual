import { redirect } from "next/navigation";

/** Los posts viven en el feed; el slug solo ancla. */
export default async function RecuerdoRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/recuerdos#${slug}`);
}
