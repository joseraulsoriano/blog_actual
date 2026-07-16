"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Entry, RecuerdoMeta } from "@/lib/content";
import { DecodeText } from "@/components/home/decode-text";
import { fechaRecuerdoISO, textoRecuerdo } from "@/lib/recuerdos";
import { cn } from "@/lib/utils";

function fechaCorta(fecha: string) {
  const iso = fechaRecuerdoISO(fecha);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fecha.slice(0, 10);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = new Intl.DateTimeFormat("es-MX", { month: "short" })
    .format(d)
    .replace(".", "")
    .toUpperCase();
  return `${dia} ${mes}`;
}

function lineaForo(texto: string, max = 72): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  const primera =
    limpio.split(/(?<=[.!?])\s+/)[0]?.trim() || limpio;
  if (primera.length <= max) return primera;
  return `${primera.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Lo último = escena en 3ª persona: miras la PC de alguien
 * programando que escribe un post tipo foro.
 */
export function HomeUltimo({ post }: { post: Entry<RecuerdoMeta> }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const iso = fechaRecuerdoISO(post.data.fecha);
  const fecha = fechaCorta(post.data.fecha);
  const linea = useMemo(
    () => lineaForo(textoRecuerdo(post)),
    [post]
  );

  return (
    <section
      ref={ref}
      className="relative px-5 pb-32 pt-20 sm:px-8 sm:pb-40 sm:pt-28"
      aria-labelledby="ultimo-heading"
    >
      <div className="mx-auto max-w-xl">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          sesión remota
        </p>
        <h2 id="ultimo-heading" className="sr-only">
          Lo último
        </h2>

        <Link
          href={`/recuerdos#${post.slug}`}
          className={cn(
            "group block font-mono outline-none",
            "focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            "transition-opacity duration-500",
            inView ? "opacity-100" : "opacity-45"
          )}
        >
          {/* Title bar ASCII */}
          <div
            className="flex items-baseline gap-2 overflow-hidden border border-b-0 border-white/25 bg-white/[0.04] px-3 py-1.5 text-[11px] leading-none text-white/45 sm:text-[12px]"
            aria-hidden
          >
            <span className="shrink-0 text-white/55">┌─</span>
            <span className="min-w-0 truncate tracking-wide">
              chasse@legado — foro
            </span>
            <span className="hidden flex-1 truncate text-white/20 sm:inline">
              {"─".repeat(16)}
            </span>
            <span className="ml-auto shrink-0 tracking-widest text-white/40">
              ● ○ ○ ┐
            </span>
          </div>

          {/* Terminal body */}
          <div className="border border-white/25 bg-black px-3 py-4 text-[12px] leading-relaxed sm:px-4 sm:py-5 sm:text-[13px]">
            <p className="text-white/30">
              <span className="text-primary/50">$</span>{" "}
              <span className="text-white/25">#</span> escribiendo…
            </p>

            <p className="mt-5 text-pretty text-primary">
              <span className="text-white/40" aria-hidden>
                {"> "}
              </span>
              {inView ? (
                <DecodeText
                  text={linea}
                  active={inView}
                  delayMs={180}
                  durationMs={1300}
                  className="!inline !font-mono !font-normal text-[12px] sm:text-[13px]"
                />
              ) : (
                <span className="text-primary/55">{linea}</span>
              )}
              <span
                className={cn(
                  "ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.12em] bg-primary align-baseline shadow-[0_0_10px_oklch(1_0_0_/_0.55)]",
                  inView
                    ? "[animation:cursor-blink_1.1s_step-end_infinite]"
                    : "opacity-0"
                )}
                aria-hidden
              />
            </p>

            <p className="mt-8 flex flex-wrap items-center gap-x-2 text-[10px] tracking-[0.16em] text-white/30">
              <time dateTime={iso}>{fecha}</time>
              <span aria-hidden>·</span>
              <span className="text-white/40 transition-colors group-hover:text-primary">
                timeline →
              </span>
            </p>
          </div>

          <p
            className="overflow-hidden border border-t-0 border-white/25 bg-black px-3 py-1 text-[11px] leading-none text-white/35"
            aria-hidden
          >
            └{"─".repeat(36)}┘
          </p>
        </Link>
      </div>
    </section>
  );
}
