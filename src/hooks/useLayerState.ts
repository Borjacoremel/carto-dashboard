import { useState, useEffect, useRef, useCallback } from 'react';
import type { LayerConfig, LayerStyle } from '../types/map';
import { STORAGE_KEYS, PERSISTENCE_DEBOUNCE_MS } from '../config/constants';

/**
 * Initial layer configurations.
 * These define the base structure for all map layers.
 */
const INITIAL_LAYERS: LayerConfig[] = [
  {
    id: 'sociodemographics',
    name: 'US Demographics',
    tableName: 'carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup',
    type: 'polygon',
    style: {
      fillColor: '#4ECDC4',
      outlineColor: '#1e1e24',
      outlineWidth: 0.5,
      radius: 0,
      colorByColumn: 'total_pop',
      visible: true,
      opacity: 0.6,
    },
    columns: [{ name: 'total_pop', type: 'number' }],
    colorByOptions: ['total_pop', 'median_income'],
  },
  {
    id: 'retail-stores',
    name: 'Retail Stores',
    tableName: 'carto-demo-data.demo_tables.retail_stores',
    type: 'point',
    style: {
      fillColor: '#FF6B6B',
      outlineColor: '#ffffff',
      outlineWidth: 1,
      radius: 6,
      colorByColumn: null,
      visible: true,
      opacity: 0.9,
    },
    columns: [{ name: 'revenue', type: 'number' }],
    colorByOptions: ['revenue'],
  },
];

/**
 * Load persisted layer styles from localStorage.
 * Merges with initial layers to handle schema changes gracefully.
 */
function loadPersistedLayers(): LayerConfig[] {
  if (typeof window === 'undefined') return INITIAL_LAYERS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.LAYER_STYLES);
    if (!stored) return INITIAL_LAYERS;

    const parsedStyles: Record<string, Partial<LayerStyle>> = JSON.parse(stored);

    return INITIAL_LAYERS.map((layer) => {
      const persistedStyle = parsedStyles[layer.id];
      if (persistedStyle) {
        return {
          ...layer,
          style: { ...layer.style, ...persistedStyle },
        };
      }
      return layer;
    });
  } catch {
    return INITIAL_LAYERS;
  }
}

/**
 * Load persisted heatmap state from localStorage.
 */
function loadPersistedHeatmap(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.HEATMAP_ENABLED);
    return stored === 'true';
  } catch {
    return false;
  }
}

export interface UseLayerStateReturn {
  layerConfigs: LayerConfig[];
  setLayerConfigs: React.Dispatch<React.SetStateAction<LayerConfig[]>>;
  heatmapEnabled: boolean;
  setHeatmapEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLayerVisibility: (id: string) => void;
  updateLayerStyle: (id: string, updates: Partial<LayerStyle>) => void;
}

/**
 * Hook for managing layer state with localStorage persistence.
 * 
 * Responsibilities:
 * - Layer configuration state management
 * - Heatmap toggle state
 * - Debounced persistence to localStorage
 * - Visibility toggle and style update actions
 */
export function useLayerState(): UseLayerStateReturn {
  const [layerConfigs, setLayerConfigs] = useState<LayerConfig[]>(loadPersistedLayers);
  const [heatmapEnabled, setHeatmapEnabled] = useState<boolean>(loadPersistedHeatmap);

  // Persist layer styles to localStorage (debounced)
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = setTimeout(() => {
      try {
        const stylesToPersist: Record<string, LayerStyle> = {};
        layerConfigs.forEach((layer) => {
          stylesToPersist[layer.id] = layer.style;
        });
        window.localStorage.setItem(STORAGE_KEYS.LAYER_STYLES, JSON.stringify(stylesToPersist));
      } catch {
        // Storage full or unavailable - fail silently
      }
    }, PERSISTENCE_DEBOUNCE_MS);

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, [layerConfigs]);

  // Persist heatmap state immediately (small data, no debounce needed)
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.HEATMAP_ENABLED, String(heatmapEnabled));
    } catch {
      // Storage unavailable - fail silently
    }
  }, [heatmapEnabled]);

  /**
   * Toggle visibility state for a layer.
   */
  const toggleLayerVisibility = useCallback((id: string) => {
    setLayerConfigs((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, style: { ...l.style, visible: !l.style.visible } } : l
      )
    );
  }, []);

  /**
   * Update style properties for a layer.
   */
  const updateLayerStyle = useCallback((id: string, updates: Partial<LayerStyle>) => {
    setLayerConfigs((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, style: { ...l.style, ...updates } } : l
      )
    );
  }, []);

  return {
    layerConfigs,
    setLayerConfigs,
    heatmapEnabled,
    setHeatmapEnabled,
    toggleLayerVisibility,
    updateLayerStyle,
  };
}
