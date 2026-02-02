import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useCartoLayers } from '../../hooks/useCartoLayers';

// Mock the CARTO modules with proper class constructors
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
    vectorTableSource: (config: Record<string, unknown>) => ({ ...config, type: 'table' }),
    vectorTilesetSource: (config: Record<string, unknown>) => ({ ...config, type: 'tileset' }),
  };
});

// Mock the HeatmapLayer from aggregation-layers
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

// Mock the useCartoQuery hook to avoid fetch calls
vi.mock('../../hooks/useCartoQuery', () => ({
  useHeatmapData: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

// Create a wrapper with QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useCartoLayers', () => {
  const wrapper = createWrapper();
  // Helper to find layer by id (layer order: sociodemographics first, retail-stores second for rendering)
  const findLayer = (configs: any[], id: string) => configs.find((c: any) => c.id === id);

  describe('Initial State', () => {
    it('should return two layer configs on initialization', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(result.current.layerConfigs).toHaveLength(2);
    });

    it('should have sociodemographics as first layer (renders at bottom)', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(result.current.layerConfigs[0].id).toBe('sociodemographics');
    });

    it('should have retail-stores as second layer (renders on top for hover priority)', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(result.current.layerConfigs[1].id).toBe('retail-stores');
    });

    it('should return deck layers for visible layers', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      // Both layers are visible by default
      expect(result.current.deckLayers).toHaveLength(2);
    });

    it('should have correct initial values for retail-stores layer', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const retailLayer = findLayer(result.current.layerConfigs, 'retail-stores');
      expect(retailLayer.name).toBe('Retail Stores');
      expect(retailLayer.type).toBe('point');
      expect(retailLayer.style.fillColor).toBe('#FF6B6B');
      expect(retailLayer.style.radius).toBe(6);
      expect(retailLayer.style.outlineColor).toBe('#ffffff');
      expect(retailLayer.style.outlineWidth).toBe(1);
      expect(retailLayer.style.opacity).toBe(0.9);
      expect(retailLayer.style.visible).toBe(true);
      expect(retailLayer.style.colorByColumn).toBeNull();
      expect(retailLayer.colorByOptions).toContain('revenue');
    });

    it('should have correct initial values for sociodemographics layer', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const demoLayer = findLayer(result.current.layerConfigs, 'sociodemographics');
      expect(demoLayer.name).toBe('US Demographics');
      expect(demoLayer.type).toBe('polygon');
      expect(demoLayer.style.fillColor).toBe('#4ECDC4');
      expect(demoLayer.style.outlineColor).toBe('#1e1e24');
      expect(demoLayer.style.outlineWidth).toBe(0.5);
      expect(demoLayer.style.opacity).toBe(0.6);
      expect(demoLayer.style.visible).toBe(true);
      expect(demoLayer.style.colorByColumn).toBe('total_pop');
      expect(demoLayer.colorByOptions).toContain('total_pop');
      expect(demoLayer.colorByOptions).toContain('median_income');
    });

    it('should have correct tableName for retail-stores', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const retailLayer = findLayer(result.current.layerConfigs, 'retail-stores');
      expect(retailLayer.tableName).toBe('carto-demo-data.demo_tables.retail_stores');
    });

    it('should have correct tableName for sociodemographics (tileset)', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const demoLayer = findLayer(result.current.layerConfigs, 'sociodemographics');
      expect(demoLayer.tableName).toBe(
        'carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup'
      );
    });
  });

  describe('toggleLayerVisibility', () => {
    it('should toggle layer visibility from true to false', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.visible).toBe(true);

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.visible).toBe(false);
    });

    it('should toggle layer visibility from false to true', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.visible).toBe(false);

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.visible).toBe(true);
    });

    it('should filter out hidden layers from deckLayers', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(result.current.deckLayers).toHaveLength(2);

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(result.current.deckLayers).toHaveLength(1);
    });

    it('should not affect other layers when toggling one', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const originalDemoLayerVisibility = findLayer(
        result.current.layerConfigs,
        'sociodemographics'
      ).style.visible;

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(findLayer(result.current.layerConfigs, 'sociodemographics').style.visible).toBe(
        originalDemoLayerVisibility
      );
    });

    it('should do nothing for non-existent layer id', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const originalRetailVisible = findLayer(
        result.current.layerConfigs,
        'retail-stores'
      ).style.visible;
      const originalDemoVisible = findLayer(
        result.current.layerConfigs,
        'sociodemographics'
      ).style.visible;

      act(() => {
        result.current.toggleLayerVisibility('non-existent-layer');
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.visible).toBe(
        originalRetailVisible
      );
      expect(findLayer(result.current.layerConfigs, 'sociodemographics').style.visible).toBe(
        originalDemoVisible
      );
    });

    it('should return empty deckLayers when all layers are hidden', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
        result.current.toggleLayerVisibility('sociodemographics');
      });

      expect(result.current.deckLayers).toHaveLength(0);
    });
  });

  describe('updateLayerStyle', () => {
    it('should update fillColor', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#00FF00' });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.fillColor).toBe(
        '#00FF00'
      );
    });

    it('should update opacity', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { opacity: 0.5 });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.opacity).toBe(0.5);
    });

    it('should update outlineColor', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { outlineColor: '#000000' });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.outlineColor).toBe(
        '#000000'
      );
    });

    it('should update outlineWidth', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { outlineWidth: 3 });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.outlineWidth).toBe(3);
    });

    it('should update radius for point layer', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { radius: 12 });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.radius).toBe(12);
    });

    it('should update colorByColumn', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { colorByColumn: 'revenue' });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.colorByColumn).toBe(
        'revenue'
      );
    });

    it('should set colorByColumn to null', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      // First set it to a value
      act(() => {
        result.current.updateLayerStyle('retail-stores', { colorByColumn: 'revenue' });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.colorByColumn).toBe(
        'revenue'
      );

      // Then set it back to null
      act(() => {
        result.current.updateLayerStyle('retail-stores', { colorByColumn: null });
      });

      expect(
        findLayer(result.current.layerConfigs, 'retail-stores').style.colorByColumn
      ).toBeNull();
    });

    it('should update visible state directly', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', { visible: false });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.visible).toBe(false);
    });

    it('should update multiple style properties at once', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('retail-stores', {
          fillColor: '#FF0000',
          opacity: 0.7,
          radius: 10,
          outlineWidth: 2,
        });
      });

      const retailLayer = findLayer(result.current.layerConfigs, 'retail-stores');
      expect(retailLayer.style.fillColor).toBe('#FF0000');
      expect(retailLayer.style.opacity).toBe(0.7);
      expect(retailLayer.style.radius).toBe(10);
      expect(retailLayer.style.outlineWidth).toBe(2);
    });

    it('should not affect other layers when updating one layer', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const originalDemoLayerStyle = {
        ...findLayer(result.current.layerConfigs, 'sociodemographics').style,
      };

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#FF0000' });
      });

      const demoLayer = findLayer(result.current.layerConfigs, 'sociodemographics');
      expect(demoLayer.style.fillColor).toBe(originalDemoLayerStyle.fillColor);
      expect(demoLayer.style.opacity).toBe(originalDemoLayerStyle.opacity);
    });

    it('should preserve unmodified style properties', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const originalOutlineColor = findLayer(
        result.current.layerConfigs,
        'retail-stores'
      ).style.outlineColor;

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#FF0000' });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.outlineColor).toBe(
        originalOutlineColor
      );
    });

    it('should do nothing for non-existent layer id', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const originalFillColor = findLayer(
        result.current.layerConfigs,
        'retail-stores'
      ).style.fillColor;

      act(() => {
        result.current.updateLayerStyle('non-existent-layer', { fillColor: '#FF0000' });
      });

      expect(findLayer(result.current.layerConfigs, 'retail-stores').style.fillColor).toBe(
        originalFillColor
      );
    });

    it('should update sociodemographics layer style', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateLayerStyle('sociodemographics', {
          fillColor: '#AABBCC',
          opacity: 0.8,
        });
      });

      const demoLayer = findLayer(result.current.layerConfigs, 'sociodemographics');
      expect(demoLayer.style.fillColor).toBe('#AABBCC');
      expect(demoLayer.style.opacity).toBe(0.8);
    });
  });

  describe('deckLayers generation', () => {
    it('should regenerate deckLayers when style changes', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const initialLayers = result.current.deckLayers;

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#FF0000' });
      });

      // deckLayers should be a new array reference
      expect(result.current.deckLayers).not.toBe(initialLayers);
    });

    it('should maintain layer order in deckLayers (sociodemographics first, retail-stores on top)', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      const layerIds = result.current.deckLayers.map((l: any) => l.id);
      expect(layerIds).toEqual(['sociodemographics', 'retail-stores']);
    });
  });

  describe('Return value stability', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(result.current).toHaveProperty('deckLayers');
      expect(result.current).toHaveProperty('layerConfigs');
      expect(result.current).toHaveProperty('toggleLayerVisibility');
      expect(result.current).toHaveProperty('updateLayerStyle');
    });

    it('should return functions for toggleLayerVisibility and updateLayerStyle', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(typeof result.current.toggleLayerVisibility).toBe('function');
      expect(typeof result.current.updateLayerStyle).toBe('function');
    });

    it('should return arrays for deckLayers and layerConfigs', () => {
      const { result } = renderHook(() => useCartoLayers(), { wrapper: createWrapper() });

      expect(Array.isArray(result.current.deckLayers)).toBe(true);
      expect(Array.isArray(result.current.layerConfigs)).toBe(true);
    });
  });
});
