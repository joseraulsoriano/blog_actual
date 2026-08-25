import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, {
  type Options as OpcionesCodigo,
} from "rehype-pretty-code";
import { mdxComponents } from "@/components/retro/mdx";
import { cn } from "@/lib/utils";

/** Tema de baja saturación: el código no debe pelearse con el blanco neón. */
const opcionesCodigo: OpcionesCodigo = {
  theme: "vesper",
  keepBackground: false,
  defaultLang: { block: "text", inline: "text" },
};

/**
 * Renderiza MDX del archivo con resaltado de sintaxis.
 * Un solo lugar: bio, eventos, proyectos y escritos comparten tipografía.
 */
export function Prosa({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <div className={cn("mdx-prosa", className)}>
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: { rehypePlugins: [[rehypePrettyCode, opcionesCodigo]] },
        }}
      />
    </div>
  );
}
