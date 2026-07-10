import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import microfrontend from "@workiva/vite-plugin-microfrontend";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

/**
 * Wdesk microfrontend build. Separate from the standalone SPA build
 * (vite.config.ts) so `pnpm dev`/`pnpm build` keep serving the plain app while
 * this produces the ESM extension the Wdesk frame loads as the "Agentic CRR"
 * tab. Entry is src/mfe/entrypoint.ts; CSS is injected via JS because an MFE
 * bundle has no host HTML to link a stylesheet from.
 */
export default defineConfig({
  base: "./",
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  build: {
    outDir: "dist-mfe",
    rollupOptions: {
      input: resolve(__dirname, "src/mfe/entrypoint.ts"),
      // Required so the entry chunk keeps its `export default` (the frame reads it).
      preserveEntrySignatures: "strict",
      output: {
        assetFileNames: "[name]-[hash][extname]",
        chunkFileNames: "[name]-[hash].js",
        entryFileNames: "[name]-[hash].js",
      },
    },
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin({ relativeCSSInjection: true }),
    microfrontend({
      app: "wdesk",
      inputManifestPath: "./manifest.yaml",
      localMicrofrontends: ["agentic_crr_mfe"],
    }),
  ],
});
