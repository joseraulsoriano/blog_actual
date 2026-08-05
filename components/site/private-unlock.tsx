"use client";

import { useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Atajo: Ctrl/Cmd + Shift + L → arma ~10s. */
/** Secuencia: "legado" → emite puerta firmada y abre login. */
const SECRET = "legado";
const ARM_MS = 10_000;

function esCampoDeTexto(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

export function PrivateUnlock() {
  const router = useRouter();
  const pathname = usePathname();
  const armedUntil = useRef(0);
  const buffer = useRef("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (pathname.startsWith("/privado")) return;

    function irAlLogin() {
      armedUntil.current = 0;
      buffer.current = "";
      startTransition(async () => {
        try {
          // Route Handler (no Server Action): atraviesa el proxy /blog.
          const res = await fetch("/blog/api/privado/unlock", {
            method: "POST",
            credentials: "same-origin",
          });
          if (!res.ok) return;
          router.push("/privado/login");
        } catch {
          /* silencio: el atajo no debe ruidear la UI */
        }
      });
    }

    function onKeyDown(e: KeyboardEvent) {
      if (esCampoDeTexto(e.target)) return;

      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        armedUntil.current = Date.now() + ARM_MS;
        buffer.current = "";
        return;
      }

      if (Date.now() > armedUntil.current) {
        buffer.current = "";
        return;
      }

      if (e.key === "Escape") {
        armedUntil.current = 0;
        buffer.current = "";
        return;
      }

      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;

      buffer.current = (buffer.current + e.key.toLowerCase()).slice(
        -SECRET.length
      );
      if (buffer.current === SECRET) {
        e.preventDefault();
        irAlLogin();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router]);

  return null;
}
