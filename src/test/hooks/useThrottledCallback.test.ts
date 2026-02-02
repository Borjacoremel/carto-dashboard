import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useThrottledCallback, useRAFCallback } from '../../hooks/useThrottledCallback';

describe('useThrottledCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('executes callback immediately on first call', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 100));

    act(() => {
      result.current('arg1');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg1');
  });

  it('throttles subsequent calls within delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 100));

    act(() => {
      result.current('first');
      result.current('second');
      result.current('third');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');
  });

  it('executes pending call after delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 100));

    act(() => {
      result.current('first');
      result.current('second');
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('second');
  });

  it('allows call after throttle period', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 100));

    act(() => {
      result.current('first');
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    act(() => {
      result.current('second');
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('second');
  });

  it('maintains stable reference', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ delay }) => useThrottledCallback(callback, delay),
      { initialProps: { delay: 100 } }
    );

    const firstRef = result.current;
    rerender({ delay: 100 });

    expect(result.current).toBe(firstRef);
  });

  it('cleans up timeout on unmount', () => {
    const callback = vi.fn();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { result, unmount } = renderHook(() => useThrottledCallback(callback, 100));

    act(() => {
      result.current('first');
      result.current('second'); // Creates pending timeout
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

describe('useRAFCallback', () => {
  let rafCallbacks: FrameRequestCallback[] = [];
  let rafId = 0;

  beforeEach(() => {
    rafCallbacks = [];
    rafId = 0;

    vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return ++rafId;
    }));

    vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => {
      // Simplified mock - just track cancellation
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('schedules callback via requestAnimationFrame', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useRAFCallback(callback));

    act(() => {
      result.current('arg1');
    });

    expect(requestAnimationFrame).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();

    // Simulate RAF execution
    act(() => {
      rafCallbacks[0](performance.now());
    });

    expect(callback).toHaveBeenCalledWith('arg1');
  });

  it('cancels previous RAF when called again', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useRAFCallback(callback));

    act(() => {
      result.current('first');
      result.current('second');
    });

    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it('maintains stable reference', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(() => useRAFCallback(callback));

    const firstRef = result.current;
    rerender();

    expect(result.current).toBe(firstRef);
  });
});
