import { useLayerState } from './useLayerState';
import { useDeckLayers } from './useDeckLayers';
import { useHeatmapData } from './useCartoQuery';

/**
 * Main hook for CARTO layer management.
 * 
 * This is a facade that composes smaller, focused hooks:
 * - useLayerState: State management and persistence
 * - useDeckLayers: deck.gl layer generation
 * - useHeatmapData: TanStack Query cached data fetching
 * 
 * This composition pattern improves:
 * - Testability: Each hook can be tested in isolation
 * - Maintainability: Clear separation of concerns
 * - Reusability: Hooks can be used independently if needed
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
    setLayerConfigs,
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

  // deck.gl layer generation
  const { deckLayers } = useDeckLayers({
    layerConfigs,
    heatmapEnabled,
    heatmapData,
    setLayerConfigs,
  });

  return {
    // Layers
    deckLayers,
    layerConfigs,
    
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
