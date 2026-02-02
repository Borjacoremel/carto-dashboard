import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useCartoLayers } from '../../hooks/useCartoLayers';

// Mock deck.gl modules
vi.mock('@deck.gl/carto', () => {
  class MockVectorTileLayer {
    id: string;
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) {
      this.id = props.id as string;
      this.props = props;
    }
  }
  return {
    VectorTileLayer: MockVectorTileLayer,
    vectorTableSource: vi.fn((config) => ({ ...config, type: 'table' })),
    vectorTilesetSource: vi.fn((config) => ({ ...config, type: 'tileset' })),
  };
});

vi.mock('@deck.gl/aggregation-layers', () => {
  class MockHeatmapLayer {
    id: string;
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) {
      this.id = props.id as string;
      this.props = props;
    }
  }
  return {
    HeatmapLayer: MockHeatmapLayer,
  };
});

// Mock useCartoQuery
vi.mock('../../hooks/useCartoQuery', () => ({
  useHeatmapData: () => ({
    data: [
      { coordinates: [-122.4, 37.8], weight: 1 },
      { coordinates: [-122.5, 37.9], weight: 0.5 },
    ],
    isLoading: false,
    error: null,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCartoLayers Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Layer State Management', () => {
    it('initializes with correct layer configuration', () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.layerConfigs).toHaveLength(2);
      expect(result.current.layerConfigs[0].id).toBe('sociodemographics');
      expect(result.current.layerConfigs[1].id).toBe('retail-stores');
    });

    it('generates deck layers for all visible layers', () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      // Both layers visible by default = 2 deck layers
      expect(result.current.deckLayers.length).toBeGreaterThanOrEqual(2);
    });

    it('filters deck layers when visibility is toggled', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      const initialCount = result.current.deckLayers.length;

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      await waitFor(() => {
        expect(result.current.deckLayers.length).toBeLessThan(initialCount);
      });
    });

    it('updates layer style and regenerates deck layers', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      const initialLayers = result.current.deckLayers;

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#00FF00' });
      });

      await waitFor(() => {
        // New deck layers should be generated
        expect(result.current.deckLayers).not.toBe(initialLayers);
        // Style should be updated in config
        const retailConfig = result.current.layerConfigs.find(
          (l) => l.id === 'retail-stores'
        );
        expect(retailConfig?.style.fillColor).toBe('#00FF00');
      });
    });
  });

  describe('Heatmap Integration', () => {
    it('initializes with heatmap disabled', () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.heatmapEnabled).toBe(false);
    });

    it('enables heatmap when toggled', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setHeatmapEnabled(true);
      });

      await waitFor(() => {
        expect(result.current.heatmapEnabled).toBe(true);
      });
    });

    it('adds heatmap layer when enabled with data', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      const initialLayerCount = result.current.deckLayers.length;

      act(() => {
        result.current.setHeatmapEnabled(true);
      });

      await waitFor(() => {
        // Heatmap enabled state should be true
        expect(result.current.heatmapEnabled).toBe(true);
        // The heatmap layer should be present (ID is retail-stores-heatmap)
        const layerIds = result.current.deckLayers.map((l: { id: string }) => l.id);
        const hasHeatmap = layerIds.some((id: string) => id.includes('heatmap'));
        expect(hasHeatmap).toBe(true);
      });
    });

    it('removes heatmap layer when disabled', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      // Enable first
      act(() => {
        result.current.setHeatmapEnabled(true);
      });

      await waitFor(() => {
        expect(result.current.heatmapEnabled).toBe(true);
      });

      // Then disable
      act(() => {
        result.current.setHeatmapEnabled(false);
      });

      await waitFor(() => {
        expect(result.current.heatmapEnabled).toBe(false);
        // No heatmap layer should be present
        const layerIds = result.current.deckLayers.map((l: { id: string }) => l.id);
        const hasHeatmap = layerIds.some((id: string) => id.includes('heatmap'));
        expect(hasHeatmap).toBe(false);
      });
    });
  });

  describe('Complex State Changes', () => {
    it('handles multiple rapid style updates', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#FF0000' });
        result.current.updateLayerStyle('retail-stores', { opacity: 0.5 });
        result.current.updateLayerStyle('retail-stores', { radius: 10 });
      });

      await waitFor(() => {
        const retailConfig = result.current.layerConfigs.find(
          (l) => l.id === 'retail-stores'
        );
        expect(retailConfig?.style.fillColor).toBe('#FF0000');
        expect(retailConfig?.style.opacity).toBe(0.5);
        expect(retailConfig?.style.radius).toBe(10);
      });
    });

    it('handles toggling all layers off and on', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      // Toggle all off
      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
        result.current.toggleLayerVisibility('sociodemographics');
      });

      await waitFor(() => {
        // Only heatmap-related layers might remain (or none)
        const visibleLayers = result.current.deckLayers.filter(
          (l: { id: string }) => !l.id.includes('heatmap')
        );
        expect(visibleLayers.length).toBe(0);
      });

      // Toggle all back on
      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
        result.current.toggleLayerVisibility('sociodemographics');
      });

      await waitFor(() => {
        expect(result.current.deckLayers.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('maintains layer order after state changes', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      // Make some changes
      act(() => {
        result.current.updateLayerStyle('sociodemographics', { opacity: 0.8 });
        result.current.updateLayerStyle('retail-stores', { radius: 8 });
      });

      await waitFor(() => {
        // Layer order should be preserved: sociodemographics first, retail-stores on top
        const layerIds = result.current.deckLayers
          .filter((l: { id: string }) => !l.id.includes('heatmap'))
          .map((l: { id: string }) => l.id);

        const socioIndex = layerIds.indexOf('sociodemographics');
        const retailIndex = layerIds.indexOf('retail-stores');

        expect(socioIndex).toBeLessThan(retailIndex);
      });
    });

    it('combines heatmap with layer visibility changes', async () => {
      const { result } = renderHook(() => useCartoLayers(), {
        wrapper: createWrapper(),
      });

      // Hide sociodemographics layer
      act(() => {
        result.current.toggleLayerVisibility('sociodemographics');
      });

      await waitFor(() => {
        const socioConfig = result.current.layerConfigs.find(
          (l) => l.id === 'sociodemographics'
        );
        expect(socioConfig?.style.visible).toBe(false);

        // Should have only retail-stores visible (sociodemographics hidden)
        const layerIds = result.current.deckLayers.map((l: { id: string }) => l.id);
        expect(layerIds).toContain('retail-stores');
        expect(layerIds).not.toContain('sociodemographics');
      });
    });
  });
});
