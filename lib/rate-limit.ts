import "server-only";

/**
 * Límite de peticiones en memoria (ventana deslizante).
 *
 * Alcance real: el contador vive en la instancia de la función. Con Fluid
 * Compute las instancias se reutilizan, pero puede haber varias en paralelo,
 * así que el límite efectivo es "por instancia", no global. Frena el abuso
 * automatizado —que es de lo que se trata— sin depender de infraestructura
 * externa. Si algún día el chat justifica un límite exacto, la pieza correcta
 * es Redis (Upstash) y este módulo se sustituye sin tocar los llamadores.
 */

type Registro = number[];

const golpes = new Map<string, Registro>();
/** Techo de claves para que un atacante con IPs rotativas no infle la memoria. */
const MAX_CLAVES = 5000;

export type ResultadoLimite = {
  ok: boolean;
  /** Segundos hasta que se libera un hueco (solo si !ok). */
  esperaSegundos: number;
};

export function limitar(
  clave: string,
  { max, ventanaMs }: { max: number; ventanaMs: number }
): ResultadoLimite {
  const ahora = Date.now();
  const desde = ahora - ventanaMs;

  if (golpes.size > MAX_CLAVES) golpes.clear();

  const previos = golpes.get(clave) ?? [];
  const vigentes = previos.filter((t) => t > desde);

  if (vigentes.length >= max) {
    golpes.set(clave, vigentes);
    const libera = vigentes[0] + ventanaMs - ahora;
    return { ok: false, esperaSegundos: Math.max(1, Math.ceil(libera / 1000)) };
  }

  vigentes.push(ahora);
  golpes.set(clave, vigentes);
  return { ok: true, esperaSegundos: 0 };
}

/** IP del cliente detrás del proxy de Vercel/Cloudflare. */
export function ipDePeticion(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    "desconocida"
  );
}
