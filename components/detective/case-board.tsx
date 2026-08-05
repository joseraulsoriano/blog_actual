"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Pizarrón de investigación: secciones ancladas, unidas por hilo rojo en orden. */
export function CaseBoard({ children }: { children: ReactNode }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [path, setPath] = useState("");

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const boardRect = board.getBoundingClientRect();
    const cards = Array.from(board.querySelectorAll<HTMLElement>(".case-card"));
    const points = cards.map((el) => {
      const pin = el.querySelector<HTMLElement>("[data-pin]");
      const rect = (pin ?? el).getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - boardRect.left,
        y: rect.top + rect.height / 2 - boardRect.top,
      };
    });

    if (points.length < 2) {
      setPath("");
      return;
    }
    // Hilo tenso: segmentos rectos entre chinchetas, no cable colgando.
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
    }
    setPath(d);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (boardRef.current) ro.observe(boardRef.current);
    if (listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", measure);
    const settle = setTimeout(measure, 200);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(settle);
    };
  }, [measure]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          board.dataset.inView = "true";
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(board);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={boardRef} className="case-board relative -mx-5 px-5 py-6 sm:mx-0 sm:px-0 sm:py-8">
      <svg
        aria-hidden
        className="case-thread pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d={path}
          fill="none"
          stroke="var(--thread)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.16"
        />
        <path
          d={path}
          fill="none"
          stroke="var(--thread)"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <ul
        ref={listRef}
        className="relative grid gap-x-5 gap-y-3 [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))] sm:gap-x-6 sm:gap-y-10"
      >
        {children}
      </ul>
    </div>
  );
}
