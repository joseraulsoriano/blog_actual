import Link from "next/link";
import type { Entry, RecuerdoMeta } from "@/lib/content";
import {
  fechaRecuerdoISO,
  formatFechaPost,
  textoRecuerdo,
} from "@/lib/recuerdos";
import { cn } from "@/lib/utils";

function labelEnlace(href: string): string {
  if (href.startsWith("http")) {
    try {
      return new URL(href).hostname.replace(/^www\./, "");
    } catch {
      return href.replace(/^https?:\/\//, "");
    }
  }
  const partes = href.replace(/^\//, "").split("/");
  return partes[partes.length - 1] || href;
}

export function PostCard({
  r,
  className,
}: {
  r: Entry<RecuerdoMeta>;
  className?: string;
}) {
  const texto = textoRecuerdo(r);
  const iso = fechaRecuerdoISO(r.data.fecha);

  return (
    <article
      id={r.slug}
      className={cn("group scroll-mt-8 py-8 first:pt-0", className)}
    >
      <time
        className="block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
        dateTime={iso}
      >
        {formatFechaPost(r.data.fecha)}
      </time>

      <p className="mt-3 max-w-prose text-pretty text-[1.05rem] leading-[1.65] tracking-[-0.01em] text-foreground/90 sm:text-lg sm:leading-[1.7]">
        {texto}
      </p>

      {r.data.enlace ? (
        <p className="mt-4">
          <Link
            href={r.data.enlace}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-primary"
          >
            <span aria-hidden className="text-white/25">
              →
            </span>
            {labelEnlace(r.data.enlace)}
          </Link>
        </p>
      ) : null}
    </article>
  );
}
