import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { agregarMensaje } from "@/lib/chat";
import { ipDePeticion, limitar } from "@/lib/rate-limit";

/** API pública del chat — atraviesa el proxy /blog (Server Actions no lo hacen). */
export async function POST(request: Request) {
  // Cada mensaje es un commit + un redeploy: sin techo, un bucle quema builds.
  const limite = limitar(`chat:${ipDePeticion(request)}`, {
    max: 5,
    ventanaMs: 10 * 60 * 1000,
  });
  if (!limite.ok) {
    return NextResponse.json(
      { ok: false, error: "demasiados" },
      { status: 429, headers: { "Retry-After": String(limite.esperaSegundos) } }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "formulario" }, { status: 400 });
  }

  // Honeypot
  if (String(formData.get("website") ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const nombre = String(formData.get("nombre") ?? "");
  const texto = String(formData.get("texto") ?? "");

  try {
    const result = await agregarMensaje({ nombre, texto });
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      );
    }
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[chat] POST falló", err);
    return NextResponse.json({ ok: false, error: "servidor" }, { status: 500 });
  }
}
