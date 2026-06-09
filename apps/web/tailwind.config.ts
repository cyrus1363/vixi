import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "vixi-teal": "#0D7377",
        "vixi-gold": "#D4A373",
        "vixi-cream": "#FDFBF7",
        "vixi-sand": "#F5F0E8",
        "vixi-dark": "#1A1A1A",
        "vixi-stone": "#78716C",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
