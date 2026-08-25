"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type Foto = { src: string; alt: string };

/**
 * Galería estándar del archivo: misma retícula y mismo visor en
 * viajes, eventos y recuerdos. Las fotos vienen del panel (/privado).
 */
export function MediaGallery({
  fotos,
  columnas = 2,
  className,
}: {
  fotos: Foto[];
  columnas?: 2 | 3;
  className?: string;
}) {
  if (!fotos?.length) return null;

  return (
    <div
      className={cn(
        "grid gap-2",
        columnas === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
        className
      )}
    >
      {fotos.map((f) => (
        <Dialog key={f.src}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="relative aspect-[4/3] overflow-hidden border border-white/15 transition-colors hover:border-white/35"
                aria-label={`Ampliar: ${f.alt || "foto"}`}
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 240px"
                  className="object-cover"
                />
              </button>
            }
          />
          <DialogContent className="max-w-3xl border-white/15 bg-black p-2">
            <DialogTitle className="px-2 pt-2 text-sm">
              {f.alt || "Foto"}
            </DialogTitle>
            <Image
              src={f.src}
              alt={f.alt}
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
            />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
