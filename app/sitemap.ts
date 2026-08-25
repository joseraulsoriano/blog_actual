import type { MetadataRoute } from "next";
import {
  getEscritos,
  getEventos,
  getProyectos,
  getRecuerdos,
  getViajes,
} from "@/lib/content";
import { fechaRecuerdoISO } from "@/lib/recuerdos";
import { urlAbsoluta } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  const fijas: MetadataRoute.Sitemap = [
    { url: urlAbsoluta("/"), lastModified: ahora, priority: 1 },
    { url: urlAbsoluta("/escritos"), lastModified: ahora, priority: 0.9 },
    { url: urlAbsoluta("/proyectos"), lastModified: ahora, priority: 0.8 },
    { url: urlAbsoluta("/bio"), lastModified: ahora, priority: 0.7 },
    { url: urlAbsoluta("/recuerdos"), lastModified: ahora, priority: 0.6 },
    { url: urlAbsoluta("/eventos"), lastModified: ahora, priority: 0.6 },
    { url: urlAbsoluta("/viajes"), lastModified: ahora, priority: 0.6 },
    { url: urlAbsoluta("/proponer"), lastModified: ahora, priority: 0.4 },
  ];

  const escritos = getEscritos().map((e) => ({
    url: urlAbsoluta(`/escritos/${e.slug}`),
    lastModified: new Date(`${e.data.fecha}T12:00:00`),
    priority: 0.9,
  }));

  const proyectos = getProyectos().map((p) => ({
    url: urlAbsoluta(`/proyectos/${p.slug}`),
    lastModified: ahora,
    priority: 0.7,
  }));

  const eventos = getEventos().map((e) => ({
    url: urlAbsoluta(`/eventos/${e.slug}`),
    lastModified: ahora,
    priority: 0.5,
  }));

  const recuerdos = getRecuerdos().map((r) => ({
    url: urlAbsoluta(`/recuerdos/${r.slug}`),
    lastModified: new Date(fechaRecuerdoISO(r.data.fecha)),
    priority: 0.4,
  }));

  // Las ciudades no tienen página propia: se abren como ?ciudad= en /viajes.
  const viajes = getViajes().map((v) => ({
    url: urlAbsoluta(`/viajes?ciudad=${v.slug}`),
    lastModified: ahora,
    priority: 0.3,
  }));

  return [...fijas, ...escritos, ...proyectos, ...eventos, ...recuerdos, ...viajes].map(
    (e) => ({
      ...e,
      lastModified:
        e.lastModified instanceof Date && !Number.isNaN(e.lastModified.getTime())
          ? e.lastModified
          : ahora,
    })
  );
}
