import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { rolSesion } from "@/lib/admin/auth";
import { salir } from "./actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: { default: "Privado", template: "%s — Privado" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rol = await rolSesion();
  if (rol === "umbral") redirect("/privado/umbral");
  if (rol !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border border-white/[0.12] bg-white/[0.02] px-4 py-3">
        <p className="text-sm tracking-[-0.01em] text-primary neon-text">
          Área privada
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/privado">Panel</Link>}
          />
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/">Ver sitio</Link>}
          />
          <form action={salir}>
            <Button variant="outline" size="sm" type="submit">
              Salir
            </Button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
