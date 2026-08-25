import { enviarPropuesta } from "@/app/proponer/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Formulario embebible (proyectos / proponer). */
export function PropuestaForm({
  ok,
  error,
  limite,
}: {
  ok?: boolean;
  error?: boolean;
  /** Se alcanzó el tope de propuestas por hora. */
  limite?: boolean;
}) {
  if (ok) {
    return (
      <div
        id="proponer"
        className="scroll-mt-24 border border-white/[0.12] bg-white/[0.02] p-6"
      >
        <p className="text-primary neon-text">Propuesta enviada.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Gracias. Si encaja con el legado, aparecerá en el archivo.
        </p>
      </div>
    );
  }

  return (
    <form
      id="proponer"
      action={enviarPropuesta}
      className="relative scroll-mt-24 space-y-5 border border-white/[0.12] bg-white/[0.02] p-5 sm:p-7"
    >
      {error ? (
        <p className="text-sm text-destructive">
          Revisa título (mín. 3) y resumen (mín. 10 caracteres).
        </p>
      ) : null}

      {limite ? (
        <p className="text-sm text-destructive">
          Ya enviaste varias propuestas seguidas. Intenta de nuevo en un rato.
        </p>
      ) : null}

      <div className="absolute -left-[9999px] opacity-0" aria-hidden>
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required maxLength={120} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumen">Resumen</Label>
        <textarea
          id="resumen"
          name="resumen"
          required
          rows={3}
          maxLength={800}
          className="w-full border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <select
            id="categoria"
            name="categoria"
            defaultValue="tech"
            className="w-full border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="tech">Tech</option>
            <option value="hackathon">Hackathon</option>
            <option value="escrito">Escrito</option>
            <option value="libro">Libro</option>
            <option value="video">Video / YouTube</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="ia-arte">IA + arte</option>
            <option value="ux">UX</option>
            <option value="producto">Producto</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="enlace">Enlace (opcional)</Label>
          <Input id="enlace" name="enlace" type="url" placeholder="https://…" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contacto">Contacto (opcional)</Label>
        <Input
          id="contacto"
          name="contacto"
          placeholder="email o @red"
          maxLength={120}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="detalle">Detalle (opcional)</Label>
        <textarea
          id="detalle"
          name="detalle"
          rows={4}
          maxLength={4000}
          className="w-full border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Contexto, stack, por qué debería vivir en el archivo…"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit">Enviar propuesta</Button>
      </div>
    </form>
  );
}
