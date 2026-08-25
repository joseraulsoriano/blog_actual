"use client";

import { useState } from "react";
import type { Campo, EsquemaColeccion } from "@/lib/admin/schemas";
import { CampoFotos, type Foto } from "@/components/admin/campo-fotos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Etapa = { año: number | string; hasta?: number | string; texto: string; href?: string };

/** Hechos fijos de una ciudad: año(–hasta) + texto, con enlace opcional. */
function CampoEtapas({ name, inicial }: { name: string; inicial: Etapa[] }) {
  const [etapas, setEtapas] = useState<Etapa[]>(inicial);

  function actualizar(i: number, parche: Partial<Etapa>) {
    setEtapas(etapas.map((e, j) => (j === i ? { ...e, ...parche } : e)));
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(etapas)} />
      {etapas.map((e, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
          <Input
            value={String(e.año ?? "")}
            onChange={(ev) => actualizar(i, { año: ev.target.value })}
            placeholder="año"
            inputMode="numeric"
            className="w-20 font-mono text-xs"
          />
          <Input
            value={String(e.hasta ?? "")}
            onChange={(ev) => actualizar(i, { hasta: ev.target.value })}
            placeholder="hasta"
            inputMode="numeric"
            className="w-20 font-mono text-xs"
          />
          <Input
            value={e.texto ?? ""}
            onChange={(ev) => actualizar(i, { texto: ev.target.value })}
            placeholder="qué pasó ahí"
            className="w-64 text-xs"
          />
          <Input
            value={e.href ?? ""}
            onChange={(ev) => actualizar(i, { href: ev.target.value })}
            placeholder="enlace (opcional)"
            className="w-44 font-mono text-xs"
          />
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setEtapas(etapas.filter((_, j) => j !== i))}
          >
            rm
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => setEtapas([...etapas, { año: "", texto: "" }])}
      >
        + añadir etapa
      </Button>
    </div>
  );
}

function CampoInput({
  campo,
  valor,
  coleccion,
  slug,
}: {
  campo: Campo;
  valor: unknown;
  coleccion: string;
  slug: string;
}) {
  const name = `fm_${campo.name}`;
  const v = valor == null ? "" : String(valor);

  switch (campo.tipo) {
    case "textarea":
      return (
        <textarea
          id={name}
          name={name}
          defaultValue={v}
          required={campo.requerido}
          rows={3}
          className="w-full border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      );
    case "select":
      return (
        <select
          id={name}
          name={name}
          defaultValue={v}
          required={campo.requerido}
          className="border border-input bg-background px-3 py-2 text-sm"
        >
          {!campo.requerido ? <option value="">—</option> : null}
          {campo.opciones?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "numero":
      return (
        <Input
          id={name}
          name={name}
          type="number"
          step={campo.paso ?? "1"}
          defaultValue={v}
          required={campo.requerido}
          className="w-40 font-mono"
        />
      );
    case "fecha":
      return (
        <Input
          id={name}
          name={name}
          type="date"
          defaultValue={v}
          required={campo.requerido}
          className="w-48 font-mono"
        />
      );
    case "datetime":
      return (
        <Input
          id={name}
          name={name}
          type="datetime-local"
          defaultValue={v.slice(0, 16)}
          required={campo.requerido}
          className="w-56 font-mono"
        />
      );
    case "tags":
      return (
        <Input
          id={name}
          name={name}
          defaultValue={Array.isArray(valor) ? valor.join(", ") : v}
          placeholder="nextjs, vercel, arquitectura"
        />
      );
    case "etapas":
      return (
        <CampoEtapas name={name} inicial={(valor as Etapa[]) ?? []} />
      );
    case "fotos":
      return (
        <CampoFotos
          name={name}
          inicial={(valor as Foto[]) ?? []}
          coleccion={coleccion}
          slug={slug}
        />
      );
    default:
      return (
        <Input
          id={name}
          name={name}
          defaultValue={v}
          required={campo.requerido}
        />
      );
  }
}

export function EditorForm({
  esquema,
  slug,
  valores,
  body,
  esNuevo,
  accion,
  accionEliminar,
}: {
  esquema: EsquemaColeccion;
  slug: string;
  valores: Record<string, unknown>;
  body: string;
  esNuevo: boolean;
  accion: (formData: FormData) => Promise<void>;
  accionEliminar?: (formData: FormData) => Promise<void>;
}) {
  const [slugActual, setSlugActual] = useState(slug);

  return (
    <form action={accion} className="space-y-5">
      <input type="hidden" name="coleccion" value={esquema.coleccion} />
      {esNuevo ? (
        <div className="space-y-1.5">
          <Label htmlFor="slug" className="text-muted-foreground">
            slug (nombre del archivo, minúsculas-y-guiones) *
          </Label>
          <div className="flex items-center gap-1 font-mono text-sm">
            <span className="text-muted-foreground">
              content/{esquema.coleccion}/
            </span>
            <Input
              id="slug"
              name="slug"
              value={slugActual}
              onChange={(e) => setSlugActual(e.target.value)}
              pattern="[a-z0-9][a-z0-9-]*"
              required
              className="w-56 font-mono"
            />
            <span className="text-muted-foreground">.mdx</span>
          </div>
        </div>
      ) : (
        <input type="hidden" name="slug" value={slug} />
      )}

      {esquema.campos.map((campo) => (
        <div key={campo.name} className="space-y-1.5">
          <Label htmlFor={`fm_${campo.name}`} className="text-muted-foreground">
            {campo.label}
            {campo.requerido ? " *" : ""}
          </Label>
          <CampoInput
            campo={campo}
            valor={valores[campo.name]}
            coleccion={esquema.coleccion}
            slug={slugActual}
          />
          {campo.ayuda ? (
            <p className="text-xs text-muted-foreground"># {campo.ayuda}</p>
          ) : null}
        </div>
      ))}

      <div className="space-y-1.5">
        <Label htmlFor="body" className="text-muted-foreground">
          Contenido (Markdown/MDX)
        </Label>
        <textarea
          id="body"
          name="body"
          defaultValue={body}
          rows={14}
          className="w-full border border-input bg-transparent px-3 py-2 font-mono text-sm leading-6 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">
          {esNuevo ? "crear entrada" : "guardar cambios"}
        </Button>
        {!esNuevo && accionEliminar ? (
          <Button
            type="submit"
            variant="destructive"
            formAction={accionEliminar}
            onClick={(e) => {
              if (!confirm(`¿Eliminar ${esquema.coleccion}/${slug}.mdx?`)) {
                e.preventDefault();
              }
            }}
          >
            rm -f
          </Button>
        ) : null}
      </div>
    </form>
  );
}
