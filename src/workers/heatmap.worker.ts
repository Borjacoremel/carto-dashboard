// Web Worker for processing heatmap data off the main thread

interface HeatmapRow {
  lng: number;
  lat: number;
  revenue: number;
}

interface HeatmapPoint {
  coordinates: [number, number];
  weight: number;
}

interface WorkerMessage {
  type: 'FETCH_HEATMAP';
  payload: {
    apiBaseUrl: string;
    accessToken: string;
    connectionName: string;
  };
}

interface WorkerResponse {
  type: 'HEATMAP_SUCCESS' | 'HEATMAP_ERROR';
  payload: HeatmapPoint[] | string;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  if (type === 'FETCH_HEATMAP') {
    try {
      const { apiBaseUrl, accessToken, connectionName } = payload;

      const response = await fetch(
        `${apiBaseUrl}/v3/sql/${connectionName}/query?q=${encodeURIComponent(
          'SELECT ST_X(geom) as lng, ST_Y(geom) as lat, revenue FROM `carto-demo-data.demo_tables.retail_stores`'
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Query failed: ${response.status}`);
      }

      const data = await response.json();

      // Process data in the worker
      const points: HeatmapPoint[] = data.rows.map((row: HeatmapRow) => ({
        coordinates: [row.lng, row.lat] as [number, number],
        weight: Math.max(row.revenue || 1, 1) / 100000,
      }));

      self.postMessage({
        type: 'HEATMAP_SUCCESS',
        payload: points,
      } as WorkerResponse);
    } catch (err) {
      self.postMessage({
        type: 'HEATMAP_ERROR',
        payload: err instanceof Error ? err.message : 'Unknown error',
      } as WorkerResponse);
    }
  }
};

export {};
