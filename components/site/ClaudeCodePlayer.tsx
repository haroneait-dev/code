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
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`aspect-[16/10] w-full pointer-events-none select-none ${className}`} aria-label="Animation : Claude Code ajoute un mode sombre à un site et lance les tests" role="img">
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
