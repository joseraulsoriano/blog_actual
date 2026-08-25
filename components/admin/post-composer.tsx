"use client";

import { useMemo, useState } from "react";
import { CampoFotos, type Foto } from "@/components/admin/campo-fotos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fechaParaInput, slugDesdeFecha } from "@/lib/recuerdos";

const MAX = 480;

export function PostComposer({
  slug,
  fecha,
  enlace,
  texto,
  fotos = [],
  esNuevo,
  accion,
  accionEliminar,
}: {
  slug: string;
  fecha: string;
  enlace?: string;
  texto: string;
  fotos?: Foto[];
  esNuevo: boolean;
  accion: (formData: FormData) => Promise<void>;
  accionEliminar?: (formData: FormData) => Promise<void>;
}) {
  const ahora = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, []);

  const [draft, setDraft] = useState(texto);
  const [fechaVal, setFechaVal] = useState(
    fechaParaInput(fecha) || ahora
  );
  const restantes = MAX - draft.length;
  const slugEfectivo = esNuevo ? slugDesdeFecha(fechaVal) : slug;

  return (
    <form action={accion} className="mx-auto max-w-xl space-y-5">
      <input type="hidden" name="coleccion" value="recuerdos" />
      <input type="hidden" name="slug" value={slugEfectivo} />

      <div className="border border-white/[0.12] bg-white/[0.02] p-4 sm:p-5">
        <Label htmlFor="body" className="sr-only">
          Texto del post
        </Label>
        <textarea
          id="body"
          name="body"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX))}
          required
          rows={5}
          placeholder="¿Qué quieres recordar?"
          className="w-full resize-none bg-transparent text-base leading-relaxed text-foreground outline-none placeholder:text-white/50"
        />
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs text-muted-foreground">
          <span className={restantes < 40 ? "text-primary" : undefined}>
            {restantes}
          </span>
          {!esNuevo ? (
            <span className="font-mono text-white/55">{slug}</span>
          ) : (
            <span className="text-white/55">Se publica al instante</span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fm_fecha" className="text-muted-foreground">
            Fecha y hora
          </Label>
          <Input
            id="fm_fecha"
            name="fm_fecha"
            type="datetime-local"
            value={fechaVal}
            onChange={(e) => setFechaVal(e.target.value)}
            required
            className="font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fm_enlace" className="text-muted-foreground">
            Enlace (opcional)
          </Label>
          <Input
            id="fm_enlace"
            name="fm_enlace"
            defaultValue={enlace ?? ""}
            placeholder="/proyectos/…"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground">Fotos (opcional)</Label>
        <CampoFotos
          name="fm_fotos"
          inicial={fotos}
          coleccion="recuerdos"
          slug={slugEfectivo}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">{esNuevo ? "Publicar" : "Guardar"}</Button>
        {!esNuevo && accionEliminar ? (
          <Button
            type="submit"
            variant="destructive"
            formAction={accionEliminar}
            onClick={(e) => {
              if (!confirm("¿Borrar este post?")) e.preventDefault();
            }}
          >
            Borrar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
