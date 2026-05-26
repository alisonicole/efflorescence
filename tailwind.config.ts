import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5EFE4",
        "cream-deep": "#EDE3D4",
        bark: "#3D2B1F",
        "bark-mid": "#6B4F3A",
        soil: "#8B6347",
        moss: "#4A6741",
        sage: "#7A9E6E",
        "sage-light": "#B8CDB0",
        clay: "#C97A6E",
        petal: "#EDE3D4",
        blush: "#DBA898",
        gold: "#B8935A",
        "gold-light": "#D4B47A",
        muted: "#8B6347",
        border: "#DDD4C4",
        charcoal: "#1E1A17",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
        serif: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        app: "430px",
      },
      borderRadius: {
        card: "14px",
        pill: "100px",
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-1deg) translateX(-1px)" },
          "50%": { transform: "rotate(1deg) translateX(1px)" },
        },
        shimmer: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.05)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "float-petal": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.6",
          },
          "50%": { transform: "translateY(-18px) rotate(4deg)", opacity: "1" },
        },
        "slide-down": {
          "0%": { top: "-100%" },
          "100%": { top: "100%" },
        },
      },
      animation: {
        sway: "sway 7s ease-in-out infinite",
        shimmer: "shimmer 8s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "float-petal": "float-petal 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
