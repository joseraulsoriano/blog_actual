import { PromptLine, TerminalWindow } from "@/components/retro/terminal-window";

export function SectionPlaceholder({
  title,
  description,
  fase,
}: {
  title: string;
  description: string;
  fase: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <PromptLine command={`cd ~/${title.toLowerCase()}`} className="mb-4" />
      <TerminalWindow title={`${title.toLowerCase()} — en construcción`}>
        <p className="mb-2 text-sm text-destructive">
          bash: {title.toLowerCase()}: directorio en construcción ({fase})
        </p>
        <p className="leading-7 text-foreground/80">{description}</p>
        <p className="cursor-blink mt-4 text-muted-foreground" aria-hidden />
      </TerminalWindow>
    </div>
  );
}
