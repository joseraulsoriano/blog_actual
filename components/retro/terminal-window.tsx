import { cn } from "@/lib/utils";

/** Marco de ventana estilo terminal con barra de título ASCII. */
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
    <section className={cn("border border-border bg-card", className)}>
      <header className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground select-none">
        <span aria-hidden>●</span>
        <span aria-hidden>●</span>
        <span aria-hidden>●</span>
        <span className="ml-2 truncate">┌─[ {title} ]</span>
      </header>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

/** Línea de prompt: chasse@legado:~$ <comando> */
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
      <span className="text-accent">chasse@legado</span>
      <span className="text-muted-foreground">:{path}$</span>{" "}
      <span className="terminal-glow">{command}</span>
    </p>
  );
}

/** Barra de progreso ASCII: [████████░░] 4.0/5 */
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
      <span className="text-primary">{"█".repeat(filled)}</span>
      <span className="text-muted-foreground/50">{"░".repeat(width - filled)}</span>
      <span className="text-muted-foreground">]</span>
      {label ? <span className="ml-2 text-muted-foreground">{label}</span> : null}
    </span>
  );
}
