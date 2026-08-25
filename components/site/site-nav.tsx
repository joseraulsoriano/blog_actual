"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FolderKanban,
  Home,
  MapPinned,
  PenLine,
  Ticket,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/escritos", label: "Escritos", icon: PenLine },
  { href: "/bio", label: "Expediente", icon: UserRound },
  { href: "/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/eventos", label: "Eventos", icon: Ticket },
  { href: "/viajes", label: "Viajes", icon: MapPinned },
  { href: "/recuerdos", label: "Recuerdos", icon: BookOpen },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Dock en las 6 vistas; el detalle ([slug]) hereda el activo de su sección. */
export function SiteNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/privado")) return null;

  const enInicio = pathname === "/";

  return (
    <>
      <nav
        aria-label="Principal"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-black/90 backdrop-blur-md",
          "pb-[max(0.35rem,env(safe-area-inset-bottom))]",
          "md:inset-x-auto md:bottom-6 md:left-1/2 md:w-auto md:-translate-x-1/2",
          "md:rounded-full md:border md:border-white/15 md:bg-black/85 md:px-2 md:shadow-[0_0_24px_oklch(0_0_0_/_0.6)]"
        )}
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0 px-1 md:gap-1 md:px-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            const isHome = href === "/";
            return (
              <li key={href} className="flex-1 md:flex-none">
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 px-2 text-[9px] uppercase tracking-[0.12em] transition-colors md:min-h-12 md:min-w-12 md:rounded-full md:px-3",
                    active
                      ? "text-primary"
                      : "text-white/55 active:text-white/70 md:hover:text-white/80"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[1.35rem] w-[1.35rem] stroke-[1.5]",
                      (active || isHome) &&
                        "drop-shadow-[0_0_10px_oklch(1_0_0_/_0.7)]",
                      isHome &&
                        active &&
                        "drop-shadow-[0_0_14px_oklch(1_0_0_/_0.95)]"
                    )}
                    aria-hidden
                  />
                  <span className="md:sr-only">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Respiro superior del hero en móvil; el resto ya lo da PageShell. */}
      {enInicio ? <div className="h-16 md:h-0" aria-hidden /> : null}
    </>
  );
}
