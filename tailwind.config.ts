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
        gold: "#E5A93C",
        "gold-light": "#FCD34D",
        "slate-dark": "#0F172A",
        "slate-card": "#1E293B",
        "slate-border": "#334155",
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        ticket: "0 10px 25px -5px #00000066, 0 8px 10px -6px #0000004D",
        "ticket-hover": "0 20px 35px -5px #00000080, 0 10px 15px -5px #E5A93C33",
        glow: "0 0 25px #E5A93C59",
      },
    },
  },
  plugins: [],
};

export default config;
