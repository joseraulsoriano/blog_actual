import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { getEntry } from "@/lib/content";
import { Prosa } from "@/components/retro/prosa";
import { PageShell } from "@/components/site/page-shell";
import { CaseStamp } from "@/components/detective/case-stamp";
import { CaseBoard } from "@/components/detective/case-board";
import { CaseSectionCard } from "@/components/detective/case-section-card";
import { RevealTypewriter } from "@/components/detective/reveal-typewriter";
import {
  expedienteAlias,
  expedienteLugar,
  getExpedienteEdad,
  splitBioSections,
} from "@/lib/expediente";

export const metadata: Metadata = {
  title: "Bio",
  description:
    "Quién es José Raúl Soriano Cazabal: biografía, formación, experiencia, certificaciones y redes.",
};

export default function BioPage() {
  const bio = getEntry<{ title: string; resumen?: string }>("paginas", "bio");
  if (!bio) notFound();

  const { intro, sections } = splitBioSections(bio.content);

  return (
    <PageShell wide className="py-8 sm:py-20">
      <header className="mb-8 sm:mb-14">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Expediente
          </p>
          <CaseStamp>Activo</CaseStamp>
        </div>
        <h1 className="text-balance text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-primary neon-text">
          José Raúl Soriano Cazabal
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          alias <span className="text-foreground/80">{expedienteAlias}</span> ·{" "}
          {expedienteLugar} · {getExpedienteEdad()} años
        </p>
        {bio.data.resumen ? (
          <RevealTypewriter
            text={bio.data.resumen}
            speed={14}
            className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-foreground/85 sm:mt-6 sm:text-lg"
          />
        ) : null}
        <div
          className="mt-5 h-px w-16 bg-white/70 shadow-[0_0_16px_oklch(1_0_0_/_0.45)] sm:mt-8"
          aria-hidden
        />
        <article className="mt-6 max-w-prose sm:mt-8">
          <Prosa source={intro} />
        </article>
      </header>

      <section aria-labelledby="board-heading" className="mb-8 sm:mb-14">
        <h2
          id="board-heading"
          className="mb-1 text-[1.1rem] font-semibold tracking-[-0.01em] text-primary"
        >
          El expediente completo
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Cada tarjeta es una sección real de mi bio — nada resumido, nada oculto.
        </p>
        <CaseBoard>
          {sections.map((section, i) => (
            <CaseSectionCard
              key={section.id}
              id={section.id}
              title={section.title}
              index={i}
            >
              <Prosa source={section.body} />
            </CaseSectionCard>
          ))}
        </CaseBoard>
      </section>

      <section aria-labelledby="skills-heading">
        <h2
          id="skills-heading"
          className="mb-1 text-[1.1rem] font-semibold tracking-[-0.01em] text-primary"
        >
          Descargas — las skills del expediente
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Dos skills portables (SKILL.md, cualquier agente) escritas a partir
          de este perfil. Descárgalas.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SkillDownloadCard
            nombre="chasse"
            descripcion="Identidad y voz de José Raúl Soriano Cazabal: perfil, valores, cómo escribe."
            href="/skills/chasse.md"
          />
          <SkillDownloadCard
            nombre="detective"
            descripcion="Método de lectura tipo cold-reading sobre evidencia real, cero horóscopo."
            href="/skills/detective.md"
          />
        </div>
      </section>
    </PageShell>
  );
}

function SkillDownloadCard({
  nombre,
  descripcion,
  href,
}: {
  nombre: string;
  descripcion: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      download
      className="group flex items-start justify-between gap-4 border border-white/[0.14] bg-white/[0.02] p-5 transition-colors hover:border-[var(--thread)]/60"
    >
      <div>
        <p className="font-mono text-[0.95rem] text-foreground/95">
          /{nombre}
        </p>
        <p className="mt-1.5 text-pretty text-[0.85rem] leading-[1.55] text-muted-foreground">
          {descripcion}
        </p>
      </div>
      <Download
        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary"
        aria-hidden
      />
    </Link>
  );
}
