import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const GATE_COOKIE = "legado_gate";

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    return new TextEncoder().encode("legado-dev-secret-cambiame");
  }
  return new TextEncoder().encode(s);
}

async function puertaValida(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.puerta === true;
  } catch {
    return false;
  }
}

/**
 * /privado/login sin cookie de puerta → 404 (no se puede teclear la URL).
 * El resto de /privado lo cubre el layout con sesión.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/privado/login" || pathname.startsWith("/privado/login/")) {
    const ok = await puertaValida(request.cookies.get(GATE_COOKIE)?.value);
    if (!ok) {
      // Sin puerta: la URL se comporta como si no existiera el login.
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/privado/login", "/privado/login/:path*"],
};
