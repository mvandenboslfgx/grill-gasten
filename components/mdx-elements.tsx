import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={`font-heading text-4xl uppercase tracking-wide text-white md:text-5xl ${className ?? ""}`}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={`font-heading mt-10 text-2xl uppercase tracking-wide text-white md:text-3xl ${className ?? ""}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={`font-heading mt-8 text-xl uppercase tracking-wide text-white ${className ?? ""}`}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={`mt-4 text-base leading-relaxed text-muted-foreground ${className ?? ""}`} {...props} />
  ),
  a: ({ className, href, ...props }) => (
    <a
      className={`text-primary underline-offset-4 hover:underline ${className ?? ""}`}
      href={href}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={`mt-4 list-inside list-disc space-y-2 text-muted-foreground ${className ?? ""}`} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={`mt-4 list-inside list-decimal space-y-2 text-muted-foreground ${className ?? ""}`} {...props} />
  ),
  li: ({ className, ...props }) => <li className={`leading-relaxed ${className ?? ""}`} {...props} />,
  strong: ({ className, ...props }) => (
    <strong className={`font-semibold text-white ${className ?? ""}`} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={`mt-6 border-l-2 border-primary pl-4 text-sm italic text-muted-foreground ${className ?? ""}`}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={`my-10 border-white/10 ${className ?? ""}`} {...props} />
  ),
};
