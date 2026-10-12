"use client";

// Petites animations inspirées des composants 21st.dev (blur fade, révélation
// mot à mot, barre de progression), réécrites avec Motion pour coller à la
// direction « Atelier » : pas de halo, pas de dégradé, mouvements courts.
// Toutes respectent « réduire les animations » du système.

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export function BlurFade({
  children,
  delay = 0,
  y = 10,
  inView = false,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  inView?: boolean;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();
  const hidden = reduce ? { opacity: 1 } : { opacity: 0, y };
  const shown = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(inView
        ? { whileInView: shown, viewport: { once: true, margin: "-60px" } }
        : { animate: shown })}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Révèle un texte mot par mot.
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: "0.35em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : Math.min(0.15, delay + i * stagger), ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

// Barre de progression segmentée : un segment par question.
export function StepProgress({ current, total }: { current: number; total: number }) {
  const reduce = useReducedMotion();
  return (
    <div aria-label="Progression" className="flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-2 flex-1 rounded-full bg-surface-container-high overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: i < current ? "100%" : "0%" }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

// Jauge qui se remplit jusqu'à une valeur (0 à 1).
export function Meter({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const percentage = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div role="progressbar" aria-label="Progression" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} className={`h-3 rounded-full bg-surface-container-high overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
