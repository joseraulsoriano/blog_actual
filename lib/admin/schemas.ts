// Esquemas estandarizados de frontmatter por colección.
// El editor de /privado genera sus formularios a partir de esto:
// añadir un campo aquí lo añade al panel.

export type Campo = {
  name: string;
  label: string;
  tipo:
    | "texto"
    | "textarea"
    | "numero"
    | "fecha"
    | "datetime"
    | "select"
    | "fotos"
    | "etapas"
    | "tags";
  opciones?: string[]; // para select
  requerido?: boolean;
  paso?: string; // step para números (ej. "0.01")
  ayuda?: string;
};

export type EsquemaColeccion = {
  coleccion: string;
  titulo: string;
  descripcion: string;
  campos: Campo[];
  plantillaBody: string;
  /** Frase del hub de publicar: qué es esto, en una línea. */
  quePublica?: string;
  /** Ruta pública de una entrada (`/escritos` → /escritos/slug). */
  rutaPublica?: string;
  /** Se administra desde el panel, pero no se publica desde el hub. */
  soloAdmin?: boolean;
  /** El slug se deriva solo (recuerdos: de la fecha). */
  slugAutomatico?: boolean;
  /** Admite guardarse como borrador antes de publicar. */
  borradores?: boolean;
  /** Campo del que se deriva el slug al escribirlo. */
  campoTitulo?: string;
};

export const ESQUEMAS: Record<string, EsquemaColeccion> = {
  escritos: {
    coleccion: "escritos",
    titulo: "Escritos",
    descripcion: "Artículos largos: lo técnico que sí se busca en Google.",
    quePublica: "Un artículo con código, decisiones y por qué.",
    rutaPublica: "/escritos",
    borradores: true,
    campoTitulo: "title",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      {
        name: "resumen",
        label: "Resumen",
        tipo: "textarea",
        requerido: true,
        ayuda: "Es lo que se ve en Google y en la tarjeta de compartir.",
      },
      { name: "fecha", label: "Fecha", tipo: "fecha", requerido: true },
      {
        name: "tags",
        label: "Tags",
        tipo: "tags",
        ayuda: "Separados por comas: nextjs, vercel, arquitectura",
      },
      { name: "portada", label: "Portada", tipo: "fotos" },
    ],
    plantillaBody:
      "Arranca con el problema concreto, no con la introducción.\n\n## El problema\n\n## Cómo lo resolví\n\n```ts\n// el código va aquí\n```\n",
  },
  recuerdos: {
    coleccion: "recuerdos",
    titulo: "Recuerdos",
    descripcion: "Posts cortos (tipo timeline). Se publican desde aquí.",
    quePublica: "Una nota corta, ahora mismo, con foto si quieres.",
    rutaPublica: "/recuerdos",
    slugAutomatico: true,
    campos: [
      {
        name: "fecha",
        label: "Fecha y hora",
        tipo: "datetime",
        requerido: true,
      },
      {
        name: "enlace",
        label: "Enlace (opcional)",
        tipo: "texto",
        ayuda: "Ruta interna o URL, ej. /proyectos/check-driver",
      },
      { name: "fotos", label: "Fotos", tipo: "fotos" },
    ],
    plantillaBody: "",
  },
  proyectos: {
    coleccion: "proyectos",
    titulo: "Proyectos",
    descripcion: "Catálogo completo: tech, hacks, escritos, video, hubs…",
    quePublica: "Algo que construiste y quieres dejar registrado.",
    rutaPublica: "/proyectos",
    borradores: true,
    campoTitulo: "title",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      { name: "resumen", label: "Resumen", tipo: "textarea", requerido: true },
      {
        name: "categoria",
        label: "Categoría",
        tipo: "select",
        opciones: [
          "tech",
          "hackathon",
          "escrito",
          "libro",
          "video",
          "ia-arte",
          "ux",
          "web",
          "mobile",
          "producto",
          "hub",
        ],
        requerido: true,
      },
      { name: "año", label: "Año", tipo: "numero", requerido: true },
      { name: "origen", label: "Origen", tipo: "texto" },
      { name: "enlace", label: "Enlace externo", tipo: "texto" },
    ],
    plantillaBody: "Descripción del proyecto.\n",
  },
  propuestas: {
    coleccion: "propuestas",
    titulo: "Propuestas",
    descripcion: "Ideas enviadas por el formulario público (pendientes de aprobación).",
    soloAdmin: true,
    campoTitulo: "title",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      { name: "resumen", label: "Resumen", tipo: "textarea", requerido: true },
      {
        name: "categoria",
        label: "Categoría",
        tipo: "select",
        opciones: [
          "tech",
          "hackathon",
          "escrito",
          "libro",
          "video",
          "ia-arte",
          "ux",
          "web",
          "mobile",
          "producto",
          "hub",
        ],
      },
      { name: "enlace", label: "Enlace", tipo: "texto" },
      { name: "contacto", label: "Contacto", tipo: "texto" },
      {
        name: "estado",
        label: "Estado",
        tipo: "select",
        opciones: ["pendiente", "revisada", "rechazada"],
        requerido: true,
      },
      { name: "fecha", label: "Fecha", tipo: "fecha", requerido: true },
    ],
    plantillaBody: "",
  },
  eventos: {
    coleccion: "eventos",
    titulo: "Eventos",
    descripcion: "Hackathons, conferencias y conciertos.",
    quePublica: "Una noche, una conferencia, un hackathon.",
    rutaPublica: "/eventos",
    borradores: true,
    campoTitulo: "title",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      {
        name: "tipo",
        label: "Tipo",
        tipo: "select",
        opciones: ["hackathon", "concierto", "conferencia"],
        requerido: true,
      },
      { name: "lugar", label: "Lugar", tipo: "texto", requerido: true },
      { name: "año", label: "Año", tipo: "numero", requerido: true },
      {
        name: "calificacion",
        label: "Calificación (0–5)",
        tipo: "numero",
        paso: "0.5",
      },
      { name: "resumen", label: "Resumen", tipo: "textarea" },
      { name: "fotos", label: "Fotos", tipo: "fotos" },
    ],
    plantillaBody: "La historia completa del evento.\n",
  },
  viajes: {
    coleccion: "viajes",
    titulo: "Viajes",
    descripcion: "Ciudades en México, con coordenadas y fotos.",
    quePublica: "Una ciudad nueva en el globo del inicio.",
    borradores: true,
    campoTitulo: "ciudad",
    campos: [
      { name: "ciudad", label: "Ciudad", tipo: "texto", requerido: true },
      { name: "pais", label: "País", tipo: "texto", requerido: true },
      { name: "lat", label: "Latitud", tipo: "numero", paso: "0.01", requerido: true },
      { name: "lon", label: "Longitud", tipo: "numero", paso: "0.01", requerido: true },
      { name: "año", label: "Año (primera visita)", tipo: "numero", requerido: true },
      { name: "resumen", label: "Resumen", tipo: "textarea" },
      { name: "fotos", label: "Fotos", tipo: "fotos" },
      {
        name: "etapas",
        label: "Etapas",
        tipo: "etapas",
        ayuda:
          "Hechos fijos de la ciudad (mudanza, estudio…). Se mezclan con eventos y recuerdos en la línea de tiempo.",
      },
    ],
    plantillaBody: "Bitácora del viaje.\n",
  },
  opiniones: {
    coleccion: "opiniones",
    titulo: "Opiniones",
    descripcion: "Posturas firmadas y fechadas: lo que pienso hoy sobre algo.",
    quePublica: "Una postura con fecha, para poder releerla dentro de años.",
    rutaPublica: "/opiniones",
    borradores: true,
    campoTitulo: "title",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      {
        name: "resumen",
        label: "La tesis en una frase",
        tipo: "textarea",
        requerido: true,
        ayuda: "Si alguien solo lee esto, ya sabe qué piensas.",
      },
      { name: "fecha", label: "Fecha", tipo: "fecha", requerido: true },
      {
        name: "tema",
        label: "Tema",
        tipo: "select",
        opciones: [
          "tecnologia",
          "industria",
          "educacion",
          "cultura",
          "personal",
        ],
      },
      { name: "tags", label: "Tags", tipo: "tags" },
    ],
    plantillaBody:
      "Di la postura en el primer párrafo; después defiéndela.\n\n## Por qué lo pienso\n\n## En qué podría estar equivocado\n",
  },
  recursos: {
    coleccion: "recursos",
    titulo: "Recursos",
    descripcion: "Libros, cursos, herramientas y repos que sí valen la pena.",
    quePublica: "Algo que te sirvió y quieres recomendar con contexto.",
    rutaPublica: "/recursos",
    borradores: true,
    campoTitulo: "title",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      {
        name: "resumen",
        label: "Por qué lo recomiendas",
        tipo: "textarea",
        requerido: true,
        ayuda: "Una o dos frases: para quién es y qué resuelve.",
      },
      {
        name: "tipo",
        label: "Tipo",
        tipo: "select",
        opciones: [
          "libro",
          "curso",
          "herramienta",
          "articulo",
          "video",
          "podcast",
          "repo",
        ],
        requerido: true,
      },
      {
        name: "enlace",
        label: "Enlace",
        tipo: "texto",
        ayuda: "URL del recurso (https://…).",
      },
      { name: "autor", label: "Autor / creador", tipo: "texto" },
      { name: "fecha", label: "Fecha", tipo: "fecha", requerido: true },
      { name: "tags", label: "Tags", tipo: "tags" },
    ],
    plantillaBody: "Notas de lectura: qué me llevé, qué me saltaría.\n",
  },
  paginas: {
    coleccion: "paginas",
    titulo: "Páginas",
    descripcion: "Páginas sueltas como la bio.",
    soloAdmin: true,
    campoTitulo: "title",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      { name: "resumen", label: "Resumen", tipo: "textarea" },
    ],
    plantillaBody: "Contenido de la página.\n",
  },
};

/** Orden del hub: primero lo que más se publica. */
export const ORDEN_PUBLICAR = [
  "recuerdos",
  "escritos",
  "opiniones",
  "recursos",
  "eventos",
  "proyectos",
  "viajes",
] as const;

/** Esquemas publicables, en el orden del hub. */
export function esquemasPublicables(): EsquemaColeccion[] {
  const ordenados = ORDEN_PUBLICAR.map((c) => ESQUEMAS[c]).filter(Boolean);
  const resto = Object.values(ESQUEMAS).filter(
    (e) => !e.soloAdmin && !ORDEN_PUBLICAR.includes(e.coleccion as never)
  );
  return [...ordenados, ...resto];
}

export function esColeccionValida(c: string): c is keyof typeof ESQUEMAS {
  return Object.prototype.hasOwnProperty.call(ESQUEMAS, c);
}

export function esSlugValido(s: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,80}$/.test(s);
}
