import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { rolSesion } from "@/lib/admin/auth";
import {
  estaBloqueado,
  hayModoAcertijo,
  hayPuertaLogin,
  intentosRestantes,
  MAX_INTENTOS,
  preguntaAcertijo,
} from "@/lib/admin/gate";
import { intentarPalabra, intentarLogin } from "./actions";
import { PageHeader, PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Acceso privado",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    acertijo?: string;
    fallo?: string;
    quedan?: string;
  }>;
}) {
  if (await estaBloqueado()) redirect("/");

  const rol = await rolSesion();
  if (rol === "admin") redirect("/privado");
  if (rol === "umbral") redirect("/privado/umbral");

  if (!(await hayPuertaLogin())) {
    notFound();
  }

  const { error, acertijo, fallo, quedan } = await searchParams;
  const modoAcertijo = acertijo === "1" || (await hayModoAcertijo());
  const left =
    quedan != null
      ? Number(quedan)
      : ((await intentosRestantes()) ?? MAX_INTENTOS);

  if (modoAcertijo) {
    return (
      <PageShell className="max-w-md">
        <PageHeader
          eyebrow="Umbral"
          title="Una palabra"
          lede="Tres intentos. Si fallas, este camino se cierra."
        />
        <div className="border border-white/[0.12] bg-white/[0.02] p-6 sm:p-8">
          <p className="mb-6 text-pretty text-base leading-relaxed text-foreground/85">
            {preguntaAcertijo()}
          </p>
          {fallo ? (
            <p className="mb-4 text-sm text-destructive">
              No. Te {left === 1 ? "queda 1 intento" : `quedan ${left} intentos`}.
            </p>
          ) : (
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Intentos: {left}/{MAX_INTENTOS}
            </p>
          )}
          <form action={intentarPalabra} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="palabra">Palabra</Label>
              <Input
                id="palabra"
                name="palabra"
                type="text"
                autoFocus
                required
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Decir
            </Button>
          </form>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="max-w-md">
      <PageHeader
        eyebrow="Área privada"
        title="Entrar"
        lede="Introduce la contraseña."
      />

      <div className="border border-white/[0.12] bg-white/[0.02] p-6 sm:p-8">
        {error ? (
          <p className="mb-4 text-sm text-destructive">
            Contraseña incorrecta.
          </p>
        ) : null}
        <form action={intentarLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Entrar
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
