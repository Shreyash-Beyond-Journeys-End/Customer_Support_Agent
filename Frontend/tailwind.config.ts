import type { Config } from "tailwindcss";

// Colors are CSS-variable backed so light + dark both resolve from the same
// token names (see globals.css). rgb(var(--x) / <alpha-value>) keeps Tailwind
// opacity utilities (bg-accent/10, border-pending/25, …) working.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: v("--canvas"),
        surface: v("--surface"),
        "surface-2": v("--surface-2"),
        border: v("--border"),
        muted: v("--muted"),
        ink: v("--ink"),
        accent: {
          DEFAULT: v("--accent"),
          soft: v("--accent-soft"),
        },
        pending: v("--pending"),
        success: v("--success"),
        danger: v("--danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(16 24 40 / 0.04), 0 6px 16px rgb(16 24 40 / 0.06)",
        "soft-lg": "0 4px 12px rgb(16 24 40 / 0.06), 0 16px 40px rgb(16 24 40 / 0.08)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "70%": { transform: "scale(1.7)", opacity: "0" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
