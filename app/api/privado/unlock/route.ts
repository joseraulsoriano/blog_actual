import { NextResponse } from "next/server";
import {
  emitirPuertaLogin,
  estaBloqueado,
} from "@/lib/admin/gate";
import { ipDePeticion, limitar } from "@/lib/rate-limit";

/** Emite cookie de puerta (~8 min). Solo el atajo de teclado debe llamarlo. */
export async function POST(req: Request) {
  const limite = limitar(`unlock:${ipDePeticion(req)}`, {
    max: 10,
    ventanaMs: 10 * 60 * 1000,
  });
  if (!limite.ok) {
    return NextResponse.json(
      { ok: false, error: "demasiados" },
      { status: 429, headers: { "Retry-After": String(limite.esperaSegundos) } }
    );
  }

  try {
    if (await estaBloqueado()) {
      return NextResponse.json({ ok: false, error: "bloqueado" }, { status: 403 });
    }
    await emitirPuertaLogin();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[privado/unlock]", err);
    return NextResponse.json({ ok: false, error: "servidor" }, { status: 500 });
  }
}
