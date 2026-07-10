import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "operator.previewWidth.v1";
const DEFAULT_WIDTH = 460;
export const MIN_PREVIEW_WIDTH = 340;
export const MAX_PREVIEW_WIDTH = 760;

function clampWidth(width: number) {
  const viewportLimit =
    typeof window === "undefined"
      ? MAX_PREVIEW_WIDTH
      : Math.max(MIN_PREVIEW_WIDTH, window.innerWidth - 420);
  return Math.min(
    Math.max(width, MIN_PREVIEW_WIDTH),
    Math.min(MAX_PREVIEW_WIDTH, viewportLimit),
  );
}

function initialWidth() {
  if (typeof window === "undefined") return DEFAULT_WIDTH;
  const stored = Number(window.localStorage.getItem(STORAGE_KEY));
  return clampWidth(
    Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_WIDTH,
  );
}

export function useResizablePreview() {
  const [width, setWidth] = useState(initialWidth);

  const updateWidth = useCallback((nextWidth: number) => {
    const clamped = clampWidth(nextWidth);
    setWidth(clamped);
    window.localStorage.setItem(STORAGE_KEY, String(clamped));
  }, []);

  useEffect(() => {
    const reclamp = () => setWidth((current) => clampWidth(current));
    window.addEventListener("resize", reclamp);
    return () => window.removeEventListener("resize", reclamp);
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = width;
      event.currentTarget.setPointerCapture?.(event.pointerId);

      const onPointerMove = (moveEvent: PointerEvent) => {
        updateWidth(startWidth + startX - moveEvent.clientX);
      };
      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [updateWidth, width],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const changes: Partial<Record<string, number>> = {
        ArrowLeft: width + 16,
        ArrowRight: width - 16,
        Home: MIN_PREVIEW_WIDTH,
        End: MAX_PREVIEW_WIDTH,
      };
      const nextWidth = changes[event.key];
      if (nextWidth === undefined) return;
      event.preventDefault();
      updateWidth(nextWidth);
    },
    [updateWidth, width],
  );

  return { width, onPointerDown, onKeyDown };
}
