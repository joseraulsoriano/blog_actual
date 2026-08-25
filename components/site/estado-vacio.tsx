/** Estado vacío con la voz del sitio, no un "no hay datos". */
export function EstadoVacio({
  titulo,
  detalle,
}: {
  titulo: string;
  detalle?: string;
}) {
  return (
    <div className="border border-white/[0.12] bg-white/[0.02] px-6 py-12 text-center">
      <p
        className="mx-auto mb-4 h-px w-10 bg-white/40 shadow-[0_0_12px_oklch(1_0_0_/_0.4)]"
        aria-hidden
      />
      <p className="text-pretty text-base text-primary">{titulo}</p>
      {detalle ? (
        <p className="mx-auto mt-2 max-w-sm text-pretty text-sm text-muted-foreground">
          {detalle}
        </p>
      ) : null}
    </div>
  );
}
