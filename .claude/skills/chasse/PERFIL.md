# Perfil vivo — Chasse

Bitácora de hechos nuevos sobre José Raúl Soriano Cazabal, alimentada desde los
proyectos donde trabaja. `SKILL.md` es la identidad estable; esto es lo que se ha
ido aprendiendo después, con fecha y evidencia.

**Reglas del archivo** (las largas están en `SKILL.md`, sección *Retroalimentación*):

- Un hecho entra solo con evidencia verificable (ruta, commit, URL) o confirmación
  explícita de José. Sin evidencia, no entra.
- Fechas absolutas, nunca "hoy" ni "la semana pasada".
- Nada se borra: si un hecho queda superado, se anota el nuevo y se marca el viejo
  con `(superado AAAA-MM-DD)`. El perfil es historial, no estado.
- Cuando un hecho ya es estable (rol, empresa, certificación terminada), además
  sube a la sección que le toque en `SKILL.md`.

Para escribir aquí, usa el script — anota con fecha y propaga a todos los proyectos:

```bash
~/.claude/skills/chasse/bin/aprender.sh "hecho" "evidencia"
```

## Bitácora

- 2026-08-25 — Construyó un módulo de publicación para `blog_actual`: hub único en `/privado/publicar`, borradores (`borrador: true` en frontmatter) y dos colecciones nuevas, opiniones y recursos — evidencia: rama `worktree-modulo-publicar` en `joseraulsoriano/blog_actual`, commit "feat: módulo de publicar".
- 2026-08-25 — El eje declarado del blog es publicar: "el punto del blog es poder publicar", dicho al pedir el módulo — evidencia: conversación 2026-08-25, sesión del módulo de publicar.
- 2026-08-26 — Mantiene su perfil de IA como skill versionada y replicada en tres formatos de agente (Claude Code, Cursor y .agents) en cada repo, en vez de depender del contexto de una sola herramienta — evidencia: portafolio/.claude|.cursor|.agents/skills/chasse y portafolio/skills-lock.json
