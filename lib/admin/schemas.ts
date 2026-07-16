// Esquemas estandarizados de frontmatter por colección.
// El editor de /privado genera sus formularios a partir de esto:
// añadir un campo aquí lo añade al panel.

export type Campo = {
  name: string;
  label: string;
  tipo: "texto" | "textarea" | "numero" | "fecha" | "datetime" | "select" | "fotos";
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
};

export const ESQUEMAS: Record<string, EsquemaColeccion> = {
  recuerdos: {
    coleccion: "recuerdos",
    titulo: "Recuerdos",
    descripcion: "Posts cortos (tipo timeline). Se publican desde aquí.",
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
    ],
    plantillaBody: "",
  },
  proyectos: {
    coleccion: "proyectos",
    titulo: "Proyectos",
    descripcion: "Catálogo completo: tech, hacks, escritos, video, hubs…",
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
    ],
    plantillaBody: "La historia completa del evento.\n",
  },
  viajes: {
    coleccion: "viajes",
    titulo: "Viajes",
    descripcion: "Ciudades en México, con coordenadas y fotos.",
    campos: [
      { name: "ciudad", label: "Ciudad", tipo: "texto", requerido: true },
      { name: "pais", label: "País", tipo: "texto", requerido: true },
      { name: "lat", label: "Latitud", tipo: "numero", paso: "0.01", requerido: true },
      { name: "lon", label: "Longitud", tipo: "numero", paso: "0.01", requerido: true },
      { name: "año", label: "Año (primera visita)", tipo: "numero", requerido: true },
      { name: "resumen", label: "Resumen", tipo: "textarea" },
      { name: "fotos", label: "Fotos", tipo: "fotos" },
    ],
    plantillaBody: "Bitácora del viaje.\n",
  },
  paginas: {
    coleccion: "paginas",
    titulo: "Páginas",
    descripcion: "Páginas sueltas como la bio.",
    campos: [
      { name: "title", label: "Título", tipo: "texto", requerido: true },
      { name: "resumen", label: "Resumen", tipo: "textarea" },
    ],
    plantillaBody: "Contenido de la página.\n",
  },
};

export function esColeccionValida(c: string): c is keyof typeof ESQUEMAS {
  return Object.prototype.hasOwnProperty.call(ESQUEMAS, c);
}

export function esSlugValido(s: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,80}$/.test(s);
}
