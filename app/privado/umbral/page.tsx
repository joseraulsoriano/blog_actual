import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { haySesion, haySesionUmbral } from "@/lib/admin/auth";
import { getEventos, getProyectos, getRecuerdos, getViajes } from "@/lib/content";
import { PageHeader } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Umbral",
  robots: { index: false, follow: false },
};

/**
 * Vista limitada: se ve “como admin” (números del archivo),
 * pero sin crear/editar/borrar. El panel completo solo con contraseña.
 */
export default async function UmbralPage() {
  if (await haySesion()) redirect("/privado");
  if (!(await haySesionUmbral())) redirect("/");

  const stats = [
    { label: "Recuerdos", n: getRecuerdos().length, href: "/recuerdos" },
    { label: "Proyectos", n: getProyectos().length, href: "/proyectos" },
    { label: "Eventos", n: getEventos().length, href: "/eventos" },
    { label: "Viajes", n: getViajes().length, href: "/viajes" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border border-white/[0.12] bg-white/[0.02] px-4 py-3">
        <p className="text-sm tracking-[-0.01em] text-primary neon-text">
          Umbral · acceso limitado
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/">Sitio</Link>}
          />
          <form action="/blog/api/privado/salir" method="post">
            <Button variant="outline" size="sm" type="submit">
              Salir
            </Button>
          </form>
        </div>
      </div>

      <PageHeader
        eyebrow="Observatorio"
        title="Archivo a la vista"
        lede="Puedes mirar los conteos. No puedes editar el legado desde aquí."
        className="mb-8"
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className="block border border-white/[0.12] bg-white/[0.02] px-5 py-6 transition-colors hover:border-white/30 hover:bg-white/[0.04]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-primary neon-text">
                {s.n}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
        El panel de edición queda sellado. Solo quien conoce la contraseña
        completa cruza del todo.
      </p>
    </div>
  );
}
