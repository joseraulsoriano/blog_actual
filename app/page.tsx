import Link from "next/link";
import { AsciiLogo } from "@/components/retro/ascii-logo";
import { Typewriter } from "@/components/retro/typewriter";
import { PromptLine, TerminalWindow } from "@/components/retro/terminal-window";
import { getRecuerdos } from "@/lib/content";

const comandos = [
  { href: "/bio", cmd: "cd ~/bio", desc: "quién soy, de dónde vengo" },
  { href: "/proyectos", cmd: "cd ~/proyectos", desc: "lo que he construido" },
  { href: "/eventos", cmd: "cd ~/eventos", desc: "hackathons y conciertos" },
  { href: "/viajes", cmd: "cd ~/viajes", desc: "viajando por el mundo" },
  { href: "/recuerdos", cmd: "cd ~/recuerdos", desc: "el timeline del legado" },
  { href: "/privado", cmd: "sudo cd ~/privado", desc: "requiere contraseña" },
];

export default function Home() {
  const ultimos = getRecuerdos().slice(0, 3);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <AsciiLogo className="mb-6" />

      <div className="mb-10 space-y-1.5 text-sm sm:text-base">
        <PromptLine command="whoami" />
        <p className="text-foreground/90">
          José Raúl Soriano · estudiante de TI · coleccionista de recuerdos
        </p>
        <PromptLine command="cat lema.txt" />
        <p className="terminal-glow text-primary">
          <Typewriter
            text='"Sin sacrificio no hay victoria." — legado digital desde 2021'
            startDelay={400}
          />
        </p>
      </div>

      <TerminalWindow title="menu — elige tu destino" className="mb-8">
        <nav className="space-y-2.5">
          {comandos.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-wrap items-baseline gap-x-3 gap-y-0.5"
            >
              <span className="text-accent">&gt;</span>
              <span className="terminal-glow text-primary underline-offset-4 group-hover:underline">
                {c.cmd}
              </span>
              <span className="text-sm text-muted-foreground">
                # {c.desc}
              </span>
            </Link>
          ))}
        </nav>
      </TerminalWindow>

      <TerminalWindow title="tail -3 ~/recuerdos.log" className="mb-8">
        <ul className="space-y-2 text-sm">
          {ultimos.map((r) => (
            <li key={r.slug}>
              <span className="text-muted-foreground">
                [{r.data.fecha}]
              </span>{" "}
              <Link
                href={`/recuerdos/${r.slug}`}
                className="terminal-glow text-primary underline-offset-4 hover:underline"
              >
                {r.data.title}
              </Link>
              <span className="ml-2 text-muted-foreground">
                # {r.data.resumen}
              </span>
            </li>
          ))}
        </ul>
      </TerminalWindow>

      <TerminalWindow title="cápsula del tiempo">
        <p className="mb-3 text-sm leading-6 text-foreground/80">
          La versión 2021 de este blog se conserva intacta, tal como era:
          Bootstrap, jQuery y todo. La primera pieza del legado.
        </p>
        <p className="text-sm">
          <span className="text-accent">&gt;</span>{" "}
          <a
            href="/2021/index.html"
            className="terminal-glow text-primary underline-offset-4 hover:underline"
          >
            open /2021/index.html
          </a>{" "}
          <span className="text-muted-foreground"># 🕰️ viajar a 2021</span>
        </p>
      </TerminalWindow>
    </div>
  );
}
