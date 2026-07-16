import { cerrarSesion } from "@/lib/admin/auth";
import { redirectBlog } from "@/lib/admin/public-url";

export async function POST(req: Request) {
  await cerrarSesion();
  return redirectBlog(req, "/");
}
