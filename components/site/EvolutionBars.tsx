"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Bar } from "@/lib/evolution";

// Barres horizontales qui se remplissent quand elles entrent à l'écran.
export function EvolutionBars({ bars, max, color = "primary" }: { bars: Bar[]; max: number; color?: "primary" | "mark" }) {
  const reduce = useReducedMotion();
  return (
    <ul className="flex flex-col gap-4">
      {bars.map((b, i) => (
        <li key={b.label}>
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <span className="text-[15px] text-on-surface">{b.label}</span>
            <span className="font-mono text-[14px] font-semibold text-on-surface tabular-nums">{b.display}</span>
          </div>
          <div className="h-4 rounded-full bg-surface-container-high overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${color === "primary" ? "bg-primary" : "bg-primary-fixed-dim"}`}
              initial={{ width: reduce ? `${(b.value / max) * 100}%` : "0%" }}
              whileInView={{ width: `${(b.value / max) * 100}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {b.note && <p className="text-[13.5px] text-on-surface-variant mt-1">{b.note}</p>}
        </li>
      ))}
    </ul>
  );
}
