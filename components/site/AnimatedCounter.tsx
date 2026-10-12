// Alias conservé pour les pages existantes : chiffres stables dès le rendu.
export function AnimatedCounter({ value, suffix = "", prefix = "", className = "" }: { value: number; duration?: number; suffix?: string; prefix?: string; className?: string }) {
  return <span className={className}>{prefix}{value.toLocaleString("fr-FR")}{suffix}</span>;
}
