"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { motion } from "motion/react";
import { track } from "@vercel/analytics";
import type { MiniQuestion } from "@/lib/article-quizzes";

export function ArticleQuiz({ questions, id }: { questions: MiniQuestion[]; id: string }) {
  const [picked, setPicked] = useState<(number | null)[]>(questions.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const score = picked.filter((p, i) => p === questions[i].answer).length;
  const finished = answered === questions.length;

  function pick(qi: number, oi: number) {
    if (picked[qi] !== null) return;
    const next = [...picked];
    next[qi] = oi;
    setPicked(next);
    if (next.every((p) => p !== null)) {
      track("quiz_article", { article: id, score: next.filter((p, i) => p === questions[i].answer).length });
    }
  }

  return (
    <section className="mt-16 rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 md:p-8 shadow-[5px_5px_0_rgb(var(--c-mark))]">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-headline-lg text-[24px] font-bold text-on-surface">Avez-vous bien compris ?</h2>
        <span className="font-mono text-[13px] text-on-surface-variant tabular-nums">{answered} / {questions.length}</span>
      </div>
      <ol className="flex flex-col gap-7">
        {questions.map((q, qi) => {
          const p = picked[qi];
          return (
            <li key={q.q}>
              <p className="font-semibold text-[17px] text-on-surface mb-3">{qi + 1}. {q.q}</p>
              <div className="grid gap-2">
                {q.options.map((o, oi) => {
                  const isAnswer = oi === q.answer;
                  const state = p === null ? "idle" : isAnswer ? "good" : p === oi ? "bad" : "dim";
                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={p !== null}
                      onClick={() => pick(qi, oi)}
                      className={`text-left rounded-md border px-4 py-3 text-[15.5px] flex items-center justify-between gap-3 transition-colors ${
                        state === "idle"
                          ? "border-outline-variant hover:border-on-surface bg-surface"
                          : state === "good"
                          ? "border-primary bg-[rgb(var(--c-green-soft))] text-on-surface"
                          : state === "bad"
                          ? "border-[#f2b23e] bg-[rgb(var(--c-mark))] text-on-surface"
                          : "border-outline-variant text-on-surface-variant opacity-70"
                      }`}
                    >
                      <span>{o}</span>
                      {state === "good" && <Check className="w-4 h-4 shrink-0" strokeWidth={3} />}
                      {state === "bad" && <X className="w-4 h-4 shrink-0" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
              {p !== null && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[15px] text-on-surface-variant leading-relaxed mt-2.5"
                >
                  {q.why}
                </motion.p>
              )}
            </li>
          );
        })}
      </ol>
      {finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-7 pt-5 border-t border-outline-variant flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-[17px] text-on-surface">
            {score === questions.length ? "Parfait, vous maîtrisez le sujet." : score >= 2 ? `${score} sur ${questions.length} : c'est bien acquis.` : `${score} sur ${questions.length} : relisez les passages concernés.`}
          </p>
          <button type="button" onClick={() => setPicked(questions.map(() => null))} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-on-surface-variant hover:text-on-surface">
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            Recommencer
          </button>
        </motion.div>
      )}
    </section>
  );
}
