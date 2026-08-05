"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import type { ChatMensaje } from "@/lib/chat-types";
import { cn } from "@/lib/utils";

function haceCuanto(fecha: string): string {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "·";
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "ahora";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const dias = Math.floor(h / 24);
  if (dias < 7) return `${dias}d`;
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(d);
}

function inicial(nombre: string): string {
  const c = nombre.trim().charAt(0).toLowerCase();
  return c || "?";
}

/**
 * Lo último = PC con chat general vivo.
 * Envía por fetch a /api/chat (no Server Action): en multi-zone bajo
 * joserauldev.qzz.io/blog los Server Actions los come el portafolio.
 */
export function HomeUltimo({ mensajes: iniciales }: { mensajes: ChatMensaje[] }) {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [inView, setInView] = useState(false);
  const [mensajes, setMensajes] = useState(iniciales);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [mensajes]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setError(false);

    startTransition(async () => {
      try {
        // Absolute bajo basePath /blog (fetch no lo antepone solo).
        const res = await fetch("/blog/api/chat", {
          method: "POST",
          body: data,
        });
        const json = (await res.json()) as { ok?: boolean };
        if (!res.ok || !json.ok) {
          setError(true);
          return;
        }
        const nombre = String(data.get("nombre") ?? "anon").trim() || "anon";
        const texto = String(data.get("texto") ?? "").trim();
        const textoEl = form.elements.namedItem("texto");
        if (textoEl instanceof HTMLInputElement) textoEl.value = "";
        setMensajes((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            nombre,
            texto,
            fecha: new Date().toISOString(),
          },
        ]);
      } catch {
        setError(true);
      }
    });
  }

  const hilo = mensajes.slice(-12);

  return (
    <section
      ref={ref}
      className="relative px-5 pb-32 pt-20 sm:px-8 sm:pb-40 sm:pt-28"
      aria-labelledby="ultimo-heading"
    >
      <div className="mx-auto max-w-lg">
        <p className="mb-5 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(1_0_0_/_0.85)]"
            aria-hidden
          />
          chat general · en línea
        </p>
        <h2 id="ultimo-heading" className="sr-only">
          Chat general
        </h2>

        <div
          className={cn(
            "relative mx-auto max-w-[22rem] font-mono sm:max-w-[26rem]",
            "transition-opacity duration-500",
            inView ? "opacity-100" : "opacity-50"
          )}
        >
          <div className="rounded-[1.25rem] border border-white/30 bg-white/[0.07] p-2.5 shadow-[0_0_60px_oklch(1_0_0_/_0.06)] sm:rounded-[1.5rem] sm:p-3">
            <div
              className="mb-2 flex items-center justify-center gap-2"
              aria-hidden
            >
              <span className="h-1 w-1 rounded-full bg-primary/70 shadow-[0_0_6px_oklch(1_0_0_/_0.8)]" />
              <span className="font-mono text-[8px] tracking-[0.35em] text-white/25">
                LEGADO
              </span>
            </div>

            <div className="relative overflow-hidden rounded-md border border-white/20 bg-black sm:rounded-lg">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(1_0_0_/_0.06),transparent_70%)]"
                aria-hidden
              />

              <div className="relative">
                <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-3.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] text-[9px] text-white/60"
                      aria-hidden
                    >
                      #
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-black bg-primary shadow-[0_0_6px_oklch(1_0_0_/_0.8)]" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] text-primary/90">
                        sala general
                      </p>
                      <p className="text-[9px] tracking-wide text-white/45">
                        {hilo.length} mensaje{hilo.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/recuerdos"
                    className="text-[9px] tracking-[0.14em] text-white/30 transition-colors hover:text-primary"
                  >
                    archivo →
                  </Link>
                </div>

                <ul
                  ref={listRef}
                  className="flex max-h-52 flex-col gap-3 overflow-y-auto px-3 py-3 sm:max-h-60 sm:px-3.5 sm:py-3.5"
                >
                  {hilo.length === 0 ? (
                    <li className="py-6 text-center text-[10px] tracking-wide text-white/25">
                      Nadie ha escrito aún. Sé el primero.
                    </li>
                  ) : (
                    hilo.map((m) => (
                      <li key={m.id} className="flex gap-2.5">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[8px] text-white/40"
                          aria-hidden
                        >
                          {inicial(m.nombre)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-baseline gap-x-1.5 text-[10px]">
                            <span className="text-primary/85">{m.nombre}</span>
                            <span className="text-white/25">
                              {haceCuanto(m.fecha)}
                            </span>
                          </p>
                          <p className="mt-0.5 text-pretty text-[11px] leading-snug text-white/70 sm:text-[12px]">
                            {m.texto}
                          </p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>

                <form
                  ref={formRef}
                  onSubmit={onSubmit}
                  className="border-t border-white/10 px-3 py-2.5 sm:px-3.5"
                >
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden
                  />
                  <label className="sr-only" htmlFor="chat-nombre">
                    Nombre
                  </label>
                  <input
                    id="chat-nombre"
                    name="nombre"
                    type="text"
                    maxLength={24}
                    placeholder="nombre"
                    defaultValue="anon"
                    className="mb-1.5 w-full bg-transparent text-[10px] text-white/50 outline-none placeholder:text-white/20"
                  />
                  <div className="flex items-center gap-2">
                    <label className="sr-only" htmlFor="chat-texto">
                      Mensaje
                    </label>
                    <input
                      id="chat-texto"
                      name="texto"
                      type="text"
                      required
                      maxLength={240}
                      placeholder="Escribe un comentario…"
                      disabled={pending}
                      className="min-w-0 flex-1 bg-transparent text-[11px] text-primary outline-none placeholder:text-white/30 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={pending}
                      className="shrink-0 text-[10px] tracking-[0.12em] text-white/45 transition-colors hover:text-primary disabled:opacity-40"
                    >
                      {pending ? "…" : "enviar →"}
                    </button>
                  </div>
                  {error ? (
                    <p className="mt-1.5 text-[9px] text-white/35" role="status">
                      No se pudo enviar. Intenta de nuevo.
                    </p>
                  ) : null}
                </form>
              </div>
            </div>

            <div
              className="mt-2.5 flex items-center justify-center gap-1"
              aria-hidden
            >
              <span className="h-0.5 w-8 rounded-full bg-white/20" />
              <span className="h-1.5 w-1.5 rounded-full border border-white/25 bg-white/10" />
              <span className="h-0.5 w-8 rounded-full bg-white/20" />
            </div>
          </div>

          <div
            className="mx-auto mt-0 flex w-10 flex-col items-center"
            aria-hidden
          >
            <div className="h-3 w-[3px] bg-white/25" />
            <div className="h-5 w-8 border-x border-white/20 bg-gradient-to-b from-white/10 to-transparent" />
          </div>
          <div className="mx-auto w-[55%]" aria-hidden>
            <div className="h-1.5 rounded-t-sm border border-b-0 border-white/25 bg-white/[0.08]" />
            <div className="h-2 rounded-b-md border border-white/20 bg-white/[0.06]" />
          </div>

          <pre
            className="mx-auto mt-3 w-fit select-none overflow-x-auto whitespace-pre font-mono text-[10px] leading-[1.15] text-white/50 sm:text-[12px] sm:leading-[1.2]"
            aria-hidden
          >
            {`
            .-"-.
           /     \\
          |  o o  |
           \\  ^  /
          .-'---'-.
         /|       |\\
        (_|_______|_)
       .-------------.
       | ░░░░░░░░░░░ |
       '-------------'
          / /     \\ \\
`}
          </pre>
        </div>
      </div>
    </section>
  );
}
