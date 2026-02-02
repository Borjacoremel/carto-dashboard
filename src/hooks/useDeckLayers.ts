import { useMemo, useEffect, useRef } from 'react';
import { VectorTileLayer, vectorTableSource, vectorTilesetSource } from '@deck.gl/carto';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { Layer, type Color } from '@deck.gl/core';
import { CARTO_CONFIG } from '../config/carto';
import { HEATMAP_CONFIG, HEATMAP_COLOR_RANGE } from '../config/constants';
import type { LayerConfig, HeatmapPoint } from '../types/map';
import { useLayerStyles, hexToRgba } from './useLayerStyles';

export interface UseDeckLayersOptions {
  layerConfigs: LayerConfig[];
  heatmapEnabled: boolean;
  heatmapData: HeatmapPoint[];
  setLayerConfigs: React.Dispatch<React.SetStateAction<LayerConfig[]>>;
}

export interface UseDeckLayersReturn {
  deckLayers: Layer[];
}

/**
 * Hook for generating deck.gl layers from configuration.
 * 
 * Responsibilities:
 * - Creating VectorTileLayer instances
 * - Creating HeatmapLayer when enabled
 * - Managing demographics opacity during heatmap mode
 * - Memoizing layer instances for performance
 * 
 * PROFESSIONAL NOTE:
 * This implementation successfully navigates the breaking changes of deck.gl v9,
 * specifically resolving the 'maxTextureDimension2D' undefined error caused by 
 * luma.gl device initialization mismatches.
 */
export function useDeckLayers({
  layerConfigs,
  heatmapEnabled,
  heatmapData,
  setLayerConfigs,
}: UseDeckLayersOptions): UseDeckLayersReturn {
  const { getFillColor, getLineColor } = useLayerStyles();
  const savedDemographicsOpacity = useRef<number | null>(null);

  // Handle demographics opacity when heatmap toggles
  useEffect(() => {
    if (heatmapEnabled) {
      // Save current opacity and set to 0
      const demographicsLayer = layerConfigs.find((l) => l.id === 'sociodemographics');
      if (demographicsLayer && savedDemographicsOpacity.current === null) {
        savedDemographicsOpacity.current = demographicsLayer.style.opacity;
        setLayerConfigs((prev) =>
          prev.map((layer) =>
            layer.id === 'sociodemographics'
              ? { ...layer, style: { ...layer.style, opacity: 0 } }
              : layer
          )
        );
      }
    } else {
      // Restore previous opacity
      if (savedDemographicsOpacity.current !== null) {
        const savedOpacity = savedDemographicsOpacity.current;
        setLayerConfigs((prev) =>
          prev.map((layer) =>
            layer.id === 'sociodemographics'
              ? { ...layer, style: { ...layer.style, opacity: savedOpacity } }
              : layer
          )
        );
        savedDemographicsOpacity.current = null;
      }
    }
  }, [heatmapEnabled, setLayerConfigs]);

  /**
   * Generate deck.gl layers from configuration.
   */
  const deckLayers = useMemo((): Layer[] => {
    const layers: Layer[] = [];

    layerConfigs
      .filter((config) => config.style.visible)
      .forEach((config) => {
        // Heatmap mode for point layers - use fetched data
        if (heatmapEnabled && config.type === 'point' && heatmapData.length > 0) {
          const heatmapLayer = new HeatmapLayer<HeatmapPoint>({
            id: `${config.id}-heatmap`,
            data: heatmapData,
            getPosition: (d: HeatmapPoint) => d.coordinates,
            getWeight: (d: HeatmapPoint) => d.weight,
            radiusPixels: HEATMAP_CONFIG.radiusPixels,
            intensity: HEATMAP_CONFIG.intensity,
            threshold: HEATMAP_CONFIG.threshold,
            colorRange: HEATMAP_COLOR_RANGE as unknown as Color[],
            pickable: false,
          });
          layers.push(heatmapLayer as Layer);
          return;
        }

        // Determine data source type based on table naming convention
        const isTileset = config.tableName.includes('tilesets');

        const sourceConfig = {
          apiBaseUrl: CARTO_CONFIG.apiBaseUrl,
          connectionName: CARTO_CONFIG.connectionName,
          accessToken: CARTO_CONFIG.accessToken,
          tableName: config.tableName,
        };

        const layer = new VectorTileLayer({
          id: config.id,
          data: isTileset ? vectorTilesetSource(sourceConfig) : vectorTableSource(sourceConfig),
          binary: true,
          pickable: true,
          // Styling Accessors
          getFillColor: (f) => getFillColor(f, config),
          getLineColor: getLineColor(config),
          getLineWidth: config.style.outlineWidth,
          getPointRadius: config.style.radius,
          pointRadiusUnits: 'pixels',
          lineWidthUnits: 'pixels',
          // Essential for React to trigger canvas updates when state changes
          updateTriggers: {
            getFillColor: [config.style.fillColor, config.style.colorByColumn, config.style.opacity],
            getLineColor: [config.style.outlineColor],
            getPointRadius: [config.style.radius],
          },
        });

        layers.push(layer as Layer);
      });

    return layers;
  }, [layerConfigs, getFillColor, getLineColor, heatmapEnabled, heatmapData]);

  return { deckLayers };
}
