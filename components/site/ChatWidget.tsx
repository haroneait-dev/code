"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, X, Send, ArrowRight } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Salut 👋 Je suis l'assistant de **Claude Mastery**. Dis-moi ce que tu cherches — une leçon, une notion, le wiki — et je te redirige direct au bon endroit.",
};

export function ChatWidget() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    // On ajoute le message user + une bulle assistant vide à remplir en streaming
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const { data } = await getSupabase().auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Session expirée — reconnecte-toi.");

      // Anthropic exige que la conversation commence par un message "user"
      const convo = [...messages, userMsg];
      const firstUser = convo.findIndex((m) => m.role === "user");
      const payload = firstUser === -1 ? convo : convo.slice(firstUser);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok || !res.body) {
        throw new Error(
          res.status === 401
            ? "Connecte-toi pour discuter avec l'assistant."
            : "Une erreur est survenue. Réessaie dans un instant."
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Désolé, une erreur s'est produite.";
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: `_${msg}_` };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-7.5rem))] bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-lg flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                <Sparkles className="w-4 h-4" strokeWidth={1.75} />
              </span>
              <div className="leading-tight">
                <div className="text-body-sm font-semibold text-on-surface">
                  Assistant
                </div>
                <div className="text-xs text-on-surface-variant">
                  Claude Mastery
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Fermer l'assistant"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          {session ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-surface flex flex-col gap-3">
                {messages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  const isLast = i === messages.length - 1;
                  const isTyping = streaming && isLast && !isUser && !msg.content;
                  return (
                    <div
                      key={i}
                      className={`max-w-[85%] ${isUser ? "ml-auto" : "mr-auto"}`}
                    >
                      <div
                        className={`px-3 py-2 rounded-2xl text-body-sm ${
                          isUser
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-surface-container-lowest border border-outline-variant text-on-surface rounded-bl-sm"
                        }`}
                      >
                        {isTyping ? (
                          <span className="text-on-surface-variant">
                            L'assistant écrit…
                          </span>
                        ) : isUser ? (
                          msg.content
                        ) : (
                          <ChatMarkdown
                            content={msg.content}
                            onNavigate={() => setOpen(false)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Composer */}
              <div className="p-3 border-t border-outline-variant bg-surface-container-lowest flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Pose ta question…"
                  className="flex-1 bg-surface border border-outline-variant rounded-full px-4 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={streaming || !input.trim()}
                  className="flex items-center justify-center w-10 h-10 rounded-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Envoyer"
                >
                  <Send className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </>
          ) : (
            /* État non connecté */
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center bg-surface">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-fixed/40 text-primary">
                <Sparkles className="w-6 h-6" strokeWidth={1.5} />
              </span>
              <div className="text-body-sm font-semibold text-on-surface">
                Connexion requise
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Connecte-toi pour discuter avec l'assistant et te faire guider
                dans la formation.
              </p>
              <Link
                href="?login=1"
                onClick={() => setOpen(false)}
                className="btn-primary px-5 h-9 inline-flex items-center justify-center gap-1 rounded-full text-body-sm font-medium mt-1"
              >
                Se connecter
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-14 h-14 rounded-full btn-primary shadow-lg transition-transform hover:scale-105"
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {open ? (
          <X className="w-6 h-6" strokeWidth={1.75} />
        ) : (
          <Sparkles className="w-6 h-6" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}

/** Markdown compact pour les bulles de chat, avec liens internes cliquables. */
function ChatMarkdown({
  content,
  onNavigate,
}: {
  content: string;
  onNavigate: () => void;
}) {
  const router = useRouter();
  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: (props) => <p {...props} className="mb-2 last:mb-0 leading-relaxed" />,
          a: ({ href, children }) => {
            if (href && href.startsWith("/")) {
              return (
                <Link
                  href={href}
                  onClick={() => {
                    onNavigate();
                    router.push(href);
                  }}
                  className="text-primary font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                {children}
              </a>
            );
          },
          ul: (props) => (
            <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />
          ),
          ol: (props) => (
            <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />
          ),
          li: (props) => <li {...props} className="leading-relaxed" />,
          strong: (props) => (
            <strong {...props} className="font-semibold text-on-surface" />
          ),
          code: ({ children }) => (
            <code className="font-code-md text-[0.85em] text-primary bg-primary-fixed/30 px-1 py-0.5 rounded">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
