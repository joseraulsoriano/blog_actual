import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} José Raúl Soriano · Legado digital</p>
        <nav className="flex items-center gap-4">
          <a
            href="/2021/index.html"
            className="transition-colors hover:text-foreground"
          >
            Versión 2021
          </a>
          <Link href="/bio" className="transition-colors hover:text-foreground">
            Sobre mí
          </Link>
        </nav>
      </div>
    </footer>
  );
}
