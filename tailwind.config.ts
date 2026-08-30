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
        night: "#0F1229",
        "night-2": "#171B3A",
        paper: "#FFF8E7",
        ink: "#1A1A2E",
        gold: "#E8B33D",
        "gold-light": "#F7D173",
        crimson: "#C1352E",
        "crimson-dark": "#99221C",
        slate: "#8286A3",
        "slate-light": "#B0B4CE",
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        ticket: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
        "ticket-hover": "0 20px 35px -5px rgba(0, 0, 0, 0.5), 0 10px 15px -5px rgba(232, 179, 61, 0.2)",
        glow: "0 0 25px rgba(232, 179, 61, 0.35)",
        "crimson-glow": "0 0 20px rgba(193, 53, 46, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
