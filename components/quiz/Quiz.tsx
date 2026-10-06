"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { BlurFade, Meter, StepProgress, WordReveal } from "@/components/ui/motion";
import {
  QUESTIONS,
  MAX_SCORE,
  computeResult,
  readingsFor,
  saveResult,
  loadResult,
  type QuizResult,
} from "@/lib/quiz";
import { THEMES } from "@/lib/applications";
import { PATHS } from "@/lib/app-paths";
import { ShareResult } from "@/components/quiz/ShareResult";
import { track } from "@vercel/analytics";

type Stage = "intro" | "questions" | "result";

export function Quiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [previous, setPrevious] = useState<QuizResult | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => setPrevious(loadResult()), []);

  const total = QUESTIONS.length;
  const q = QUESTIONS[index];

  function choose(value: string) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    window.setTimeout(() => {
      if (index < total - 1) {
        setIndex(index + 1);
      } else {
        const r = computeResult(next);
        saveResult(r);
        track("test_termine", { niveau: r.level, theme: r.theme });
        setResult(r);
        setStage("result");
        window.scrollTo({ top: 0 });
      }
    }, 220);
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setStage("questions");
  }

  if (stage === "intro") {
    return (
      <div className="max-w-2xl mx-auto">
        <BlurFade>
          <p className="tag-note mb-7">10 questions · 2 minutes · sans inscription</p>
        </BlurFade>
        <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[60px] md:leading-[1] mb-6">
          <WordReveal text="Par où commencer ?" />
        </h1>
        <BlurFade delay={0.25}>
          <p className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed mb-8">
            Répondez à 10 questions. Vous obtenez votre niveau actuel et un
            parcours sur mesure : quoi lire, quoi pratiquer, et quel projet
            réaliser pour passer au niveau suivant.
          </p>
        </BlurFade>
        <BlurFade delay={0.4} className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              track("test_commence");
              setStage("questions");
            }}
            className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[16px] group"
          >
            Commencer le test
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </button>
          {previous ? (
            <button
              type="button"
              onClick={() => {
                setResult(previous);
                setStage("result");
              }}
              className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center font-semibold text-[15px]"
            >
              Revoir mon parcours ({previous.level})
            </button>
          ) : (
            <Link href="/" className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center font-semibold text-[15px]">
              Explorer librement
            </Link>
          )}
        </BlurFade>
        <BlurFade delay={0.55}>
          <p className="text-[14px] text-on-surface-variant mt-6">
            Vos réponses restent dans votre navigateur. Rien n'est envoyé.
          </p>
        </BlurFade>
      </div>
    );
  }

  if (stage === "questions") {
    const chosen = answers[q.id];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[14px] text-on-surface tabular-nums">
              Question <strong>{index + 1}</strong> sur {total}
            </span>
            <span className="font-mono text-[13px] text-on-surface-variant">
              {q.kind === "profil" ? "Votre profil" : "Vos connaissances"}
            </span>
          </div>
          <StepProgress current={index + (chosen ? 1 : 0)} total={total} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-headline-lg text-[26px] md:text-[34px] leading-[1.2] font-bold text-on-surface mb-3">
              {q.question}
            </h2>
            {q.hint && <p className="text-[16px] text-on-surface-variant mb-6">{q.hint}</p>}
            <ul className={`grid gap-3 ${q.hint ? "" : "mt-6"} ${q.options.length > 4 ? "sm:grid-cols-2" : ""}`}>
              {q.options.map((o, i) => {
                const active = chosen === o.value;
                return (
                  <motion.li
                    key={o.value}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
                  >
                    <button
                      type="button"
                      onClick={() => choose(o.value)}
                      className={`w-full text-left rounded-lg border-[1.5px] px-5 py-4 text-[16px] leading-relaxed transition-all ${
                        active
                          ? "border-primary bg-[rgb(var(--c-green-soft))] text-on-surface shadow-[4px_4px_0_rgb(var(--c-primary))]"
                          : "border-on-surface/70 bg-surface-container-lowest text-on-surface hover:border-on-surface hover:shadow-[4px_4px_0_rgb(var(--c-mark))] hover:-translate-y-0.5"
                      }`}
                    >
                      {o.label}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (index === 0 ? setStage("intro") : setIndex(index - 1))}
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-on-surface-variant hover:text-on-surface"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Retour
          </button>
          <Link href="/" className="text-[14px] text-on-surface-variant hover:text-on-surface underline-offset-4 hover:underline">
            Passer le test
          </Link>
        </div>
      </div>
    );
  }

  // Résultat
  const r = result!;
  const theme = THEMES.find((t) => t.id === r.theme);
  const plan = PATHS[r.theme]?.[r.levelIndex];
  const nextLevel = PATHS[r.theme]?.[r.levelIndex + 1];
  const readings = readingsFor(r);
  const knowledge = QUESTIONS.filter((x) => x.kind === "savoir");
  const hasAnswers = Object.keys(answers).length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <BlurFade>
        <p className="tag-note mb-6">Votre résultat</p>
      </BlurFade>
      <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[38px] leading-[1.05] md:text-[56px] md:leading-[1] mb-5">
        <WordReveal text={"Votre niveau\u00a0:"} />{" "}
        <BlurFade delay={0.3} className="inline-block">
          <span className="text-mark">{r.level}</span>
        </BlurFade>
      </h1>
      <BlurFade delay={0.35}>
        <div className="max-w-md mb-3">
          <Meter value={r.score / MAX_SCORE} />
        </div>
        <p className="font-mono text-[14px] text-on-surface-variant mb-5 tabular-nums">
          {r.score} points sur {MAX_SCORE} · thème : {theme?.name} · partie conseillée : {r.code ? "Claude Code" : "Claude"}
        </p>
        <div className="mb-10">
          <ShareResult levelIndex={r.levelIndex} level={r.level} theme={r.theme} />
        </div>
      </BlurFade>

      {plan && (
        <BlurFade delay={0.45} className="rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest p-6 md:p-8 shadow-[6px_6px_0_rgb(var(--c-mark))] mb-12">
          <h2 className="font-headline-lg text-[24px] md:text-[30px] font-bold mb-2">Votre plan pour les prochains jours</h2>
          <p className="text-[17px] text-on-surface font-semibold leading-relaxed mb-5">{plan.goal}</p>
          <ol className="flex flex-col gap-4 mb-6">
            {plan.steps.map((s, i) => (
              <li key={s} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <span className="font-display-xl text-[24px] leading-none font-extrabold text-primary-fixed-dim tabular-nums pt-0.5">{i + 1}</span>
                <span className="text-[16px] text-on-surface leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
          <p className="rounded-md bg-[rgb(var(--c-mark)/0.50)] border border-[#f2b23e]/40 px-4 py-3 text-[15.5px] text-on-surface leading-relaxed mb-5">
            <strong>Projet pour valider ce niveau :</strong> {plan.project}
          </p>
          {nextLevel && (
            <p className="text-[15px] text-on-surface-variant mb-5">
              Ensuite, niveau {nextLevel.level} : {nextLevel.goal.charAt(0).toLowerCase() + nextLevel.goal.slice(1)}
            </p>
          )}
          <Link
            href={`/applications#${r.theme}`}
            className="btn-primary h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] group"
          >
            Voir le parcours complet et les applications
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </Link>
        </BlurFade>
      )}

      <BlurFade inView className="mb-12">
        <h2 className="font-headline-lg text-[24px] md:text-[28px] font-bold mb-5">À lire en premier</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {readings.map((a, i) => (
            <BlurFade key={a.href} inView delay={i * 0.06}>
              <Link href={a.href} className="group block h-full rounded-lg border border-outline-variant bg-surface-container-lowest p-5 soft-lift">
                <span className="block font-semibold text-[17px] text-on-surface group-hover:text-primary transition-colors mb-1">{a.title}</span>
                <span className="block text-[15px] text-on-surface-variant leading-relaxed">{a.why}</span>
              </Link>
            </BlurFade>
          ))}
        </ul>
      </BlurFade>

      {hasAnswers && (
        <BlurFade inView className="mb-12">
          <h2 className="font-headline-lg text-[24px] md:text-[28px] font-bold mb-2">Vos réponses, corrigées</h2>
          <p className="text-[15.5px] text-on-surface-variant mb-5">Chaque correction renvoie vers l'article qui l'explique.</p>
          <ul className="flex flex-col gap-3">
            {knowledge.map((k) => {
              const opt = k.options.find((o) => o.value === answers[k.id]);
              const ok = (opt?.points ?? 0) > 0;
              const good = k.options.find((o) => (o.points ?? 0) > 0);
              return (
                <li key={k.id} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5">
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-full ${ok ? "bg-primary text-on-primary" : "bg-[#f2b23e] text-[#2b2119]"}`}>
                      {ok ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <X className="w-3.5 h-3.5" strokeWidth={3} />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-[16px] text-on-surface mb-1">{k.question}</p>
                      {!ok && good && <p className="text-[15px] text-on-surface mb-1">Bonne réponse : {good.label}</p>}
                      <p className="text-[15px] text-on-surface-variant leading-relaxed">
                        {k.explain}{" "}
                        {k.href && (
                          <Link href={k.href} className="text-primary font-semibold hover:underline underline-offset-4">
                            En savoir plus
                          </Link>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </BlurFade>
      )}

      <BlurFade inView className="flex flex-col sm:flex-row gap-3 border-t border-outline-variant pt-8">
        <Link href={r.code ? "/claude-code" : "/claude"} className="btn-secondary h-12 px-6 rounded-md inline-flex items-center justify-center font-semibold text-[15px]">
          Aller à la partie {r.code ? "Claude Code" : "Claude"}
        </Link>
        <button type="button" onClick={restart} className="h-12 px-6 rounded-md inline-flex items-center justify-center gap-2 font-semibold text-[15px] text-on-surface-variant hover:text-on-surface">
          <RotateCcw className="w-4 h-4" strokeWidth={2} />
          Refaire le test
        </button>
      </BlurFade>
    </div>
  );
}
