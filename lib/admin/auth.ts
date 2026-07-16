import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "node:crypto";

const COOKIE = "legado_session";
const DIAS = 30;

export type RolSesion = "admin" | "umbral";

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

export function passwordCorrecta(intento: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const a = Buffer.from(intento);
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function crearSesion(rol: RolSesion = "admin") {
  const token = await new SignJWT({ rol })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DIAS}d`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DIAS * 24 * 60 * 60,
  });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE);
}

export async function rolSesion(): Promise<RolSesion | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.rol === "admin" || payload.rol === "umbral") {
      return payload.rol;
    }
    return null;
  } catch {
    return null;
  }
}

/** Sesión de panel completo (contraseña). */
export async function haySesion(): Promise<boolean> {
  return (await rolSesion()) === "admin";
}

/** Sesión limitada (acertijo / palabra). */
export async function haySesionUmbral(): Promise<boolean> {
  const r = await rolSesion();
  return r === "umbral" || r === "admin";
}

export async function exigirAdmin() {
  if (!(await haySesion())) {
    throw new Error("No autorizado");
  }
}
