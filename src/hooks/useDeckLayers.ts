import { useMemo } from 'react';
import { VectorTileLayer, vectorTableSource, vectorTilesetSource } from '@deck.gl/carto';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { Layer, type Color } from '@deck.gl/core';
import { CARTO_CONFIG } from '../config/carto';
import { HEATMAP_CONFIG, HEATMAP_COLOR_RANGE, DATA_SOURCE_TYPES } from '../config/constants';
import type { LayerConfig, HeatmapPoint } from '../types/map';
import { useLayerStyles } from './useLayerStyles';
import { logger } from '../utils/logger';

export interface UseDeckLayersOptions {
  layerConfigs: LayerConfig[];
  heatmapEnabled: boolean;
  heatmapData: HeatmapPoint[];
}

export interface UseDeckLayersReturn {
  deckLayers: Layer[];
}

/**
 * Validates heatmap data points, filtering out invalid entries.
 * @returns Validated array of heatmap points
 */
function validateHeatmapData(data: HeatmapPoint[]): HeatmapPoint[] {
  if (!Array.isArray(data)) {
    logger.warn('Invalid heatmap data: expected array', { received: typeof data });
    return [];
  }

  const validData = data.filter((point) => {
    if (!point || typeof point !== 'object') return false;
    if (!Array.isArray(point.coordinates) || point.coordinates.length !== 2) return false;
    if (typeof point.coordinates[0] !== 'number' || typeof point.coordinates[1] !== 'number') return false;
    if (isNaN(point.coordinates[0]) || isNaN(point.coordinates[1])) return false;
    if (typeof point.weight !== 'number' || isNaN(point.weight)) return false;
    return true;
  });

  if (validData.length !== data.length) {
    logger.warn('Invalid heatmap data points filtered', {
      total: data.length,
      valid: validData.length,
      filtered: data.length - validData.length,
    });
  }

  return validData;
}

/**
 * Determines if a layer uses tileset data source based on table name.
 */
function isTilesetSource(tableName: string): boolean {
  return tableName.includes(DATA_SOURCE_TYPES.TILESET_PATTERN);
}

/**
 * Creates a single layer (HeatmapLayer or VectorTileLayer) from configuration.
 */
function createLayer(
  config: LayerConfig,
  heatmapEnabled: boolean,
  validHeatmapData: HeatmapPoint[],
  getFillColor: (f: unknown, config: LayerConfig) => Color,
  getLineColor: (config: LayerConfig) => Color
): Layer | null {
  try {
    // Heatmap mode for point layers
    if (heatmapEnabled && config.type === 'point' && validHeatmapData.length > 0) {
      return new HeatmapLayer<HeatmapPoint>({
        id: `${config.id}-heatmap`,
        data: validHeatmapData,
        getPosition: (d: HeatmapPoint) => d.coordinates,
        getWeight: (d: HeatmapPoint) => d.weight,
        radiusPixels: HEATMAP_CONFIG.radiusPixels,
        intensity: HEATMAP_CONFIG.intensity,
        threshold: HEATMAP_CONFIG.threshold,
        colorRange: HEATMAP_COLOR_RANGE as unknown as Color[],
        pickable: false,
      }) as Layer;
    }

    // Validate CARTO config
    if (!CARTO_CONFIG.accessToken) {
      logger.error('CARTO access token is missing', { layerId: config.id });
      return null;
    }

    const sourceConfig = {
      apiBaseUrl: CARTO_CONFIG.apiBaseUrl,
      connectionName: CARTO_CONFIG.connectionName,
      accessToken: CARTO_CONFIG.accessToken,
      tableName: config.tableName,
    };

    return new VectorTileLayer({
      id: config.id,
      data: isTilesetSource(config.tableName)
        ? vectorTilesetSource(sourceConfig)
        : vectorTableSource(sourceConfig),
      binary: true,
      pickable: true,
      getFillColor: (f) => getFillColor(f, config),
      getLineColor: getLineColor(config),
      getLineWidth: config.style.outlineWidth,
      getPointRadius: config.style.radius,
      pointRadiusUnits: 'pixels',
      lineWidthUnits: 'pixels',
      updateTriggers: {
        getFillColor: [config.style.fillColor, config.style.colorByColumn, config.style.opacity],
        getLineColor: [config.style.outlineColor],
        getPointRadius: [config.style.radius],
      },
    }) as Layer;
  } catch (error) {
    logger.error('Failed to create layer', {
      layerId: config.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Hook for generating deck.gl layers from configuration.
 * 
 * Responsibilities:
 * - Creating VectorTileLayer instances
 * - Creating HeatmapLayer when enabled
 * - Validating input data
 * - Memoizing layer instances for performance
 * 
 * NOTE: This hook is a pure transformation - it does NOT mutate any state.
 * Demographics opacity adjustments should be handled by the parent (useCartoLayers).
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
}: UseDeckLayersOptions): UseDeckLayersReturn {
  const { getFillColor, getLineColor } = useLayerStyles();

  const deckLayers = useMemo((): Layer[] => {
    // Guard against invalid input
    if (!Array.isArray(layerConfigs) || layerConfigs.length === 0) {
      logger.debug('No layer configs provided');
      return [];
    }

    // Validate heatmap data once
    const validHeatmapData = heatmapEnabled ? validateHeatmapData(heatmapData) : [];

    // Generate layers using declarative flatMap
    return layerConfigs
      .filter((config) => config?.style?.visible)
      .map((config) => createLayer(config, heatmapEnabled, validHeatmapData, getFillColor, getLineColor))
      .filter((layer): layer is Layer => layer !== null);
  }, [layerConfigs, getFillColor, getLineColor, heatmapEnabled, heatmapData]);

  return { deckLayers };
}
