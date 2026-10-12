// Les posters existants évitent de demander les MP4 absents du dépôt.
export function Hero3D({ className = "" }: { className?: string }) {
  return <div className={`relative aspect-square ${className}`} aria-hidden="true">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="w-full h-full object-contain dark:hidden" src="/media/hero-3d-light.webp" alt="" width={600} height={600} fetchPriority="high" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="w-full h-full object-contain hidden dark:block" src="/media/hero-3d-dark.webp" alt="" width={600} height={600} />
  </div>;
}
