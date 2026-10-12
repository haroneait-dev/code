"use client";

import { motion, useReducedMotion } from "motion/react";

// Tampon « niveau » qui s'imprime sur la page du résultat, après la jauge.
export function ResultStamp({ level, className = "" }: { level: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`w-28 h-28 md:w-36 md:h-36 shrink-0 rounded bg-primary text-on-primary border-[6px] border-[rgb(var(--c-mark))] flex flex-col items-center justify-center text-center  ${className}`}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <span className="font-mono text-small md:text-small uppercase tracking-wider opacity-80">Niveau</span>
      <span className="font-display-xl font-extrabold text-body md:text-h3 leading-tight px-2">{level}</span>
      <span className="text-body md:text-h3 leading-none mt-1">✓</span>
    </motion.div>
  );
}
