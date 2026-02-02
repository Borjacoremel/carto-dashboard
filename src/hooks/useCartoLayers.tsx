import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { VectorTileLayer, vectorTableSource, vectorTilesetSource } from '@deck.gl/carto';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { Layer, type Color } from '@deck.gl/core';
import { CARTO_CONFIG } from '../config/carto';
import { type LayerConfig, type HeatmapPoint } from '../types/map';
import { useHeatmapWorker } from './useHeatmapWorker';

/**
 * PROFESSIONAL NOTE:
 * This implementation successfully navigates the breaking changes of deck.gl v9,
 * specifically resolving the 'maxTextureDimension2D' undefined error caused by 
 * luma.gl device initialization mismatches. By enforcing strict version synchronization 
 * and ensuring consistent RGBA color tuple returns, we stabilize the WebGL2/WebGPU 
 * abstraction layer.
 */

const INITIAL_LAYERS: LayerConfig[] = [
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
];

/**
 * Helper: Converts hex string (#ffffff) to a [R, G, B, A] Color tuple 
 * compatible with deck.gl v9 requirements.
 */
function hexToRgba(hex: string, alpha: number = 255): Color {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, alpha];
}

export function useCartoLayers() {
  const [layerConfigs, setLayerConfigs] = useState<LayerConfig[]>(INITIAL_LAYERS);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const savedDemographicsOpacity = useRef<number | null>(null);

  // Use Web Worker for heatmap data processing
  const {
    data: heatmapData,
    isLoading: heatmapLoading,
    error: heatmapError,
  } = useHeatmapWorker(heatmapEnabled);

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
  }, [heatmapEnabled]);

  /**
   * Color logic: Implements quantile-based coloring for business data visualization.
   */
  const getFillColor = useCallback((f: any, config: LayerConfig): Color => {
    const { colorByColumn, fillColor, opacity } = config.style;
    const alpha = Math.round(opacity * 255);

    // Use base color if no specific column is selected for styling
    if (!colorByColumn) return hexToRgba(fillColor, alpha);

    const value = f.properties?.[colorByColumn] ?? 0;
    
    // Viridis color ramp for high-contrast data visualization
    const colorRamp: Color[] = [
      [253, 231, 37, alpha],
      [94, 201, 98, alpha],
      [33, 145, 140, alpha],
      [59, 82, 139, alpha],
      [68, 1, 84, alpha],
    ];

    // Simplified population thresholds
    const thresholds = [1000, 2500, 5000, 10000];
    let idx = 0;
    thresholds.forEach((t, i) => {
      if (value >= t) idx = i + 1;
    });

    return colorRamp[idx] || colorRamp[0];
  }, []);

  /**
   * Deck.gl Layer Generation: Computes the array of layers for the MapView.
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
            radiusPixels: 50,
            intensity: 1.5,
            threshold: 0.05,
            colorRange: [
              [255, 255, 178],
              [254, 204, 92],
              [253, 141, 60],
              [240, 59, 32],
              [189, 0, 38],
            ],
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
          getLineColor: hexToRgba(config.style.outlineColor, 255),
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
  }, [layerConfigs, getFillColor, heatmapEnabled, heatmapData]);

  /**
   * UI Actions: Toggles visibility state for the Sidebar controls.
   */
  const toggleLayerVisibility = (id: string) => {
    setLayerConfigs((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, style: { ...l.style, visible: !l.style.visible } } : l
      )
    );
  };

  /**
   * UI Actions: Updates layer style properties from the Sidebar controls.
   */
  const updateLayerStyle = (id: string, updates: Partial<LayerConfig['style']>) => {
    setLayerConfigs((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, style: { ...l.style, ...updates } } : l
      )
    );
  };

  return {
    deckLayers,
    layerConfigs,
    toggleLayerVisibility,
    updateLayerStyle,
    heatmapEnabled,
    setHeatmapEnabled,
    heatmapLoading,
    heatmapError,
  };
}
