// Global stylesheets for the app, in load order. Imported by BOTH entrypoints —
// the standalone `main.tsx` and the Wdesk microfrontend `experience.tsx` — so
// the two surfaces get identical styling. prototype.css is loaded last so the
// prototype's design system wins over Tailwind's preflight.
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "./index.css";
import "./styles/tokens.css";
import "./styles/prototype.css";
