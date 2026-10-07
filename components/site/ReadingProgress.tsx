"use client";

// Barre de lecture fine sous l'en-tête des articles.
import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden className="fixed left-0 right-0 top-16 h-[3px] bg-primary-fixed-dim origin-left z-40" style={{ scaleX }} />;
}
