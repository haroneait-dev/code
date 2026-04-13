import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7c3aed",
          orange: "#f97316",
          dark: "#0a0a0f",
          surface: "#111118",
          card: "#16161f",
          border: "#2a2a3a",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
