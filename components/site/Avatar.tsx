// Generated avatar — initials on a beige tone derived from the name
const PALETTE = [
  { bg: "#e0c29e", fg: "#281803" },
  { bg: "#d6c3b1", fg: "#241a0e" },
  { bg: "#cbc6bb", fg: "#1d1b15" },
  { bg: "#f3dfcc", fg: "#514537" },
  { bg: "#e8e2d7", fg: "#4a473f" },
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function Avatar({
  name,
  initial,
  size = 40,
}: {
  name: string;
  initial: string;
  size?: number;
}) {
  const c = PALETTE[hash(name) % PALETTE.length];
  return (
    <div
      className="rounded-full border border-outline-variant flex items-center justify-center font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: c.bg,
        color: c.fg,
        fontSize: Math.round(size * 0.4),
      }}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
