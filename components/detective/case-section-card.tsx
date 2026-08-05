import type { ReactNode } from "react";

/** Hash estable (no Math.random — debe coincidir en servidor y cliente). */
function seed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

/** Tarjeta anclada al pizarrón — contenido completo de una sección real de bio.mdx. */
export function CaseSectionCard({
  id,
  title,
  children,
  index,
}: {
  id: string;
  title: string;
  children: ReactNode;
  index: number;
}) {
  const s = seed(id);
  const tilt = ((s % 9) - 4) * 1.4; // -5.6deg .. 5.6deg
  const jitter = ((s >> 3) % 13) - 6; // -6px .. 6px

  return (
    <li
      className="case-card relative w-full min-w-0 select-none"
      style={
        {
          "--tilt": `${tilt}deg`,
          "--jitter": `${jitter}px`,
          "--delay": `${index * 90}ms`,
        } as React.CSSProperties
      }
    >
      <span
        data-pin
        aria-hidden
        className="case-pin absolute left-1/2 top-0 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--thread)]"
      />
      <div className="case-card-body relative border border-white/[0.14] bg-[oklch(0.07_0_0)] p-4 pt-6">
        <p className="mb-2 text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {title}
        </p>
        <div className="case-section-prose">{children}</div>
      </div>
    </li>
  );
}
