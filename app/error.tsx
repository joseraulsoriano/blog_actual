"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Frontera de error: sin esto, un fallo de lectura muestra la pantalla cruda de Next. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[blog]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-5 text-center">
      <p
        className="mb-6 h-px w-12 bg-white/50 shadow-[0_0_14px_oklch(1_0_0_/_0.45)]"
        aria-hidden
      />
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em] text-primary neon-text">
        Se rompió algo de este lado
      </h1>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        No es tu conexión. El archivo no pudo abrirse.
      </p>
      {error.digest ? (
        <p className="mt-4 font-mono text-[11px] text-white/55">
          ref: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Button variant="ghost" render={<Link href="/">Volver al inicio</Link>} />
      </div>
    </div>
  );
}
