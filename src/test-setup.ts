// jsdom doesn't implement matchMedia, which MUI/Unify's CssVarsProvider (used by
// UnifyThemeProvider) calls on mount. Polyfill it so Unify-based components can
// render in tests. Applied via vite.config.ts `test.setupFiles`.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
