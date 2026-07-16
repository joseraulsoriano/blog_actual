import { PageHeader, PageShell } from "@/components/site/page-shell";

export function SectionPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
  /** @deprecated Ya no se muestra; se mantiene por compat. */
  fase?: string;
}) {
  return (
    <PageShell>
      <PageHeader eyebrow="En construcción" title={title} lede={description} />
    </PageShell>
  );
}
