"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    if (node.getBoundingClientRect().top > window.innerHeight) setVisible(false);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const TagAny = Tag as React.ElementType;
  return (
    <TagAny
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.4s ease-out ${Math.min(delay, 100)}ms, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(delay, 100)}ms`,
      }}
      className={className}
    >
      {children}
    </TagAny>
  );
}
