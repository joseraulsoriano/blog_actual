import { crearSesion } from "@/lib/admin/auth";
import {
  cerrarModoAcertijo,
  cerrarPuertaLogin,
  consumirIntentoPalabra,
  estaBloqueado,
  hayPuertaLogin,
  palabraCorrecta,
} from "@/lib/admin/gate";
import { redirectBlog } from "@/lib/admin/public-url";

export async function POST(req: Request) {
  try {
    if (await estaBloqueado()) return redirectBlog(req, "/");
    if (!(await hayPuertaLogin())) return redirectBlog(req, "/");

    const form = await req.formData();
    const palabra = String(form.get("palabra") ?? "");

    if (palabraCorrecta(palabra)) {
      await crearSesion("umbral");
      await cerrarPuertaLogin();
      await cerrarModoAcertijo();
      return redirectBlog(req, "/privado/umbral");
    }

    const quedan = await consumirIntentoPalabra();
    if (quedan <= 0) {
      return redirectBlog(req, "/?sellado=1");
    }
    return redirectBlog(
      req,
      `/privado/login?acertijo=1&fallo=1&quedan=${quedan}`
    );
  } catch (err) {
    console.error("[privado/palabra]", err);
    return redirectBlog(req, "/privado/login?acertijo=1&fallo=1");
  }
}
