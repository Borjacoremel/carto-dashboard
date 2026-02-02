import { useEffect, useRef, useCallback, useState } from 'react';
import { CARTO_CONFIG } from '../config/carto';
import type { HeatmapPoint } from '../types/map';

export function useHeatmapWorker(enabled: boolean) {
  const workerRef = useRef<Worker | null>(null);
  const [data, setData] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/heatmap.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === 'HEATMAP_SUCCESS') {
        setData(payload);
        setIsLoading(false);
        setError(null);
      } else if (type === 'HEATMAP_ERROR') {
        setError(payload);
        setIsLoading(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Fetch data when enabled
  useEffect(() => {
    if (enabled && workerRef.current) {
      setIsLoading(true);
      workerRef.current.postMessage({
        type: 'FETCH_HEATMAP',
        payload: {
          apiBaseUrl: CARTO_CONFIG.apiBaseUrl,
          accessToken: CARTO_CONFIG.accessToken,
          connectionName: CARTO_CONFIG.connectionName,
        },
      });
    }
  }, [enabled]);

  const refetch = useCallback(() => {
    if (workerRef.current) {
      setIsLoading(true);
      workerRef.current.postMessage({
        type: 'FETCH_HEATMAP',
        payload: {
          apiBaseUrl: CARTO_CONFIG.apiBaseUrl,
          accessToken: CARTO_CONFIG.accessToken,
          connectionName: CARTO_CONFIG.connectionName,
        },
      });
    }
  }, []);

  return { data, isLoading, error, refetch };
}
