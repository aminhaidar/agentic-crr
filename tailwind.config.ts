import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * shadcn/ui theme, wired to the *exact* design tokens from the source
 * prototype (defined in src/styles/prototype.css :root). shadcn primitives
 * therefore inherit the prototype's navy/neutral palette, radii, and shadows
 * so they render pixel-identical to the hand-authored HTML.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border-2)",
        input: "var(--border-2)",
        ring: "var(--accent)",
        background: "var(--surface)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--surface-3)",
          foreground: "var(--text)",
        },
        muted: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-3)",
        },
        accent: {
          DEFAULT: "var(--accent-weak)",
          foreground: "var(--accent)",
        },
        destructive: {
          DEFAULT: "var(--danger)",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
      },
      borderRadius: {
        lg: "var(--r-lg)",
        md: "var(--r-md)",
        sm: "var(--r-sm)",
      },
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pop: "var(--shadow-3)",
        soft: "var(--shadow-2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
