/** Esqueleto sobrio mientras el contenido llega; respeta el ritmo de PageShell. */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="animate-pulse space-y-4" aria-hidden>
        <div className="h-2.5 w-24 bg-white/[0.09]" />
        <div className="h-10 w-3/4 bg-white/[0.07]" />
        <div className="h-px w-16 bg-white/20" />
        <div className="space-y-3 pt-8">
          <div className="h-3 w-full bg-white/[0.05]" />
          <div className="h-3 w-11/12 bg-white/[0.05]" />
          <div className="h-3 w-4/5 bg-white/[0.05]" />
        </div>
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
