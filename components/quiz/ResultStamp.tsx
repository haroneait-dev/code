"use client";

import { motion, useReducedMotion } from "motion/react";

// Tampon « niveau » qui s'imprime sur la page du résultat, après la jauge.
export function ResultStamp({ level, className = "" }: { level: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-full bg-primary text-on-primary border-[6px] border-[rgb(var(--c-mark))] flex flex-col items-center justify-center text-center shadow-[4px_4px_0_rgb(var(--c-on-surface)/0.15)] ${className}`}
      initial={reduce ? { opacity: 0, rotate: -8 } : { opacity: 0, scale: 2.4, rotate: -24 }}
      animate={{ opacity: 1, scale: 1, rotate: -8 }}
      transition={reduce ? { duration: 0.2, delay: 0.3 } : { delay: 1.15, type: "spring", stiffness: 420, damping: 16, mass: 0.9 }}
    >
      <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-wider opacity-80">Niveau</span>
      <span className="font-display-xl font-extrabold text-[17px] md:text-[21px] leading-tight px-2">{level}</span>
      <span className="text-[18px] md:text-[22px] leading-none mt-1">✓</span>
    </motion.div>
  );
}
