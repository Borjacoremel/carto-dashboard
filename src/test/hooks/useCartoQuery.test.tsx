import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useHeatmapData, usePrefetchHeatmap, QUERY_KEYS } from '../../hooks/useCartoQuery';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Create a wrapper with QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useCartoQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useHeatmapData', () => {
    it('does not fetch when disabled', () => {
      const wrapper = createWrapper();
      
      renderHook(() => useHeatmapData(false), { wrapper });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches data when enabled', async () => {
      const mockData = {
        rows: [
          { lng: -122.4, lat: 37.8, revenue: 100000 },
          { lng: -122.5, lat: 37.9, revenue: 200000 },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useHeatmapData(true), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0]).toEqual({
        coordinates: [-122.4, 37.8],
        weight: 1, // 100000 / 100000
      });
    });

    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useHeatmapData(true), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('returns cached data on subsequent calls', async () => {
      const mockData = {
        rows: [{ lng: -122.4, lat: 37.8, revenue: 100000 }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 60000, // 1 minute
          },
        },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // First render - should fetch
      const { result: result1 } = renderHook(() => useHeatmapData(true), { wrapper });

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second render - should use cache
      const { result: result2 } = renderHook(() => useHeatmapData(true), { wrapper });

      // Data should be immediately available from cache
      expect(result2.current.data).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No additional fetch
    });
  });

  describe('usePrefetchHeatmap', () => {
    it('prefetches heatmap data', async () => {
      const mockData = {
        rows: [{ lng: -122.4, lat: 37.8, revenue: 100000 }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => usePrefetchHeatmap(), { wrapper });

      // Call prefetch
      result.current();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Check that data is now in cache
      const cachedData = queryClient.getQueryData(QUERY_KEYS.heatmapData);
      expect(cachedData).toBeDefined();
    });
  });

  describe('QUERY_KEYS', () => {
    it('has correct query keys defined', () => {
      expect(QUERY_KEYS.heatmapData).toEqual(['carto', 'heatmap']);
      expect(QUERY_KEYS.retailStores).toEqual(['carto', 'retail-stores']);
      expect(QUERY_KEYS.demographics).toEqual(['carto', 'demographics']);
    });
  });
});
