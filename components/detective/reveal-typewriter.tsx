"use client";

import { useEffect, useRef, useState } from "react";
import { Typewriter } from "@/components/retro/typewriter";
import { cn } from "@/lib/utils";

/** Monta <Typewriter> solo cuando el bloque entra en viewport. */
export function RevealTypewriter({
  text,
  speed = 18,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p ref={ref} className={cn("min-h-[1em]", className)}>
      {inView ? <Typewriter text={text} speed={speed} cursor /> : text}
    </p>
  );
}
