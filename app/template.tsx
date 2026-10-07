"use client";

// Transition à chaque changement de page : la page glisse légèrement vers le haut.
// Pas de départ à opacité nulle, pour ne pas retarder l'affichage du contenu principal.
import { motion, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div initial={{ y: 14, opacity: 0.55 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
