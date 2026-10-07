"use client";

// Lecteur Remotion de l'animation « Claude Code en action ».
// Chargé seulement quand il entre à l'écran, et remplacé par une image fixe
// si la personne a demandé de réduire les animations.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ClaudeCodeDemo } from "@/remotion/ClaudeCodeDemo";

const Player = dynamic(() => import("@remotion/player").then((m) => m.Player), { ssr: false });

export function ClaudeCodePlayer({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Chargé après l'affichage de la page (temps libre du navigateur), puis seulement s'il est visible.
    let io: IntersectionObserver | null = null;
    const start = () => {
      io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "200px" });
      io.observe(el);
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const t = window.setTimeout(() => (idle ? idle(start, { timeout: 2500 }) : start()), 1500);
    return () => {
      window.clearTimeout(t);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`aspect-[16/10] w-full pointer-events-none select-none ${className}`} aria-label="Animation : Claude Code ajoute un mode sombre à un site et lance les tests" role="img">
      {!visible && <div className="w-full h-full rounded-[18px] bg-[#2b2119] shadow-[10px_10px_0_rgb(var(--c-mark))] scale-[0.94]" />}
      {visible && (
        <Player
          component={ClaudeCodeDemo}
          durationInFrames={330}
          fps={30}
          compositionWidth={880}
          compositionHeight={550}
          style={{ width: "100%", height: "100%" }}
          autoPlay={!reduce}
          loop
          controls={false}
          initialFrame={reduce ? 300 : 0}
          acknowledgeRemotionLicense
        />
      )}
    </div>
  );
}
