import Link from "next/link";
import { ArrowRight, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const secciones = [
  {
    href: "/bio",
    title: "Bio",
    description: "Quién soy, de dónde vengo y hacia dónde voy.",
  },
  {
    href: "/proyectos",
    title: "Proyectos",
    description: "Lo que he construido: código, hardware e ideas.",
  },
  {
    href: "/eventos",
    title: "Eventos",
    description: "Hackathons, conferencias y momentos que marcaron el camino.",
  },
  {
    href: "/viajes",
    title: "Viajes",
    description: "Viajando por el mundo, ahora con mapa propio.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="flex flex-col items-start gap-6 py-20 sm:py-28">
        <Badge variant="secondary">Legado digital · desde 2021</Badge>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Los recuerdos de José Raúl Soriano, en digital.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Este no es solo un blog: es una línea de tiempo de proyectos,
          eventos, viajes y momentos — lo que quiero que trascienda.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            render={
              <Link href="/recuerdos">
                Explorar recuerdos <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <Button
            variant="outline"
            render={
              <a href="/2021/index.html">
                <Hourglass className="h-4 w-4" /> Cápsula del tiempo: 2021
              </a>
            }
          />
        </div>
      </section>

      <section className="grid gap-4 pb-20 sm:grid-cols-2">
        {secciones.map((s) => (
          <Link key={s.href} href={s.href} className="group">
            <Card className="h-full transition-colors group-hover:border-foreground/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {s.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section className="pb-24">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">🕰️ La primera pieza del legado</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            La versión 2021 de este blog se conserva intacta, tal como era:
            Bootstrap, jQuery y todo.{" "}
            <a
              href="/2021/index.html"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Visítala aquí
            </a>
            .
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
