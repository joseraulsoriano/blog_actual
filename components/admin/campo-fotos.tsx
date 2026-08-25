"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Foto = { src: string; alt: string };

export function CampoFotos({
  name,
  inicial,
  coleccion,
  slug,
}: {
  name: string;
  inicial: Foto[];
  coleccion: string;
  slug: string;
}) {
  const [fotos, setFotos] = useState<Foto[]>(inicial);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subir(file: File) {
    setSubiendo(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("coleccion", coleccion);
      fd.set("slug", slug || "general");
      // basePath /blog no aplica a fetch(): la ruta lo lleva explícito.
      const res = await fetch("/blog/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const { src } = (await res.json()) as { src: string };
      setFotos((f) => [...f, { src, alt: file.name.replace(/\.[^.]+$/, "") }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(fotos)} />
      {fotos.map((f, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-accent">▣</span>
          <Input
            value={f.src}
            onChange={(e) =>
              setFotos(fotos.map((x, j) => (j === i ? { ...x, src: e.target.value } : x)))
            }
            placeholder="/uploads/…"
            className="w-64 font-mono text-xs"
          />
          <Input
            value={f.alt}
            onChange={(e) =>
              setFotos(fotos.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))
            }
            placeholder="descripción (alt)"
            className="w-48 text-xs"
          />
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setFotos(fotos.filter((_, j) => j !== i))}
          >
            rm
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <label className="cursor-pointer text-sm text-accent underline underline-offset-4">
          {subiendo ? "subiendo…" : "+ subir foto"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={subiendo}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void subir(f);
              e.target.value = "";
            }}
          />
        </label>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setFotos([...fotos, { src: "", alt: "" }])}
        >
          + añadir ruta manual
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
