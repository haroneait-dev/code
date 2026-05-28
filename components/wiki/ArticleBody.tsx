"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check } from "lucide-react";

export function ArticleBody({ body }: { body: string }) {
  return (
    <div className="prose-claude max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true }]]}
        components={{
          h2: (props) => (
            <h2
              {...props}
              className="font-headline-lg text-[24px] font-semibold mt-12 mb-4 pb-2 border-b border-outline-variant text-on-surface scroll-mt-24"
            />
          ),
          h3: (props) => (
            <h3
              {...props}
              className="font-headline-lg text-[20px] font-semibold mt-8 mb-3 text-on-surface scroll-mt-24"
            />
          ),
          p: (props) => (
            <p
              {...props}
              className="font-body-rt text-body-rt text-on-surface leading-relaxed mb-4"
            />
          ),
          ul: (props) => (
            <ul {...props} className="list-disc pl-6 mb-4 space-y-2 text-body-rt text-on-surface" />
          ),
          ol: (props) => (
            <ol {...props} className="list-decimal pl-6 mb-4 space-y-2 text-body-rt text-on-surface" />
          ),
          li: (props) => <li {...props} className="leading-relaxed" />,
          a: (props) => (
            <a
              {...props}
              className="text-primary underline underline-offset-2 hover:text-on-surface transition-colors"
              target={props.href?.startsWith("http") ? "_blank" : undefined}
              rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
            />
          ),
          strong: (props) => (
            <strong {...props} className="font-semibold text-on-surface" />
          ),
          em: (props) => <em {...props} className="italic" />,
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            }
            return (
              <code
                {...props}
                className="font-code-md text-[0.9em] text-primary bg-primary-fixed/30 px-1.5 py-0.5 rounded"
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            const codeProps = (children as { props?: { className?: string; children?: string } })?.props ?? {};
            const code = String(codeProps.children ?? "");
            const lang = codeProps.className?.replace("language-", "") ?? "text";
            return <CodeBlockCopy code={code} lang={lang} />;
          },
          blockquote: (props) => (
            <blockquote
              {...props}
              className="border-l-4 border-primary pl-4 py-2 my-4 italic text-on-surface-variant bg-primary-fixed/10 rounded-r"
            />
          ),
          table: (props) => (
            <div className="overflow-x-auto my-6 border border-outline-variant rounded-lg">
              <table {...props} className="w-full text-sm" />
            </div>
          ),
          th: (props) => (
            <th
              {...props}
              className="text-left px-3 py-2 border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-semibold text-xs uppercase tracking-wider"
            />
          ),
          td: (props) => (
            <td
              {...props}
              className="px-3 py-2 border-b border-outline-variant/60 text-on-surface"
            />
          ),
          hr: () => <hr className="my-8 border-outline-variant" />,
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlockCopy({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden my-5">
      <div className="flex justify-between items-center px-4 py-2 border-b border-outline-variant">
        <span className="text-xs font-code-md text-on-surface-variant uppercase tracking-wider">
          {lang}
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center gap-1.5 text-xs"
          aria-label="Copier"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" strokeWidth={2} />
              Copié
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
              Copier
            </>
          )}
        </button>
      </div>
      <pre className="font-code-md text-code-md text-on-surface-variant overflow-x-auto p-4 m-0">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
}
