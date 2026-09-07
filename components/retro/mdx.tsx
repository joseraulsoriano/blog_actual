import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

/** Tipografía editorial para MDX — sin prefijos de terminal. */
export const mdxComponents: MDXComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-4 text-[1.35rem] font-semibold tracking-[-0.02em] text-primary sm:text-2xl"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-8 mb-3 text-lg font-medium tracking-[-0.01em] text-primary"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-5 text-pretty leading-[1.8] text-foreground/82" {...props} />
  ),
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="text-primary underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60"
        {...props}
      />
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60"
        {...props}
      />
    ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-5 list-disc space-y-2 pl-5 marker:text-white/40" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-5 list-decimal space-y-2 pl-5 marker:text-white/45" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-[1.75] text-foreground/82" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-6 border-l-2 border-white/35 pl-5 text-pretty italic leading-[1.75] text-foreground/75"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-primary" {...props} />
  ),
  hr: () => <hr className="my-10 border-white/[0.1]" />,

  // rehype-pretty-code inyecta los colores; aquí solo va el contenedor.
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="mb-6 overflow-x-auto border border-white/[0.14] bg-white/[0.03] py-4 text-[0.82rem] leading-[1.65]"
      {...props}
    />
  ),

  // Imágenes de MDX: sin dimensiones conocidas, next/image no aplica.
  // `<img>` no hereda el basePath /blog como sí lo hace next/link.
  img: ({ alt = "", src, ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={typeof src === "string" ? withBasePath(src) : src}
      loading="lazy"
      decoding="async"
      className="mb-6 h-auto w-full border border-white/[0.12]"
      {...props}
    />
  ),

  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-white/25 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border-b border-white/[0.08] px-3 py-2 align-top text-foreground/82"
      {...props}
    />
  ),
};
