import { cn } from "@/lib/utils";

const LOGO = String.raw`
 ██████╗██╗  ██╗ █████╗ ███████╗███████╗███████╗
██╔════╝██║  ██║██╔══██╗██╔════╝██╔════╝██╔════╝
██║     ███████║███████║███████╗███████╗█████╗
██║     ██╔══██║██╔══██║╚════██║╚════██║██╔══╝
╚██████╗██║  ██║██║  ██║███████║███████║███████╗
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
`.replace(/^\n/, "");

export function AsciiLogo({ className }: { className?: string }) {
  return (
    <pre
      aria-label="CHASSE"
      className={cn(
        "terminal-glow overflow-x-auto text-[clamp(0.32rem,1.6vw,0.8rem)] leading-tight text-primary select-none",
        className
      )}
    >
      {LOGO}
    </pre>
  );
}
