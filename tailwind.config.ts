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
        gold: "#D4AF37",
        "gold-light": "#FDE047",
        "gold-dark": "#B48A18",
        "dark-green": "#064E3B",
        "dark-green-deep": "#022C22",
        "dark-green-light": "#059669",
        "emerald-dark": "#064E3B",
        "slate-dark": "#022C22",
        "slate-card": "#064E3B",
        "slate-border": "#065F46",
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        ticket: "0 10px 25px -5px #022C2266, 0 8px 10px -6px #022C224D",
        "ticket-hover": "0 20px 35px -5px #022C2280, 0 10px 15px -5px #D4AF3733",
        glow: "0 0 25px #D4AF3759",
      },
    },
  },
  plugins: [],
};

export default config;
