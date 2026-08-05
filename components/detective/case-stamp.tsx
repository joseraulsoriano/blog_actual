import { cn } from "@/lib/utils";

/** Sello de tinta roja — el único acento de color del sitio. */
export function CaseStamp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "case-stamp inline-block -rotate-[5deg] rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]",
        className
      )}
    >
      {children}
    </span>
  );
}
