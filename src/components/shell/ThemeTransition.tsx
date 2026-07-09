import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

/**
 * Subtle dark<->light transition for the Operator shell.
 *
 * The shell has two visual worlds: the dark "launch stage" (Operator Home,
 * `body.op-home`) and the light work surfaces (reports, dashboard, sources).
 * Navigation is imperative — everything flows through `window.go(view)` — and
 * the theme swap is otherwise an instant, jarring hard-cut.
 *
 * This is a gentle crossfade rather than a bold wipe: when a navigation crosses
 * the dark/light boundary, `App`/the engine hands us the deferred swap. We fade
 * a full-screen veil (in the destination theme's color) in just enough to mask
 * the swap, run it underneath, then fade the veil back out over the freshly
 * themed page. The result reads as a soft dissolve between the two themes.
 *
 * The swap is bridged through `window` (same pattern as the New Report modal)
 * so the imperative engine and React stay decoupled.
 */

const EASE = [0.4, 0, 0.2, 1] as const;
const COVER_MS = 0.2;
const REVEAL_MS = 0.28;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function ThemeTransition() {
  const [active, setActive] = useState(false);
  const [toDark, setToDark] = useState(false);
  const controls = useAnimationControls();
  const running = useRef(false);

  useEffect(() => {
    // Never let the animation wedge navigation: race every awaited step against
    // a timeout, and guarantee the swap (`run`) fires exactly once. If the
    // rAF-driven animation stalls (backgrounded tab, throttling), we degrade to
    // an instant swap instead of hanging.
    const withTimeout = (p: Promise<unknown>, ms: number) =>
      Promise.race([p, new Promise((r) => setTimeout(r, ms))]);

    window.__opThemeTransition = ({ toDark, run }) => {
      // Reduced motion, or an in-flight transition: swap instantly.
      if (prefersReducedMotion() || running.current) {
        run();
        return;
      }
      running.current = true;

      let ran = false;
      const doRun = () => {
        if (!ran) {
          ran = true;
          run();
        }
      };

      setToDark(toDark);
      setActive(true);

      void (async () => {
        try {
          // Fade the veil in just enough to mask the swap.
          await withTimeout(
            controls.start({ opacity: 1, transition: { duration: COVER_MS, ease: EASE } }),
            COVER_MS * 1000 + 250,
          );
          // Covered — swap the view + theme class behind the veil.
          doRun();
          // Let the browser paint the new theme before we reveal it.
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
          // Fade the veil back out over the freshly themed page.
          await withTimeout(
            controls.start({ opacity: 0, transition: { duration: REVEAL_MS, ease: EASE } }),
            REVEAL_MS * 1000 + 300,
          );
        } catch {
          /* fall through to cleanup */
        } finally {
          doRun(); // safety — never skip the navigation
          controls.set({ opacity: 0 });
          setActive(false);
          running.current = false;
        }
      })();
    };

    return () => {
      delete window.__opThemeTransition;
    };
  }, [controls]);

  // Solid destination-theme base color — no gradients, so the crossfade stays
  // quiet and the eye isn't drawn to the veil itself.
  const background = toDark ? "#0a1122" : "#f4f5f8";

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={controls}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        background,
        pointerEvents: active ? "auto" : "none",
        willChange: "opacity",
      }}
    />
  );
}
