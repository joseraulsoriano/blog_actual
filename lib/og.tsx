import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

/**
 * Tarjeta social del blog: negro, blanco neón y tipografía grande.
 * Sin fuentes remotas — el CSP del portafolio no las dejaría pasar y
 * además evita una descarga por render.
 */
export function tarjetaOG({
  eyebrow,
  titulo,
  pie,
}: {
  eyebrow: string;
  titulo: string;
  pie?: string;
}) {
  const largo = titulo.length;
  const tamaño = largo > 90 ? 54 : largo > 55 ? 66 : 82;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          padding: "72px 80px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#8f8f8f",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              width: 64,
              height: 2,
              background: "#fff",
              marginTop: 28,
              opacity: 0.8,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: tamaño,
            lineHeight: 1.08,
            letterSpacing: -2,
            fontWeight: 600,
            maxWidth: 1000,
          }}
        >
          {titulo}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#8f8f8f",
          }}
        >
          <div style={{ display: "flex" }}>José Raúl Soriano</div>
          <div style={{ display: "flex" }}>{pie ?? "joserauldev.qzz.io"}</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
