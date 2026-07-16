"use server";

import { redirect } from "next/navigation";
import { crearSesion, passwordCorrecta } from "@/lib/admin/auth";
import {
  cerrarModoAcertijo,
  cerrarPuertaLogin,
  consumirIntentoPalabra,
  emitirModoAcertijo,
  emitirPuertaLogin,
  estaBloqueado,
  hayPuertaLogin,
  ipDeConfianza,
  obtenerIpCliente,
  palabraCorrecta,
} from "@/lib/admin/gate";

/** Solo el comando del teclado debe llamar esto. */
export async function desbloquearLogin() {
  if (await estaBloqueado()) return;
  await emitirPuertaLogin();
}

export async function intentarLogin(formData: FormData) {
  if (await estaBloqueado()) redirect("/");
  if (!(await hayPuertaLogin())) redirect("/");

  const pass = String(formData.get("password") ?? "");
  if (passwordCorrecta(pass)) {
    await crearSesion("admin");
    await cerrarPuertaLogin();
    await cerrarModoAcertijo();
    redirect("/privado");
  }

  const ip = await obtenerIpCliente();
  if (ipDeConfianza(ip)) {
    redirect("/privado/login?error=1");
  }

  await emitirModoAcertijo();
  redirect("/privado/login?acertijo=1");
}

export async function intentarPalabra(formData: FormData) {
  if (await estaBloqueado()) redirect("/");
  if (!(await hayPuertaLogin())) redirect("/");

  const palabra = String(formData.get("palabra") ?? "");
  if (palabraCorrecta(palabra)) {
    await crearSesion("umbral");
    await cerrarPuertaLogin();
    await cerrarModoAcertijo();
    redirect("/privado/umbral");
  }

  const quedan = await consumirIntentoPalabra();
  if (quedan <= 0) {
    redirect("/?sellado=1");
  }
  redirect(`/privado/login?acertijo=1&fallo=1&quedan=${quedan}`);
}
