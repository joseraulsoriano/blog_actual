import { NextResponse } from "next/server";
import {
  emitirPuertaLogin,
  estaBloqueado,
} from "@/lib/admin/gate";

/** Emite cookie de puerta (~8 min). Solo el atajo de teclado debe llamarlo. */
export async function POST() {
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
