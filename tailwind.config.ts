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
        cream: "#faf7f4",
        bark: "#3d2b1f",
        clay: "#c4785a",
        moss: "#7ab868",
        muted: "#a08070",
        petal: "#f5f0eb",
        border: "#e0d4c8",
      },
      fontFamily: {
        serif: ["Georgia", "ui-serif", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
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
      },
      animation: {
        sway: "sway 7s ease-in-out infinite",
        shimmer: "shimmer 8s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
