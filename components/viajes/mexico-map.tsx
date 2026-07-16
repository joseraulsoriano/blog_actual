"use client";

import { cn } from "@/lib/utils";

export type CiudadMapa = {
  slug: string;
  ciudad: string;
  lat: number;
  lon: number;
};

/**
 * ViewBox alineado a lon/lat de México.
 * Mismos bounds para silueta y ciudades → los puntos caen donde corresponde.
 */
const LON0 = -118.5;
const LON1 = -86.5;
const LAT0 = 14.5;
const LAT1 = 32.8;
const VB_W = 1000;
const VB_H = 680;

function project(lat: number, lon: number) {
  return {
    x: ((lon - LON0) / (LON1 - LON0)) * VB_W,
    y: ((LAT1 - lat) / (LAT1 - LAT0)) * VB_H,
  };
}

/** Contorno único (continente + Baja + Yucatán), [lat, lon]. */
const OUTLINE: [number, number][] = [
  // Costa Pacífico Baja (Cabo → norte)
  [22.88, -109.91],
  [23.4, -109.4],
  [24.15, -110.25],
  [25.0, -110.9],
  [26.0, -111.4],
  [26.9, -112.0],
  [27.9, -112.9],
  [28.8, -113.6],
  [29.7, -114.4],
  [30.5, -115.0],
  [31.3, -115.5],
  [31.9, -116.4],
  [32.54, -117.12],
  // Frontera norte
  [32.72, -114.72],
  [32.5, -114.8],
  [31.33, -111.1],
  [31.33, -108.2],
  [31.78, -108.2],
  [31.78, -106.53],
  [30.0, -104.7],
  [29.3, -104.0],
  [29.1, -103.0],
  [28.4, -100.4],
  [27.5, -99.55],
  [26.4, -99.1],
  [25.87, -97.45],
  // Golfo → Yucatán
  [24.5, -97.6],
  [22.2, -97.85],
  [21.0, -97.4],
  [19.8, -96.5],
  [18.3, -94.6],
  [18.15, -92.5],
  [18.5, -90.5],
  [19.5, -88.0],
  [20.5, -87.2],
  [21.55, -86.8],
  [21.3, -87.5],
  [19.8, -87.6],
  [18.5, -88.0],
  [18.2, -88.5],
  [17.9, -89.2],
  // Sur / Chiapas–Oaxaca
  [16.5, -90.5],
  [15.3, -92.0],
  [14.55, -92.25],
  [15.5, -95.0],
  [16.0, -97.5],
  [16.5, -98.5],
  [17.0, -100.0],
  [17.6, -101.6],
  [18.2, -103.0],
  [19.0, -104.5],
  [19.7, -105.3],
  [20.7, -105.3],
  [21.5, -105.25],
  [22.2, -105.7],
  [22.88, -109.91],
];

function outlinePath() {
  return (
    OUTLINE.map(([lat, lon], i) => {
      const { x, y } = project(lat, lon);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ") + "Z"
  );
}

const LABEL: Record<
  string,
  { dx: number; dy: number; anchor: "start" | "end" | "middle" }
> = {
  cdmx: { dx: -4, dy: -28, anchor: "middle" },
  puebla: { dx: 42, dy: 8, anchor: "start" },
  cuernavaca: { dx: -44, dy: 22, anchor: "end" },
  guadalajara: { dx: -16, dy: -26, anchor: "middle" },
  monterrey: { dx: 8, dy: -26, anchor: "middle" },
};

type MexicoMapProps = {
  cities: CiudadMapa[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  className?: string;
};

export function MexicoMap({
  cities,
  selected,
  onSelect,
  className,
}: MexicoMapProps) {
  const d = outlinePath();

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-white/[0.12] bg-black",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 45% 40%, oklch(1 0 0 / 8%) 0%, transparent 70%)",
        }}
      />

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="relative z-[1] mx-auto block h-full max-h-[inherit] w-full"
        role="img"
        aria-label="Mapa de México con ciudades visitadas"
      >
        <defs>
          <filter id="mx-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke="oklch(1 0 0 / 0.04)" strokeWidth="1">
          {[0.25, 0.5, 0.75].map((t) => (
            <g key={t}>
              <line x1={VB_W * t} y1={0} x2={VB_W * t} y2={VB_H} />
              <line x1={0} y1={VB_H * t} x2={VB_W} y2={VB_H * t} />
            </g>
          ))}
        </g>

        <path
          d={d}
          fill="oklch(1 0 0 / 0.08)"
          stroke="#fff"
          strokeOpacity={0.7}
          strokeWidth={2.4}
          strokeLinejoin="round"
          filter="url(#mx-glow)"
        />

        <text
          x={32}
          y={VB_H - 28}
          fill="oklch(1 0 0 / 0.38)"
          fontSize={18}
          letterSpacing="0.36em"
          style={{ fontFamily: "inherit" }}
        >
          MÉXICO
        </text>

        {cities.map((c) => {
          const { x, y } = project(c.lat, c.lon);
          const active = selected === c.slug;
          const off = LABEL[c.slug] ?? {
            dx: 0,
            dy: -26,
            anchor: "middle" as const,
          };
          const lx = x + off.dx;
          const ly = y + off.dy;

          return (
            <g
              key={c.slug}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={c.ciudad}
              className="cursor-pointer"
              onClick={() => onSelect(active ? null : c.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(active ? null : c.slug);
                }
              }}
            >
              {(Math.abs(off.dx) > 10 || Math.abs(off.dy + 26) > 4) && (
                <line
                  x1={x}
                  y1={y}
                  x2={lx}
                  y2={ly + (off.dy < 0 ? 12 : -12)}
                  stroke={active ? "oklch(1 0 0 / 0.55)" : "oklch(1 0 0 / 0.22)"}
                  strokeWidth={1.25}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={active ? 15 : 11}
                fill="oklch(1 0 0 / 0.12)"
                stroke="oklch(1 0 0 / 0.35)"
              />
              <circle
                cx={x}
                cy={y}
                r={active ? 6 : 4.5}
                fill="#fff"
                filter={active ? "url(#mx-glow)" : undefined}
              />
              <text
                x={lx}
                y={ly}
                textAnchor={off.anchor}
                fill={active ? "#fff" : "oklch(1 0 0 / 0.8)"}
                fontSize={active ? 22 : 18}
                fontWeight={active ? 600 : 500}
                style={{ fontFamily: "inherit" }}
              >
                {c.ciudad}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
