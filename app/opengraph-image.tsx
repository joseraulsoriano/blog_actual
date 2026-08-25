import { OG_SIZE, OG_TYPE, tarjetaOG } from "@/lib/og";

export const alt = "Blog de José Raúl Soriano";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return tarjetaOG({
    eyebrow: "Legado digital",
    titulo: "Proyectos, escritos y el archivo de lo vivido",
  });
}
