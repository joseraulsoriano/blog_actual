import { crearSesion, passwordCorrecta } from "@/lib/admin/auth";
import {
  cerrarModoAcertijo,
  cerrarPuertaLogin,
  emitirModoAcertijo,
  estaBloqueado,
  hayPuertaLogin,
  ipDeConfianza,
  obtenerIpCliente,
} from "@/lib/admin/gate";
import { redirectBlog } from "@/lib/admin/public-url";

export async function POST(req: Request) {
  try {
    if (await estaBloqueado()) return redirectBlog(req, "/");
    if (!(await hayPuertaLogin())) return redirectBlog(req, "/");

    const form = await req.formData();
    const pass = String(form.get("password") ?? "");

    if (passwordCorrecta(pass)) {
      await crearSesion("admin");
      await cerrarPuertaLogin();
      await cerrarModoAcertijo();
      return redirectBlog(req, "/privado");
    }

    const ip = await obtenerIpCliente();
    if (ipDeConfianza(ip)) {
      return redirectBlog(req, "/privado/login?error=1");
    }

    await emitirModoAcertijo();
    return redirectBlog(req, "/privado/login?acertijo=1");
  } catch (err) {
    console.error("[privado/login]", err);
    return redirectBlog(req, "/privado/login?error=1");
  }
}
