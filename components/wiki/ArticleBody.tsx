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
              className="font-headline-lg text-[26px] md:text-[29px] leading-[1.2] font-bold mt-16 mb-6 pb-3 border-b border-outline-variant text-on-surface scroll-mt-24"
            />
          ),
          h3: (props) => (
            <h3
              {...props}
              className="font-headline-lg text-[21px] md:text-[22px] leading-[1.3] font-semibold mt-11 mb-4 text-on-surface scroll-mt-24"
            />
          ),
          p: (props) => (
            <p
              {...props}
              className="font-body-rt text-[17px] md:text-[18px] text-on-surface leading-[1.8] mb-6"
            />
          ),
          ul: (props) => (
            <ul {...props} className="list-disc pl-6 mb-7 space-y-3 text-[17px] md:text-[18px] text-on-surface marker:text-outline" />
          ),
          ol: (props) => (
            <ol {...props} className="list-decimal pl-6 mb-7 space-y-3 text-[17px] md:text-[18px] text-on-surface marker:text-on-surface-variant" />
          ),
          li: (props) => <li {...props} className="leading-[1.75] pl-1" />,
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
              className="border-l-[3px] border-primary-fixed-dim pl-5 pr-4 py-4 my-7 text-on-surface bg-surface-container-low rounded-r-md"
            />
          ),
          table: (props) => (
            <div className="overflow-x-auto my-8 border border-outline-variant rounded-lg">
              <table {...props} className="w-full text-[15px] leading-[1.6]" />
            </div>
          ),
          th: (props) => (
            <th
              {...props}
              className="text-left align-bottom px-4 py-3 border-b border-outline-variant bg-surface-container-low text-on-surface font-semibold text-[14px]"
            />
          ),
          td: (props) => (
            <td
              {...props}
              className="align-top px-4 py-3 border-b border-outline-variant/60 text-on-surface"
            />
          ),
          hr: () => <hr className="my-12 border-outline-variant" />,
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
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden my-7">
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
      <pre className="font-code-md text-[14px] leading-[1.7] text-on-surface overflow-x-auto px-5 py-4 m-0">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
}
