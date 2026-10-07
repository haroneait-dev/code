// Petit objet 3D (rendu Blender) qui flotte en haut de chaque grande partie.
export function Section3D({ name, className = "" }: { name: "claude" | "claude-code" | "applications" | "prompts"; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/media/sections/${name}.webp`} alt="" aria-hidden width={320} height={260} decoding="async" className={`cm-float h-auto shrink-0 select-none pointer-events-none ${className}`} />
  );
}
