"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AsciiGlobe, type CiudadGlobo } from "@/components/retro/ascii-globe";
import { cn } from "@/lib/utils";

export const FRASES_IDENTIDAD = [
  "Coleccionista de recuerdos.",
  "Constructor de piezas.",
  "Habitante de ciudades.",
  "Testigo de noches.",
  "Aprendiz sin prisa.",
] as const;

function FraseRotator({ frases }: { frases: readonly string[] }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setVisible(false);
      hideTimer = setTimeout(() => {
        setI((n) => (n + 1) % frases.length);
        setVisible(true);
      }, 380);
    }, 4800);

    return () => {
      clearInterval(id);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [frases.length]);

  return (
    <p
      className={cn(
        "min-h-[1.4em] text-center text-pretty text-lg font-light tracking-[-0.02em] text-white/70 transition-opacity duration-500 sm:text-xl",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-live="polite"
    >
      {frases[i]}
    </p>
  );
}

export function HomeGlobeHero({ cities }: { cities: CiudadGlobo[] }) {
  const router = useRouter();
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-24 pt-12 sm:px-6"
      aria-labelledby="home-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, oklch(1 0 0 / 9%) 0%, transparent 68%)",
        }}
      />

      <h1
        id="home-hero-title"
        className="relative mb-4 text-balance text-center text-[clamp(2.25rem,7vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-primary neon-text"
      >
        José Raúl Soriano
      </h1>

      <div className="relative mb-10 max-w-lg">
        <FraseRotator frases={FRASES_IDENTIDAD} />
      </div>

      <div className="relative flex w-full max-w-3xl justify-center overflow-visible">
        <AsciiGlobe
          cities={cities}
          size="lg"
          showLabels
          selected={focus}
          onSelect={(slug) => {
            setFocus(slug);
            router.push(`/viajes?ciudad=${slug}`);
          }}
        />
      </div>
    </section>
  );
}
