import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CARTO_CONFIG } from '../config/carto';
import type { HeatmapPoint } from '../types/map';

// Cache keys for different data types
export const QUERY_KEYS = {
  heatmapData: ['carto', 'heatmap'] as const,
  retailStores: ['carto', 'retail-stores'] as const,
  demographics: ['carto', 'demographics'] as const,
} as const;

interface HeatmapRow {
  lng: number;
  lat: number;
  revenue: number;
}

/**
 * Fetches heatmap data from CARTO SQL API.
 * This function is used by TanStack Query for caching.
 */
async function fetchHeatmapData(): Promise<HeatmapPoint[]> {
  const { apiBaseUrl, accessToken, connectionName } = CARTO_CONFIG;

  const query = `SELECT ST_X(geom) as lng, ST_Y(geom) as lat, revenue FROM \`carto-demo-data.demo_tables.retail_stores\``;

  const response = await fetch(
    `${apiBaseUrl}/v3/sql/${connectionName}/query?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`CARTO query failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Transform data into heatmap points
  return data.rows.map((row: HeatmapRow) => ({
    coordinates: [row.lng, row.lat] as [number, number],
    weight: Math.max(row.revenue || 1, 1) / 100000,
  }));
}

/**
 * Hook for fetching and caching heatmap data using TanStack Query.
 * 
 * Benefits over the Web Worker approach:
 * - Automatic caching with configurable stale time
 * - Background refetching when data becomes stale
 * - Deduplication of concurrent requests
 * - Optimistic updates capability
 * - DevTools integration for debugging
 * 
 * @param enabled - Whether to fetch the data
 * @returns Query result with data, loading state, and error
 */
export function useHeatmapData(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.heatmapData,
    queryFn: fetchHeatmapData,
    enabled,
    // Heatmap data is expensive to fetch, keep it fresh for 10 minutes
    staleTime: 10 * 60 * 1000,
    // Keep in cache for 1 hour
    gcTime: 60 * 60 * 1000,
  });
}

/**
 * Hook to prefetch heatmap data.
 * Call this when user hovers over heatmap toggle to preload data.
 */
export function usePrefetchHeatmap() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.heatmapData,
      queryFn: fetchHeatmapData,
      staleTime: 10 * 60 * 1000,
    });
  };
}

/**
 * Hook to invalidate cached heatmap data and force a refetch.
 */
export function useInvalidateHeatmap() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.heatmapData });
  };
}

/**
 * Check if heatmap data is already cached.
 */
export function useIsHeatmapCached() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(QUERY_KEYS.heatmapData) !== undefined;
}
