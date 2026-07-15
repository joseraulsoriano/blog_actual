import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/** Mapeo MDX con estética de terminal: encabezados con ##, listas con >, etc. */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="terminal-glow mt-10 mb-3 text-lg font-semibold text-primary before:mr-2 before:text-accent before:content-['##']"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 mb-2 font-semibold text-primary before:mr-2 before:text-accent before:content-['###']"
      {...props}
    />
  ),
  p: (props) => <p className="mb-4 leading-7 text-foreground/90" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="text-accent underline underline-offset-4 hover:text-primary"
        {...props}
      />
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-accent underline underline-offset-4 hover:text-primary"
        {...props}
      />
    ),
  ul: (props) => <ul className="mb-4 space-y-1.5" {...props} />,
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6 marker:text-accent" {...props} />
  ),
  li: (props) => (
    <li
      className="pl-5 leading-7 text-foreground/90 before:-ml-5 before:mr-2 before:text-accent before:content-['>'] [ol_&]:pl-0 [ol_&]:before:content-none"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mb-4 border-l-2 border-accent pl-4 text-accent italic"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-primary" {...props} />,
  hr: () => (
    <p className="my-6 text-muted-foreground select-none" aria-hidden>
      ────────────────────────────
    </p>
  ),
};
