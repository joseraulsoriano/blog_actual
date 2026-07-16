"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Escribe el texto carácter a carácter, como una terminal.
 * Respeta prefers-reduced-motion mostrando el texto completo de inmediato.
 */
export function Typewriter({
  text,
  speed = 35,
  startDelay = 0,
  className,
  cursor = true,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  cursor?: boolean;
}) {
  const [count, setCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  const done = count >= text.length;
  return (
    <span
      className={cn(cursor && (done || reduced) && "cursor-blink", className)}
      aria-label={text}
    >
      {text.slice(0, count)}
    </span>
  );
}
