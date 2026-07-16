"use server";

import { revalidatePath } from "next/cache";
import { agregarMensaje } from "@/lib/chat";

export type EnviarChatState = {
  ok: boolean;
  error?: string;
};

export async function enviarChatMensaje(
  _prev: EnviarChatState,
  formData: FormData
): Promise<EnviarChatState> {
  // Honeypot
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true };
  }

  const nombre = String(formData.get("nombre") ?? "");
  const texto = String(formData.get("texto") ?? "");
  try {
    const result = await agregarMensaje({ nombre, texto });
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("[chat] enviar falló", err);
    return { ok: false, error: "servidor" };
  }
}
