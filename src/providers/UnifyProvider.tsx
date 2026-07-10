import type { PropsWithChildren } from "react";
import { UnifyThemeProvider } from "@workiva/unify";

/**
 * Wraps Unify-based UI in Workiva's design-system theme. New chrome should be
 * built from `@workiva/unify` components inside this provider; fall back to MUI
 * (Unify's base) or minimal custom markup only where Unify has no component.
 */
export function UnifyProvider({ children }: PropsWithChildren) {
  return <UnifyThemeProvider>{children}</UnifyThemeProvider>;
}
