import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile, MOBILE_BREAKPOINT } from '../../hooks/useMobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;
  let mediaQueryListeners: Array<(e: MediaQueryListEvent) => void> = [];
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mediaQueryListeners = [];
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: window.innerWidth < MOBILE_BREAKPOINT,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_event: string, listener: (e: MediaQueryListEvent) => void) => {
        mediaQueryListeners.push(listener);
      },
      removeEventListener: (_event: string, listener: (e: MediaQueryListEvent) => void) => {
        mediaQueryListeners = mediaQueryListeners.filter((l) => l !== listener);
      },
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it('returns false for desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true for mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns true at mobile breakpoint boundary', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: MOBILE_BREAKPOINT - 1,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false at desktop breakpoint boundary', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: MOBILE_BREAKPOINT,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('updates when viewport changes', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate viewport change to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      // Trigger the media query listener
      mediaQueryListeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent)
      );
    });

    expect(result.current).toBe(true);
  });

  it('exports MOBILE_BREAKPOINT constant', () => {
    expect(MOBILE_BREAKPOINT).toBe(768);
  });
});
