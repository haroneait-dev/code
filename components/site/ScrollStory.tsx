"use client";

import { useEffect, useRef, useState } from "react";

// Section « scroll stop » de l'accueil : la scène reste fixée à l'écran
// pendant que l'on fait défiler ; le logo 3D (48 images rendues avec Blender,
// réunies dans une planche 8 × 6) tourne au rythme du défilement et les
// étapes s'enchaînent. Avec « réduire les animations », tout est affiché à plat.

const COLS = 8;
const ROWS = 6;
const FRAMES = COLS * ROWS;

const STEPS = [
  { k: "01", title: "Vous demandez", text: "En français, comme à un collègue : « ajoute un mode sombre et vérifie les tests »." },
  { k: "02", title: "Il lit le projet", text: "Claude Code ouvre les fichiers utiles, comprend l'architecture et vos conventions." },
  { k: "03", title: "Il modifie le code", text: "Plusieurs fichiers à la fois, en vous montrant chaque changement avant de l'appliquer." },
  { k: "04", title: "Il vérifie", text: "Il lance les tests, lit les erreurs et corrige jusqu'à ce que tout passe." },
];

export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [flat, setFlat] = useState(false);
  const [near, setNear] = useState(false);

  // La planche d'images ne se charge qu'à l'approche de la section.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [flat]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFlat(true);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / total)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (flat) {
    return (
      <section className="py-section w-full px-margin-mobile md:px-margin-desktop ">
        <div className="max-w-container-max mx-auto grid gap-6 md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.k}>
              <p className="font-mono text-small text-on-surface-variant mb-2">{s.k}</p>
              <h3 className="text-h3 font-headline-lg  font-extrabold mb-2">{s.title}</h3>
              <p className="text-on-surface-variant">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const frame = Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1)));
  const col = frame % COLS;
  const row = Math.floor(frame / COLS);
  const step = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));

  return (
    <section ref={ref} className="py-section relative h-[240vh] bg-surface-container-low text-on-surface" aria-label="Comment travaille Claude Code">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-16 px-margin-mobile md:px-margin-desktop">


        <div
          aria-hidden
          className="relative w-[62vw] max-w-[300px] lg:max-w-[440px] aspect-square shrink-0 rounded overflow-hidden bg-surface-container-lowest"
          style={{ transform: `scale(${0.95 + p * 0.05})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: near ? "url(/media/scroll-3d.webp)" : undefined,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="relative w-full max-w-md">
          <p className="font-mono text-small uppercase tracking-wider opacity-80 mb-3">Comment travaille Claude Code</p>
          <div className="relative h-[150px] md:h-[170px]">
            {STEPS.map((s, i) => (
              <div
                key={s.k}
                className="absolute inset-0 transition-all duration-200 ease-out"
                style={{ opacity: i === step ? 1 : 0, transform: `translateY(${(i - step) * 26}px)` }}
                aria-hidden={i !== step}
              >
                <h3 className="text-h3 font-headline-lg   leading-[1.02] font-extrabold mb-3">
                  <span className="text-primary">{s.k}</span> {s.title}
                </h3>
                <p className="text-body md:text-body leading-relaxed opacity-90">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {STEPS.map((s, i) => (
              <span key={s.k} className="h-1.5 flex-1 rounded bg-outline-variant overflow-hidden">
                <span
                  className="block h-full bg-primary"
                  style={{ width: `${Math.min(1, Math.max(0, p * STEPS.length - i)) * 100}%` }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
