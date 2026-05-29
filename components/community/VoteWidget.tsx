"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

type Value = -1 | 0 | 1;

export function VoteWidget({
  targetKind,
  targetId,
  initialScore,
  initialValue = 0,
  canVote,
  orientation = "vertical",
}: {
  targetKind: "post" | "comment";
  targetId: string;
  initialScore: number;
  initialValue?: Value;
  canVote: boolean;
  orientation?: "vertical" | "horizontal";
}) {
  const router = useRouter();
  const [score, setScore] = useState(initialScore);
  const [value, setValue] = useState<Value>(initialValue);
  const [pending, setPending] = useState(false);

  const click = async (next: 1 | -1) => {
    if (!canVote || pending) return;
    const prev = value;
    const optimistic: Value = prev === next ? 0 : next;
    const delta = optimistic - prev; // -2, -1, 0, 1, or 2
    setValue(optimistic);
    setScore((s) => s + delta);
    setPending(true);

    try {
      const res = await fetch("/api/community/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_kind: targetKind,
          target_id: targetId,
          value: next,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      // Sync to server canonical (in case of race condition or self-vote rejection)
      if (typeof data.value === "number") {
        const serverV = data.value as Value;
        if (serverV !== optimistic) {
          setValue(serverV);
          setScore((s) => s - optimistic + serverV);
        }
      }
      router.refresh();
    } catch {
      // Rollback
      setValue(prev);
      setScore((s) => s - delta);
    } finally {
      setPending(false);
    }
  };

  const wrapClass =
    orientation === "vertical"
      ? "flex flex-col items-center gap-0.5"
      : "flex items-center gap-1";
  const btnBase =
    "inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const upColor =
    value === 1
      ? "bg-primary-fixed/50 text-primary"
      : "text-on-surface-variant hover:bg-surface-container hover:text-primary";
  const downColor =
    value === -1
      ? "bg-error-container text-on-error-container"
      : "text-on-surface-variant hover:bg-surface-container hover:text-error";
  const scoreClass =
    "text-body-sm font-semibold tabular-nums " +
    (value === 1
      ? "text-primary"
      : value === -1
      ? "text-error"
      : "text-on-surface");

  return (
    <div className={wrapClass}>
      <button
        type="button"
        onClick={() => click(1)}
        disabled={!canVote || pending}
        aria-label="Upvote"
        aria-pressed={value === 1}
        className={`${btnBase} ${upColor}`}
      >
        <ChevronUp className="w-4 h-4" strokeWidth={2.25} />
      </button>
      <span className={scoreClass} aria-live="polite">
        {score}
      </span>
      <button
        type="button"
        onClick={() => click(-1)}
        disabled={!canVote || pending}
        aria-label="Downvote"
        aria-pressed={value === -1}
        className={`${btnBase} ${downColor}`}
      >
        <ChevronDown className="w-4 h-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}
