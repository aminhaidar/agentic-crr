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

        /* Operator home (v0 / Unify-derived). Values live on `.ophome`
           (src/styles/operator-home.css); scoped there so they never touch
           the light app views. Channel-based entries support /alpha. */
        "oh-brand": "rgb(var(--oh-brand-rgb) / <alpha-value>)",
        "oh-brand-strong": "var(--oh-brand-strong)",
        "oh-brand-deep": "var(--oh-brand-deep)",
        "oh-brand-fg": "var(--oh-brand-fg)",
        "oh-fg": "var(--oh-fg)",
        "oh-fg-muted": "var(--oh-fg-muted)",
        "oh-surface": "var(--oh-surface)",
        "oh-surface-raised": "var(--oh-surface-raised)",
        "oh-hairline": "var(--oh-hairline)",
        "oh-border": "var(--oh-border)",
        "oh-popover": "var(--oh-popover)",
        "oh-ring": "var(--oh-ring)",
        "oh-review": "rgb(var(--oh-review-rgb) / <alpha-value>)",
        "oh-review-fg": "var(--oh-review-fg)",
        "oh-waiting": "rgb(var(--oh-waiting-rgb) / <alpha-value>)",
        "oh-waiting-fg": "var(--oh-waiting-fg)",
        "oh-active": "rgb(var(--oh-active-rgb) / <alpha-value>)",
        "oh-active-fg": "var(--oh-active-fg)",
        "oh-filed": "rgb(var(--oh-filed-rgb) / <alpha-value>)",
        "oh-filed-fg": "var(--oh-filed-fg)",
      },
      borderRadius: {
        lg: "var(--r-lg)",
        md: "var(--r-md)",
        sm: "var(--r-sm)",
      },
      fontFamily: {
        sans: ["AdelleSans", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
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
