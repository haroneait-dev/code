// Polices locales (public/fonts) pour le rendu vidéo, sans dépendre d'un CDN.
import { continueRender, delayRender, staticFile } from "remotion";

const FONTS = [
  { family: "CM Display", file: "fonts/bricolage-grotesque-800.woff2", weight: "800" },
  { family: "CM Body", file: "fonts/figtree-500.woff2", weight: "500" },
  { family: "CM Body", file: "fonts/figtree-700.woff2", weight: "700" },
  { family: "CM Mono", file: "fonts/jetbrains-mono-500.woff2", weight: "500" },
];

let started = false;
export function loadLocalFonts() {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Chargement des polices");
  Promise.all(
    FONTS.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, { weight: f.weight });
      return face.load().then((loaded) => document.fonts.add(loaded));
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}

export const display = "'CM Display', sans-serif";
export const body = "'CM Body', sans-serif";
export const mono = "'CM Mono', monospace";
