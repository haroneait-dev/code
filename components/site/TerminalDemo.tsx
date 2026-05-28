"use client";

import { useEffect, useState } from "react";

type Step =
  | { kind: "prompt"; text: string }
  | { kind: "claude"; lines: string[] }
  | { kind: "tool"; name: string; arg: string }
  | { kind: "pause"; ms: number };

const SCRIPT: Step[] = [
  { kind: "prompt", text: "Refactor app/api/users/route.ts pour utiliser zod" },
  { kind: "pause", ms: 400 },
  { kind: "tool", name: "Read", arg: "app/api/users/route.ts" },
  { kind: "tool", name: "Edit", arg: "+ import { z } from 'zod'" },
  { kind: "tool", name: "Bash", arg: "npx tsc --noEmit" },
  { kind: "claude", lines: ["✓ Schema zod ajouté", "✓ Validation au runtime", "✓ Types inférés"] },
  { kind: "pause", ms: 1200 },
];

export function TerminalDemo() {
  const [shown, setShown] = useState<Step[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    let cancelled = false;
    let idx = 0;
    const run = async () => {
      while (!cancelled) {
        const step = SCRIPT[idx % SCRIPT.length];
        if (step.kind === "prompt") {
          for (let i = 0; i <= step.text.length; i++) {
            if (cancelled) return;
            setTyping(step.text.slice(0, i));
            await wait(28);
          }
          await wait(300);
          setShown((s) => [...s, step]);
          setTyping("");
        } else if (step.kind === "pause") {
          await wait(step.ms);
        } else {
          setShown((s) => [...s, step]);
          await wait(step.kind === "claude" ? 900 : 420);
        }
        idx++;
        if (idx >= SCRIPT.length) {
          await wait(2200);
          if (!cancelled) {
            setShown([]);
            idx = 0;
          }
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="rounded-2xl bg-[#1a1c1c] border border-outline-variant overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#241a0e]/60 border-b border-white/5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs font-mono text-white/40">
            ~/projet — claude
          </span>
        </div>
        <div className="p-5 font-mono text-[13px] leading-relaxed text-white/85 min-h-[280px]">
          <div className="text-emerald-400/80">$ claude</div>
          <div className="text-white/50 mb-3">
            Connecté — claude-sonnet-4-6 · 200K tokens
          </div>
          {shown.map((step, i) => (
            <Line key={i} step={step} />
          ))}
          {typing !== "" && (
            <div>
              <span className="text-amber-300/90">{">"} </span>
              <span>{typing}</span>
              <Caret />
            </div>
          )}
          {typing === "" &&
            (shown.length === 0 ||
              shown[shown.length - 1].kind !== "prompt") && (
              <div>
                <span className="text-amber-300/90">{">"} </span>
                <Caret />
              </div>
            )}
        </div>
      </div>
      <div className="absolute -z-10 inset-0 blur-3xl opacity-50 bg-[radial-gradient(circle_at_30%_20%,#e0c29e,transparent_60%),radial-gradient(circle_at_70%_80%,#a37b5a,transparent_55%)]" />
    </div>
  );
}

function Line({ step }: { step: Step }) {
  if (step.kind === "prompt") {
    return (
      <div className="mb-2">
        <span className="text-amber-300/90">{">"} </span>
        <span>{step.text}</span>
      </div>
    );
  }
  if (step.kind === "tool") {
    return (
      <div className="mb-1 text-white/60">
        <span className="text-cyan-300/80">↳ {step.name}</span>{" "}
        <span className="text-white/45">({step.arg})</span>
      </div>
    );
  }
  if (step.kind === "claude") {
    return (
      <div className="mb-2 mt-1">
        {step.lines.map((l, i) => (
          <div key={i} className="text-emerald-300/90">
            {l}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function Caret() {
  return (
    <span className="inline-block w-2 h-[1.05em] align-[-2px] ml-[1px] bg-white/80 animate-caret" />
  );
}

function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}
