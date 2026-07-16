import { cn } from "@/lib/utils";

/** Marco con acento blanco neón. */
export function TerminalWindow({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border border-white/[0.14] bg-white/[0.02]",
        className
      )}
    >
      <header className="flex items-center gap-2 border-b border-white/[0.1] px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground select-none">
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" aria-hidden />
        <span className="ml-2 truncate text-foreground/70">{title}</span>
      </header>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

/** Línea de prompt minimal. */
export function PromptLine({
  command,
  path = "~",
  className,
}: {
  command: string;
  path?: string;
  className?: string;
}) {
  return (
    <p className={cn("text-sm", className)}>
      <span className="text-muted-foreground">chasse@{path}</span>
      <span className="text-muted-foreground"> $ </span>
      <span className="terminal-glow text-primary">{command}</span>
    </p>
  );
}

/** Barra de progreso ASCII. */
export function AsciiBar({
  value,
  max = 5,
  width = 10,
  label,
  className,
}: {
  value: number;
  max?: number;
  width?: number;
  label?: string;
  className?: string;
}) {
  const filled = Math.round((value / max) * width);
  return (
    <span
      className={cn("whitespace-nowrap text-sm", className)}
      role="img"
      aria-label={`${value} de ${max}`}
    >
      <span className="text-muted-foreground">[</span>
      <span className="text-primary terminal-glow">{"█".repeat(filled)}</span>
      <span className="text-muted-foreground/50">{"░".repeat(width - filled)}</span>
      <span className="text-muted-foreground">]</span>
      {label ? <span className="ml-2 text-muted-foreground">{label}</span> : null}
    </span>
  );
}
