# Graph Report - content  (2026-07-15)

## Corpus Check
- Corpus is ~2,031 words - fits in a single context window. You may not need a graph.

## Summary
- 25 nodes · 24 edges · 11 communities (4 shown, 7 thin omitted)
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.81)
- Token cost: 55,000 input · 4,900 output

## Community Hubs (Navigation)
- José: BUAP y Check Driver
- Hack Morelos y ConectiDoc
- Tec de Monterrey y Future Funds
- Escritos y Legado Digital
- Festivales: Vive Latino y Sabino
- UX: Google y Portafolio
- Hack Meta
- Perotá Chingó
- The Weeknd
- Travis Scott
- Para Mejorar Hay Que Crecer

## God Nodes (most connected - your core abstractions)
1. `José Raúl Soriano Cazabal` - 10 edges
2. `Hack Morelos` - 5 edges
3. `Lobo Hack` - 4 edges
4. `Tec de Monterrey` - 4 edges
5. `Check Driver` - 3 edges
6. `Legado Digital` - 3 edges
7. `Hack Mty` - 2 edges
8. `BUAP` - 2 edges
9. `Certificación UX Design de Google` - 2 edges
10. `ConectiDoc` - 2 edges

## Surprising Connections (you probably didn't know these)
- `José Raúl Soriano Cazabal` --references--> `ConectiDoc`  [EXTRACTED]
  paginas/bio.mdx → proyectos/conectidoc.mdx
- `José Raúl Soriano Cazabal` --conceptually_related_to--> `IA + Arte`  [INFERRED]
  paginas/bio.mdx → proyectos/ia-plus-art.mdx
- `Hack Morelos` --references--> `Tec de Monterrey`  [EXTRACTED]
  eventos/hack-morelos.mdx → paginas/bio.mdx
- `Hack Morelos` --references--> `ConectiDoc`  [EXTRACTED]
  eventos/hack-morelos.mdx → proyectos/conectidoc.mdx
- `José Raúl Soriano Cazabal` --references--> `Hack Morelos`  [EXTRACTED]
  paginas/bio.mdx → eventos/hack-morelos.mdx

## Hyperedges (group relationships)
- **Trayectoria de hackathons y eventos tecnológicos** — eventos_lobo_hack_lobo_hack, eventos_hack_morelos_hack_morelos, eventos_hack_mty_hack_mty, eventos_hack_meta_hack_meta, eventos_talent_land_2025_talent_land_2025 [EXTRACTED 1.00]
- **Conciertos y festivales** — eventos_perota_chingo_perota_chingo, eventos_sabino_sabino, eventos_the_weeknd_the_weeknd, eventos_travis_scott_travis_scott, eventos_vive_latino_2024_festival_vive_latino_2024 [EXTRACTED 1.00]
- **Escritos personales** — proyectos_365_dias_escribiendote_365_dias_escribiendote, proyectos_para_mejorar_hay_que_crecer_para_mejorar_hay_que_crecer, proyectos_satisfaccion_dolorosa_satisfaccion_dolorosa [EXTRACTED 1.00]

## Communities (11 total, 7 thin omitted)

### Community 0 - "José: BUAP y Check Driver"
Cohesion: 0.38
Nodes (7): Lobo Hack, BUAP, José Raúl Soriano Cazabal, Microsoft Student Ambassador, Check Driver, Notion, IA + Arte

### Community 1 - "Hack Morelos y ConectiDoc"
Cohesion: 0.67
Nodes (3): Hack Morelos, Talent Land 2025, ConectiDoc

### Community 2 - "Tec de Monterrey y Future Funds"
Cohesion: 1.00
Nodes (3): Hack Mty, Tec de Monterrey, Future Funds

### Community 3 - "Escritos y Legado Digital"
Cohesion: 0.67
Nodes (3): 365 Días Escribiéndote, Legado Digital, Satisfacción Dolorosa

## Knowledge Gaps
- **14 isolated node(s):** `Hack Meta`, `Perotá Chingó`, `Sabino`, `Talent Land 2025`, `The Weeknd` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `José Raúl Soriano Cazabal` connect `José: BUAP y Check Driver` to `Hack Morelos y ConectiDoc`, `Tec de Monterrey y Future Funds`, `Escritos y Legado Digital`, `UX: Google y Portafolio`?**
  _High betweenness centrality (0.386) - this node is a cross-community bridge._
- **Why does `Legado Digital` connect `Escritos y Legado Digital` to `José: BUAP y Check Driver`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `Tec de Monterrey` connect `Tec de Monterrey y Future Funds` to `José: BUAP y Check Driver`, `Hack Morelos y ConectiDoc`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `Hack Meta`, `Perotá Chingó`, `Sabino` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._