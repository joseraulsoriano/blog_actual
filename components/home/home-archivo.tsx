"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DecodeText } from "@/components/home/decode-text";
import { cn } from "@/lib/utils";

const puertas = [
  { href: "/bio", palabra: "Orígenes" },
  { href: "/proyectos", palabra: "Piezas" },
  { href: "/opiniones", palabra: "Opiniones" },
  { href: "/recursos", palabra: "Recursos" },
  { href: "/eventos", palabra: "Noches" },
  { href: "/viajes", palabra: "Ciudades" },
  { href: "/recuerdos", palabra: "Recuerdos" },
] as const;

/** Archivo: tipografía grande con decode retro al entrar en vista. */
export function HomeArchivo() {
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

  return (
    <section
      ref={ref}
      className="relative px-5 py-24 sm:px-8 sm:py-32"
      aria-label="Archivo"
    >
      <div className="mx-auto max-w-3xl">
        <ul className="space-y-0 sm:space-y-1">
          {puertas.map((p, i) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className={cn(
                  "group block py-1.5 text-[clamp(2.5rem,9vw,5rem)] leading-[0.95] tracking-[-0.04em] transition-colors",
                  "hover:brightness-125"
                )}
              >
                <DecodeText
                  text={p.palabra}
                  active={inView}
                  delayMs={i * 120}
                  durationMs={1000}
                  className="group-hover:neon-text"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
