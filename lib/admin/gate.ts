import "server-only";
import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const GATE_COOKIE = "legado_gate";
const RIDDLE_COOKIE = "legado_riddle";
const TRIES_COOKIE = "legado_tries";
const BAN_COOKIE = "legado_ban";
const GATE_MIN = 8;
const MAX_INTENTOS = 3;

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET no está definido");
    }
    return new TextEncoder().encode("legado-dev-secret-cambiame");
  }
  return new TextEncoder().encode(s);
}

export async function emitirPuertaLogin() {
  const token = await new SignJWT({ puerta: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${GATE_MIN}m`)
    .sign(secret());
  (await cookies()).set(GATE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GATE_MIN * 60,
  });
}

export async function hayPuertaLogin(): Promise<boolean> {
  const token = (await cookies()).get(GATE_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.puerta === true;
  } catch {
    return false;
  }
}

export async function cerrarPuertaLogin() {
  (await cookies()).delete(GATE_COOKIE);
}

/** Activa el acertijo e inicializa 3 intentos (solo la primera vez). */
export async function emitirModoAcertijo() {
  const token = await new SignJWT({ riddle: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secret());
  (await cookies()).set(RIDDLE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 60,
  });

  const actuales = await intentosRestantes();
  if (actuales == null) {
    await setIntentosRestantes(MAX_INTENTOS);
  }
}

export async function hayModoAcertijo(): Promise<boolean> {
  const token = (await cookies()).get(RIDDLE_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.riddle === true;
  } catch {
    return false;
  }
}

export async function cerrarModoAcertijo() {
  (await cookies()).delete(RIDDLE_COOKIE);
  (await cookies()).delete(TRIES_COOKIE);
}

export async function intentosRestantes(): Promise<number | null> {
  const token = (await cookies()).get(TRIES_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const n = Number(payload.left);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

async function setIntentosRestantes(left: number) {
  const token = await new SignJWT({ left })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secret());
  (await cookies()).set(TRIES_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 60,
  });
}

/** Resta un intento. Devuelve cuántos quedan (0 = bloqueado). */
export async function consumirIntentoPalabra(): Promise<number> {
  const actual = (await intentosRestantes()) ?? MAX_INTENTOS;
  const left = Math.max(0, actual - 1);
  await setIntentosRestantes(left);
  if (left <= 0) {
    await emitirBloqueoPermanente();
  }
  return left;
}

export async function emitirBloqueoPermanente() {
  const token = await new SignJWT({ ban: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secret());
  (await cookies()).set(BAN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });
  await cerrarPuertaLogin();
  await cerrarModoAcertijo();
}

export async function estaBloqueado(): Promise<boolean> {
  const token = (await cookies()).get(BAN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.ban === true;
  } catch {
    return false;
  }
}

export async function obtenerIpCliente(): Promise<string> {
  const h = await headers();
  const xf = h.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function ipDeConfianza(ip: string): boolean {
  const limpias = ip.replace(/^::ffff:/, "");
  if (
    process.env.NODE_ENV !== "production" &&
    (limpias === "127.0.0.1" || limpias === "::1" || limpias === "unknown")
  ) {
    return true;
  }
  const lista = (process.env.ADMIN_ALLOWED_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (lista.length === 0) {
    return process.env.NODE_ENV !== "production";
  }
  return lista.includes(ip) || lista.includes(limpias);
}

export function preguntaAcertijo(): string {
  return (
    process.env.ADMIN_RIDDLE_QUESTION?.trim() ||
    "Una sola palabra abre el umbral. ¿Cuál es?"
  );
}

/** Compara la palabra secreta (ADMIN_RIDDLE_ANSWER). */
export function palabraCorrecta(intento: string): boolean {
  const real = process.env.ADMIN_RIDDLE_ANSWER?.trim().toLowerCase();
  if (!real) return false;
  const a = intento.trim().toLowerCase().replace(/\s+/g, " ");
  const b = real.replace(/\s+/g, " ");
  if (a.length !== b.length) return false;
  let ok = true;
  for (let i = 0; i < a.length; i++) {
    if (a.charCodeAt(i) !== b.charCodeAt(i)) ok = false;
  }
  return ok;
}

export { MAX_INTENTOS };
