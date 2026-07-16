import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  wide,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full px-5 py-14 sm:px-8 sm:py-20",
        wide ? "max-w-6xl" : "max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-12 sm:mb-14", className)}>
      {eyebrow ? (
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-primary neon-text">
        {title}
      </h1>
      {lede ? (
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lede}
        </p>
      ) : null}
      <div
        className="mt-8 h-px w-16 bg-white/70 shadow-[0_0_16px_oklch(1_0_0_/_0.45)]"
        aria-hidden
      />
    </header>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <p className="mt-12">
      <a
        href={href}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← {label}
      </a>
    </p>
  );
}
