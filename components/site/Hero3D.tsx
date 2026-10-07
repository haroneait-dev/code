// Animation 3D de l'accueil, rendue avec Blender (vidéo en boucle, sans son).
// Deux versions : fond clair et fond sombre, selon le thème.
export function Hero3D({ className = "" }: { className?: string }) {
  const common = "w-full h-full object-contain";
  return (
    <div
      className={`relative aspect-square ${className}`}
      aria-hidden
      style={{ maskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)", WebkitMaskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)" }}
    >
      <video className={`${common} dark:hidden`} src="/media/hero-3d-light.mp4" poster="/media/hero-3d-light.webp" autoPlay muted loop playsInline preload="metadata" />
      <video className={`${common} hidden dark:block`} src="/media/hero-3d-dark.mp4" poster="/media/hero-3d-dark.webp" autoPlay muted loop playsInline preload="metadata" />
    </div>
  );
}
