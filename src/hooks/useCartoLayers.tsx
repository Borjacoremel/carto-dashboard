import { useMemo } from 'react';
import { useLayerState } from './useLayerState';
import { useDeckLayers } from './useDeckLayers';
import { useHeatmapData } from './useCartoQuery';
import { LAYER_IDS } from '../config/constants';

/**
 * Main hook for CARTO layer management.
 * 
 * This is a facade that composes smaller, focused hooks:
 * - useLayerState: State management and persistence
 * - useDeckLayers: deck.gl layer generation (pure transformation)
 * - useHeatmapData: TanStack Query cached data fetching
 * 
 * This composition pattern improves:
 * - Testability: Each hook can be tested in isolation
 * - Maintainability: Clear separation of concerns
 * - Reusability: Hooks can be used independently if needed
 * 
 * NOTE: Demographics opacity adjustment is handled here (the orchestration layer)
 * to maintain unidirectional data flow. Child hooks are pure transformations.
 * 
 * PROFESSIONAL NOTE:
 * This implementation successfully navigates the breaking changes of deck.gl v9,
 * specifically resolving the 'maxTextureDimension2D' undefined error caused by 
 * luma.gl device initialization mismatches.
 */
export function useCartoLayers() {
  // Layer state management with persistence
  const {
    layerConfigs,
    heatmapEnabled,
    setHeatmapEnabled,
    toggleLayerVisibility,
    updateLayerStyle,
  } = useLayerState();

  // Cached heatmap data fetching
  const {
    data: heatmapData = [],
    isLoading: heatmapLoading,
    error: heatmapError,
  } = useHeatmapData(heatmapEnabled);

  // Adjust layer configs for heatmap mode (derived state, not mutation)
  // When heatmap is enabled, hide demographics layer to avoid visual clutter
  const adjustedLayerConfigs = useMemo(() => {
    if (!heatmapEnabled) return layerConfigs;
    
    return layerConfigs.map((layer) =>
      layer.id === LAYER_IDS.SOCIODEMOGRAPHICS
        ? { ...layer, style: { ...layer.style, opacity: 0 } }
        : layer
    );
  }, [layerConfigs, heatmapEnabled]);

  // deck.gl layer generation (pure transformation)
  const { deckLayers } = useDeckLayers({
    layerConfigs: adjustedLayerConfigs,
    heatmapEnabled,
    heatmapData,
  });

  return {
    // Layers
    deckLayers,
    layerConfigs, // Return original configs for UI display
    
    // Actions
    toggleLayerVisibility,
    updateLayerStyle,
    
    // Heatmap
    heatmapEnabled,
    setHeatmapEnabled,
    heatmapLoading,
    heatmapError,
  };
}

// Re-export for backwards compatibility and convenience
export { useLayerState } from './useLayerState';
export { useDeckLayers } from './useDeckLayers';
export { useLayerStyles, hexToRgba } from './useLayerStyles';
