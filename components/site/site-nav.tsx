"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/bio", label: "Bio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/viajes", label: "Viajes" },
  { href: "/recuerdos", label: "Recuerdos" },
  { href: "/privado", label: "Privado" },
];

function NavLink({
  href,
  label,
  className,
  onClick,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm transition-colors hover:text-foreground",
        active ? "text-foreground font-medium" : "text-muted-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="terminal-glow font-semibold tracking-tight">
          [chasse@blog ~]$
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
          <a
            href="/2021/index.html"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            title="Versión 2021 del blog, conservada como pieza del legado"
          >
            🕰️ 2021
          </a>
        </nav>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            }
          />
          <SheetContent side="right" className="w-64">
            <SheetTitle className="px-1 text-base">Navegación</SheetTitle>
            <nav className="mt-4 flex flex-col gap-4 px-1">
              {links.map((l) => (
                <NavLink key={l.href} {...l} className="text-base" />
              ))}
              <a
                href="/2021/index.html"
                className="text-base text-muted-foreground transition-colors hover:text-foreground"
              >
                🕰️ Versión 2021
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
