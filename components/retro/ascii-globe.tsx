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

const GW = 72; // ancho en caracteres
const GH = 36; // alto en caracteres (aspecto 2:1 ≈ esfera)
const RX = GW / 2;
const RY = GH / 2;
const SPIN = 0.02; // rad por frame en rotación libre
const FRAME_MS = 90;

const deg = (d: number) => (d * Math.PI) / 180;

function sampleMask(lat: number, lon: number): boolean {
  // normaliza lon a [-π, π)
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
      if (r2 > 1) {
        line += " ";
        continue;
      }
      const Y = -ny;
      const Z = Math.sqrt(Math.max(0, 1 - r2));
      const lat = Math.asin(Y);
      const lon = Math.atan2(nx, Z) + rot;
      if (sampleMask(lat, lon)) {
        // sombreado por proximidad al centro del disco (limbo oscuro)
        line += Z > 0.75 ? "@" : Z > 0.5 ? "#" : Z > 0.3 ? "%" : "*";
      } else {
        line += Z > 0.6 ? "·" : Z > 0.3 ? "." : " ";
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

/** Posición en pantalla de una ciudad para la rotación dada; null si no es visible. */
function cityScreenPos(c: CiudadGlobo, rot: number) {
  const lat = deg(c.lat);
  const relLon = deg(c.lon) - rot;
  const X = Math.cos(lat) * Math.sin(relLon);
  const Y = Math.sin(lat);
  const Z = Math.cos(lat) * Math.cos(relLon);
  if (Z < 0.12) return null;
  return { col: X * RX + RX, row: -Y * RY + RY };
}

/**
 * Planeta Tierra en ASCII, girando. Los marcadores de ciudad son botones:
 * al seleccionar una ciudad el globo rota hasta centrarla.
 */
export function AsciiGlobe({
  cities,
  selected,
  onSelect,
  className,
}: {
  cities: CiudadGlobo[];
  selected: string | null;
  onSelect: (slug: string) => void;
  className?: string;
}) {
  const [rot, setRot] = useState(deg(-99) ); // arranca mirando a México
  const [reduced, setReduced] = useState(false);
  const rotRef = useRef(rot);
  rotRef.current = rot;

  const target = useMemo(() => {
    const c = cities.find((c) => c.slug === selected);
    return c ? deg(c.lon) : null;
  }, [cities, selected]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const id = setInterval(() => {
      const cur = rotRef.current;
      if (target !== null) {
        // rota por el camino corto hasta centrar la ciudad
        let d = target - cur;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        if (Math.abs(d) > 0.01) setRot(cur + d * 0.15);
      } else {
        setRot(cur + SPIN);
      }
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [target]);

  const shownRot = reduced && target !== null ? target : rot;
  const frame = useMemo(() => renderFrame(shownRot), [shownRot]);

  return (
    <div
      className={cn(
        "relative inline-block text-[7px] leading-none sm:text-[9px] md:text-[11px]",
        className
      )}
      style={{ lineHeight: 1 }}
    >
      <pre aria-hidden className="select-none text-primary/80">
        {frame}
      </pre>
      {cities.map((c) => {
        const pos = cityScreenPos(c, shownRot);
        if (!pos) return null;
        const active = c.slug === selected;
        return (
          <button
            key={c.slug}
            onClick={() => onSelect(c.slug)}
            title={c.ciudad}
            aria-label={`Seleccionar ${c.ciudad}`}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 font-bold",
              active
                ? "terminal-glow animate-pulse text-accent"
                : "text-accent/80 hover:text-accent"
            )}
            style={{ left: `${pos.col}ch`, top: `${pos.row}em` }}
          >
            {active ? "◉" : "○"}
          </button>
        );
      })}
      <span className="sr-only">
        Globo terráqueo ASCII con ciudades visitadas:{" "}
        {cities.map((c) => c.ciudad).join(", ")}
      </span>
    </div>
  );
}
