"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EARTH_MASK, EARTH_MASK_H, EARTH_MASK_W } from "@/lib/earth-mask";
import { cn } from "@/lib/utils";

export type CiudadGlobo = {
  slug: string;
  ciudad: string;
  lat: number;
  lon: number;
};

const GW = 80;
const GH = 40;
const RX = GW / 2;
const RY = GH / 2;
const SPIN_SPEED = 0.12;
const LAND = ["@", "#", "%", "*", "+"];

const deg = (d: number) => (d * Math.PI) / 180;

function sampleMask(lat: number, lon: number): boolean {
  lon = ((lon + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  const u = Math.min(
    EARTH_MASK_W - 1,
    Math.floor(((lon + Math.PI) / (2 * Math.PI)) * EARTH_MASK_W)
  );
  const v = Math.min(
    EARTH_MASK_H - 1,
    Math.floor(((Math.PI / 2 - lat) / Math.PI) * EARTH_MASK_H)
  );
  return EARTH_MASK[v][u] === "#";
}

function renderFrame(rot: number): string {
  const lines: string[] = [];
  for (let j = 0; j < GH; j++) {
    let line = "";
    for (let i = 0; i < GW; i++) {
      const nx = (i + 0.5 - RX) / RX;
      const ny = (j + 0.5 - RY) / RY;
      const r2 = nx * nx + ny * ny;

      if (r2 > 1 && r2 < 1.045) {
        line += "·";
        continue;
      }
      if (r2 > 1) {
        line += " ";
        continue;
      }

      const Y = -ny;
      const Z = Math.sqrt(Math.max(0, 1 - r2));
      const light = Math.max(0.08, Math.min(1, Z * 0.85 + nx * 0.22));
      const lat = Math.asin(Y);
      const lon = Math.atan2(nx, Z) + rot;

      if (sampleMask(lat, lon)) {
        const idx = Math.min(
          LAND.length - 1,
          Math.floor((1 - light) * (LAND.length - 0.01))
        );
        line += LAND[idx];
      } else if (light > 0.72) line += "·";
      else if (light > 0.42) line += ".";
      else line += " ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

function cityScreenPos(c: CiudadGlobo, rot: number) {
  const lat = deg(c.lat);
  const relLon = deg(c.lon) - rot;
  const X = Math.cos(lat) * Math.sin(relLon);
  const Y = Math.sin(lat);
  const Z = Math.cos(lat) * Math.cos(relLon);
  if (Z < 0.12) return null;
  return {
    col: X * RX + RX,
    row: -Y * RY + RY,
    depth: Z,
    nx: X,
    ny: Y,
  };
}

function nombreCorto(ciudad: string): string {
  if (ciudad === "Ciudad de México") return "CDMX";
  return ciudad;
}

/**
 * Planeta ASCII con etiquetas cuando la ciudad mira al frente.
 */
export function AsciiGlobe({
  cities,
  selected = null,
  onSelect,
  className,
  size = "md",
  showLabels = false,
}: {
  cities: CiudadGlobo[];
  selected?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
  size?: "md" | "lg";
  /** Etiquetas de ciudad al frente (home). */
  showLabels?: boolean;
}) {
  const [rot, setRot] = useState(deg(-99));
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const rotRef = useRef(rot);
  const pausedRef = useRef(false);
  rotRef.current = rot;
  pausedRef.current = paused;

  const target = useMemo(() => {
    const c = cities.find((c) => c.slug === selected);
    return c ? deg(c.lon) : null;
  }, [cities, selected]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cur = rotRef.current;

      if (target !== null) {
        let d = target - cur;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        if (Math.abs(d) > 0.008) {
          setRot(cur + d * Math.min(1, 4.2 * dt));
        }
      } else if (!pausedRef.current) {
        setRot(cur + SPIN_SPEED * dt);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const shownRot = reduced && target !== null ? target : rot;
  const frame = useMemo(() => renderFrame(shownRot), [shownRot]);

  const visibles = cities
    .map((c) => {
      const pos = cityScreenPos(c, shownRot);
      return pos ? { c, pos } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .sort((a, b) => a.pos.depth - b.pos.depth);

  return (
    <div
      className={cn(
        "relative inline-block font-mono",
        size === "lg"
          ? "text-[6.5px] leading-none sm:text-[8.5px] md:text-[10.5px] lg:text-[12px]"
          : "text-[7px] leading-none sm:text-[9px] md:text-[11px]",
        className
      )}
      style={{ lineHeight: 1 }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        setHovered(null);
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-2xl"
      />
      <pre
        aria-hidden
        className="select-none text-primary/75"
        style={{ textShadow: "0 0 14px oklch(1 0 0 / 0.22)" }}
      >
        {frame}
      </pre>

      {visibles.map(({ c, pos }, i) => {
        const active = c.slug === selected || c.slug === hovered;
        const labelOn =
          showLabels && (pos.depth > 0.42 || active || c.slug === hovered);
        const right = pos.nx >= 0;
        const stagger = ((i % 3) - 1) * 0.55;

        const style = {
          left: `${pos.col}ch`,
          top: `calc(${pos.row}em + ${stagger}em)`,
        } as const;

        const inner = (
          <span className="relative flex items-center">
            <span
              className={cn(
                "block h-2 w-2 rounded-full border border-black/80 transition-transform sm:h-2.5 sm:w-2.5",
                active
                  ? "scale-125 bg-white shadow-[0_0_12px_oklch(1_0_0_/_0.9)]"
                  : "bg-white/85 shadow-[0_0_8px_oklch(1_0_0_/_0.55)] hover:scale-110"
              )}
              style={{ opacity: 0.55 + pos.depth * 0.45 }}
            />
            {labelOn ? (
              <span
                className={cn(
                  "pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 whitespace-nowrap font-sans text-[10px] font-medium tracking-wide text-primary sm:text-[11px]",
                  right ? "left-full ml-2" : "right-full mr-2 text-right",
                  active ? "opacity-100" : "opacity-90"
                )}
                style={{
                  textShadow:
                    "0 0 8px oklch(0 0 0 / 0.95), 0 0 12px oklch(1 0 0 / 0.35)",
                }}
              >
                {nombreCorto(c.ciudad)}
              </span>
            ) : null}
          </span>
        );

        if (onSelect) {
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => onSelect(c.slug)}
              onPointerEnter={() => setHovered(c.slug)}
              onPointerLeave={() => setHovered(null)}
              title={c.ciudad}
              aria-label={`Ver viajes en ${c.ciudad}`}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={style}
            >
              {inner}
            </button>
          );
        }

        return (
          <span
            key={c.slug}
            title={c.ciudad}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={style}
          >
            {inner}
          </span>
        );
      })}

      <span className="sr-only">
        Globo terráqueo ASCII con ciudades visitadas:{" "}
        {cities.map((c) => c.ciudad).join(", ")}.
      </span>
    </div>
  );
}
