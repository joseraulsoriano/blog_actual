"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáéíóúñÁÉÍÓÚÑ";

function randomLetter(like?: string) {
  // Preferir mayúscula/minúscula similar a la letra final
  if (like && like !== like.toLowerCase()) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ";
    return upper[Math.floor(Math.random() * upper.length)] ?? "A";
  }
  if (like && like !== like.toUpperCase()) {
    const lower = "abcdefghijklmnopqrstuvwxyzáéíóúñ";
    return lower[Math.floor(Math.random() * lower.length)] ?? "a";
  }
  return LETTERS[Math.floor(Math.random() * LETTERS.length)] ?? "a";
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Decode fluido: desde el primer frame se ve forma de palabra (letras),
 * y se estabiliza suavemente hasta el texto final.
 */
export function DecodeText({
  text,
  active,
  delayMs = 0,
  durationMs = 1100,
  className,
}: {
  text: string;
  active: boolean;
  delayMs?: number;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      setDone(true);
      return;
    }

    const chars = text.split("");
    // Arranque: misma longitud, solo letras → se lee como “palabra”
    setDisplay(
      chars.map((ch) => (ch === " " ? " " : randomLetter(ch))).join("")
    );

    let cancelled = false;
    const startAt = performance.now() + delayMs;

    const tick = (now: number) => {
      if (cancelled) return;

      if (now < startAt) {
        // Mientras espera el delay, sigue “respirando” como palabra inestable
        setDisplay(
          chars
            .map((ch) => (ch === " " ? " " : randomLetter(ch)))
            .join("")
        );
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const raw = Math.min(1, (now - startAt) / durationMs);
      const t = easeOutCubic(raw);

      setDisplay(
        chars
          .map((ch, i) => {
            if (ch === " ") return " ";
            // Umbral por posición: izquierda se fija antes (ola suave)
            const threshold = (i + 0.65) / (chars.length + 0.65);
            if (t >= threshold) return ch;
            // Cerca del umbral: más probabilidad de letra correcta (fluidez)
            const near = t / threshold;
            if (Math.random() < near * near * 0.85) return ch;
            return randomLetter(ch);
          })
          .join("")
      );

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        setDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, delayMs, durationMs, text]);

  return (
    <span
      className={cn(
        "inline-block font-semibold",
        done ? "text-primary neon-text" : "text-primary/80",
        className
      )}
      aria-label={text}
    >
      <span aria-hidden>{display}</span>
    </span>
  );
}
