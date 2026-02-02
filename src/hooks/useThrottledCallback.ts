import { useRef, useCallback, useEffect } from 'react';

/**
 * Creates a throttled version of a callback that executes at most once per interval.
 * Uses requestAnimationFrame for smooth visual updates.
 */
export function useThrottledCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        lastRun.current = now;
        callbackRef.current(...args);
      } else {
        // Schedule execution for remaining time
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callbackRef.current(...args);
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [delay]
  );
}

/**
 * Creates a debounced callback using requestAnimationFrame for smooth animations.
 * Ideal for scroll/resize handlers that update visual state.
 */
export function useRAFCallback<T extends (...args: any[]) => void>(callback: T): T {
  const rafRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        callbackRef.current(...args);
        rafRef.current = null;
      });
    }) as T,
    []
  );
}
