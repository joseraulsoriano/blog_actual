import Link from "next/link";

const ASCII_404 = `
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═████╗██║  ██║
 ███████║██║██╔██║███████║
 ╚════██║████╔╝██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝
`.replace(/^\n/, "");

const salidas = [
  { href: "/", label: "inicio" },
  { href: "/recuerdos", label: "recuerdos" },
  { href: "/proyectos", label: "proyectos" },
  { href: "/viajes", label: "viajes" },
] as const;

export default function NotFound() {
  return (
    <div className="relative flex min-h-[min(100dvh,52rem)] flex-col items-center justify-center px-5 py-24 sm:px-8">
      {/* Atmósfera */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,oklch(1_0_0_/_0.07),transparent_55%)]"
        aria-hidden
      />

      <p className="relative mb-6 font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
        <span className="text-primary/70">●</span> ruta no encontrada
      </p>

      <pre
        aria-label="404"
        className="terminal-glow relative overflow-x-auto whitespace-pre font-mono text-[clamp(0.45rem,2.4vw,0.85rem)] leading-[1.15] text-primary select-none"
      >
        {ASCII_404}
      </pre>

      <div className="relative mt-10 max-w-md text-center">
        <h1 className="font-mono text-sm tracking-[0.18em] text-primary sm:text-base">
          este archivo no existe
          <span
            className="ml-1 inline-block h-[0.95em] w-[0.45em] translate-y-[0.1em] bg-primary align-baseline shadow-[0_0_10px_oklch(1_0_0_/_0.55)] [animation:cursor-blink_1.1s_step-end_infinite]"
            aria-hidden
          />
        </h1>
      </div>

      <nav
        aria-label="Salidas"
        className="relative mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
      >
        {salidas.map(({ href, label }, i) => (
          <span key={href} className="flex items-center gap-5">
            {i > 0 ? (
              <span className="text-white/15" aria-hidden>
                ·
              </span>
            ) : null}
            <Link
              href={href}
              className="font-mono text-[11px] tracking-[0.2em] text-white/50 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {label}
            </Link>
          </span>
        ))}
      </nav>

      <Link
        href="/"
        className="relative mt-12 inline-flex items-center gap-2 border border-white/25 bg-white/[0.04] px-5 py-2.5 font-mono text-[11px] tracking-[0.22em] text-primary shadow-[0_0_24px_oklch(1_0_0_/_0.08)] transition-[border-color,box-shadow,background-color] hover:border-white/50 hover:bg-white/[0.08] hover:shadow-[0_0_32px_oklch(1_0_0_/_0.18)]"
      >
        ← volver al inicio
      </Link>
    </div>
  );
}
