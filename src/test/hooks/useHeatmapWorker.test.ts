import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHeatmapWorker } from '../../hooks/useHeatmapWorker';

// Create a proper Worker mock class
const mockPostMessage = vi.fn();
const mockTerminate = vi.fn();

class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  postMessage = mockPostMessage;
  terminate = mockTerminate;
}

beforeAll(() => {
  // @ts-expect-error - mocking Worker global
  global.Worker = MockWorker;
});

describe('useHeatmapWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty data', () => {
    const { result } = renderHook(() => useHeatmapWorker(false));

    expect(result.current.data).toEqual([]);
  });

  it('should initialize with isLoading false when disabled', () => {
    const { result } = renderHook(() => useHeatmapWorker(false));

    expect(result.current.isLoading).toBe(false);
  });

  it('should initialize with null error', () => {
    const { result } = renderHook(() => useHeatmapWorker(false));

    expect(result.current.error).toBeNull();
  });

  it('should provide a refetch function', () => {
    const { result } = renderHook(() => useHeatmapWorker(false));

    expect(typeof result.current.refetch).toBe('function');
  });

  it('should call terminate on unmount', () => {
    const { unmount } = renderHook(() => useHeatmapWorker(false));

    unmount();

    expect(mockTerminate).toHaveBeenCalled();
  });

  it('should post message when enabled', () => {
    renderHook(() => useHeatmapWorker(true));

    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'FETCH_HEATMAP',
      })
    );
  });

  it('should not post message when disabled', () => {
    renderHook(() => useHeatmapWorker(false));

    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('should post message when refetch is called', () => {
    const { result } = renderHook(() => useHeatmapWorker(false));

    result.current.refetch();

    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'FETCH_HEATMAP',
      })
    );
  });
});
