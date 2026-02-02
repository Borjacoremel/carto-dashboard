// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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

describe('useCartoLayers', () => {
  describe('Initial State', () => {
    it('should return two layer configs on initialization', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current.layerConfigs).toHaveLength(2);
    });

    it('should have retail-stores as first layer', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current.layerConfigs[0].id).toBe('retail-stores');
    });

    it('should have sociodemographics as second layer', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current.layerConfigs[1].id).toBe('sociodemographics');
    });

    it('should return deck layers for visible layers', () => {
      const { result } = renderHook(() => useCartoLayers());

      // Both layers are visible by default
      expect(result.current.deckLayers).toHaveLength(2);
    });

    it('should have correct initial values for retail-stores layer', () => {
      const { result } = renderHook(() => useCartoLayers());

      const retailLayer = result.current.layerConfigs[0];
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
      const { result } = renderHook(() => useCartoLayers());

      const demoLayer = result.current.layerConfigs[1];
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
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current.layerConfigs[0].tableName).toBe(
        'carto-demo-data.demo_tables.retail_stores'
      );
    });

    it('should have correct tableName for sociodemographics (tileset)', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current.layerConfigs[1].tableName).toBe(
        'carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup'
      );
    });
  });

  describe('toggleLayerVisibility', () => {
    it('should toggle layer visibility from true to false', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current.layerConfigs[0].style.visible).toBe(true);

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(result.current.layerConfigs[0].style.visible).toBe(false);
    });

    it('should toggle layer visibility from false to true', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(result.current.layerConfigs[0].style.visible).toBe(false);

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(result.current.layerConfigs[0].style.visible).toBe(true);
    });

    it('should filter out hidden layers from deckLayers', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current.deckLayers).toHaveLength(2);

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(result.current.deckLayers).toHaveLength(1);
    });

    it('should not affect other layers when toggling one', () => {
      const { result } = renderHook(() => useCartoLayers());

      const originalSecondLayerVisibility = result.current.layerConfigs[1].style.visible;

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
      });

      expect(result.current.layerConfigs[1].style.visible).toBe(originalSecondLayerVisibility);
    });

    it('should do nothing for non-existent layer id', () => {
      const { result } = renderHook(() => useCartoLayers());

      const originalConfigs = [...result.current.layerConfigs];

      act(() => {
        result.current.toggleLayerVisibility('non-existent-layer');
      });

      expect(result.current.layerConfigs[0].style.visible).toBe(originalConfigs[0].style.visible);
      expect(result.current.layerConfigs[1].style.visible).toBe(originalConfigs[1].style.visible);
    });

    it('should return empty deckLayers when all layers are hidden', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.toggleLayerVisibility('retail-stores');
        result.current.toggleLayerVisibility('sociodemographics');
      });

      expect(result.current.deckLayers).toHaveLength(0);
    });
  });

  describe('updateLayerStyle', () => {
    it('should update fillColor', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#00FF00' });
      });

      expect(result.current.layerConfigs[0].style.fillColor).toBe('#00FF00');
    });

    it('should update opacity', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', { opacity: 0.5 });
      });

      expect(result.current.layerConfigs[0].style.opacity).toBe(0.5);
    });

    it('should update outlineColor', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', { outlineColor: '#000000' });
      });

      expect(result.current.layerConfigs[0].style.outlineColor).toBe('#000000');
    });

    it('should update outlineWidth', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', { outlineWidth: 3 });
      });

      expect(result.current.layerConfigs[0].style.outlineWidth).toBe(3);
    });

    it('should update radius for point layer', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', { radius: 12 });
      });

      expect(result.current.layerConfigs[0].style.radius).toBe(12);
    });

    it('should update colorByColumn', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', { colorByColumn: 'revenue' });
      });

      expect(result.current.layerConfigs[0].style.colorByColumn).toBe('revenue');
    });

    it('should set colorByColumn to null', () => {
      const { result } = renderHook(() => useCartoLayers());

      // First set it to a value
      act(() => {
        result.current.updateLayerStyle('retail-stores', { colorByColumn: 'revenue' });
      });

      expect(result.current.layerConfigs[0].style.colorByColumn).toBe('revenue');

      // Then set it back to null
      act(() => {
        result.current.updateLayerStyle('retail-stores', { colorByColumn: null });
      });

      expect(result.current.layerConfigs[0].style.colorByColumn).toBeNull();
    });

    it('should update visible state directly', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', { visible: false });
      });

      expect(result.current.layerConfigs[0].style.visible).toBe(false);
    });

    it('should update multiple style properties at once', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('retail-stores', {
          fillColor: '#FF0000',
          opacity: 0.7,
          radius: 10,
          outlineWidth: 2,
        });
      });

      expect(result.current.layerConfigs[0].style.fillColor).toBe('#FF0000');
      expect(result.current.layerConfigs[0].style.opacity).toBe(0.7);
      expect(result.current.layerConfigs[0].style.radius).toBe(10);
      expect(result.current.layerConfigs[0].style.outlineWidth).toBe(2);
    });

    it('should not affect other layers when updating one layer', () => {
      const { result } = renderHook(() => useCartoLayers());

      const originalSecondLayerStyle = { ...result.current.layerConfigs[1].style };

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#FF0000' });
      });

      expect(result.current.layerConfigs[1].style.fillColor).toBe(
        originalSecondLayerStyle.fillColor
      );
      expect(result.current.layerConfigs[1].style.opacity).toBe(originalSecondLayerStyle.opacity);
    });

    it('should preserve unmodified style properties', () => {
      const { result } = renderHook(() => useCartoLayers());

      const originalOutlineColor = result.current.layerConfigs[0].style.outlineColor;

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#FF0000' });
      });

      expect(result.current.layerConfigs[0].style.outlineColor).toBe(originalOutlineColor);
    });

    it('should do nothing for non-existent layer id', () => {
      const { result } = renderHook(() => useCartoLayers());

      const originalFillColor = result.current.layerConfigs[0].style.fillColor;

      act(() => {
        result.current.updateLayerStyle('non-existent-layer', { fillColor: '#FF0000' });
      });

      expect(result.current.layerConfigs[0].style.fillColor).toBe(originalFillColor);
    });

    it('should update sociodemographics layer style', () => {
      const { result } = renderHook(() => useCartoLayers());

      act(() => {
        result.current.updateLayerStyle('sociodemographics', {
          fillColor: '#AABBCC',
          opacity: 0.8,
        });
      });

      expect(result.current.layerConfigs[1].style.fillColor).toBe('#AABBCC');
      expect(result.current.layerConfigs[1].style.opacity).toBe(0.8);
    });
  });

  describe('deckLayers generation', () => {
    it('should regenerate deckLayers when style changes', () => {
      const { result } = renderHook(() => useCartoLayers());

      const initialLayers = result.current.deckLayers;

      act(() => {
        result.current.updateLayerStyle('retail-stores', { fillColor: '#FF0000' });
      });

      // deckLayers should be a new array reference
      expect(result.current.deckLayers).not.toBe(initialLayers);
    });

    it('should maintain layer order in deckLayers', () => {
      const { result } = renderHook(() => useCartoLayers());

      const layerIds = result.current.deckLayers.map((l: any) => l.id);
      expect(layerIds).toEqual(['retail-stores', 'sociodemographics']);
    });
  });

  describe('Return value stability', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(result.current).toHaveProperty('deckLayers');
      expect(result.current).toHaveProperty('layerConfigs');
      expect(result.current).toHaveProperty('toggleLayerVisibility');
      expect(result.current).toHaveProperty('updateLayerStyle');
    });

    it('should return functions for toggleLayerVisibility and updateLayerStyle', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(typeof result.current.toggleLayerVisibility).toBe('function');
      expect(typeof result.current.updateLayerStyle).toBe('function');
    });

    it('should return arrays for deckLayers and layerConfigs', () => {
      const { result } = renderHook(() => useCartoLayers());

      expect(Array.isArray(result.current.deckLayers)).toBe(true);
      expect(Array.isArray(result.current.layerConfigs)).toBe(true);
    });
  });
});
