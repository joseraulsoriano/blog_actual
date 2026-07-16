import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

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
};
