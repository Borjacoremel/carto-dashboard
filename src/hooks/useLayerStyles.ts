import { useCallback } from 'react';
import type { Color } from '@deck.gl/core';
import type { LayerConfig } from '../types/map';
import { COLOR_RAMP_VIRIDIS, COLOR_RAMP_COLORBLIND_SAFE, DATA_THRESHOLDS } from '../config/constants';

export type ColorPaletteMode = 'default' | 'colorblind-safe';

/**
 * Helper: Converts hex string (#ffffff) to a [R, G, B, A] Color tuple 
 * compatible with deck.gl v9 requirements.
 */
export function hexToRgba(hex: string, alpha: number = 255): Color {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, alpha];
}

/**
 * Get the color ramp based on palette mode preference.
 */
function getColorRamp(paletteMode: ColorPaletteMode): readonly (readonly number[])[] {
  return paletteMode === 'colorblind-safe' ? COLOR_RAMP_COLORBLIND_SAFE : COLOR_RAMP_VIRIDIS;
}

/**
 * Get thresholds for a given column name.
 * Returns appropriate thresholds based on data type.
 */
function getThresholdsForColumn(columnName: string): readonly number[] {
  if (columnName in DATA_THRESHOLDS) {
    return DATA_THRESHOLDS[columnName as keyof typeof DATA_THRESHOLDS];
  }
  return DATA_THRESHOLDS.default;
}

/**
 * Apply a color ramp based on value and thresholds.
 */
function applyColorRamp(
  value: number,
  thresholds: readonly number[],
  colorRamp: readonly (readonly number[])[],
  alpha: number
): Color {
  let idx = 0;
  thresholds.forEach((t, i) => {
    if (value >= t) idx = i + 1;
  });

  const color = colorRamp[idx] || colorRamp[0];
  return [color[0], color[1], color[2], alpha] as Color;
}

export interface UseLayerStylesOptions {
  /** Color palette mode - 'default' for standard Viridis, 'colorblind-safe' for accessible palette */
  paletteMode?: ColorPaletteMode;
}

export interface UseLayerStylesReturn {
  getFillColor: (feature: unknown, config: LayerConfig) => Color;
  getLineColor: (config: LayerConfig) => Color;
}

/**
 * Hook for computing layer styles and colors.
 * 
 * Responsibilities:
 * - Color computation based on data values
 * - Hex to RGBA conversion
 * - Quantile-based color mapping
 * - Support for colorblind-safe palette
 * 
 * @param options - Configuration options including palette mode
 */
export function useLayerStyles(options: UseLayerStylesOptions = {}): UseLayerStylesReturn {
  const { paletteMode = 'default' } = options;
  const colorRamp = getColorRamp(paletteMode);

  /**
   * Compute fill color for a feature based on layer configuration.
   * Implements quantile-based coloring for business data visualization.
   */
  const getFillColor = useCallback((feature: unknown, config: LayerConfig): Color => {
    const { colorByColumn, fillColor, opacity } = config.style;
    const alpha = Math.round(opacity * 255);

    // Use base color if no specific column is selected for styling
    if (!colorByColumn) {
      return hexToRgba(fillColor, alpha);
    }

    // Type assertion for feature properties
    const f = feature as { properties?: Record<string, unknown> };
    const value = (f.properties?.[colorByColumn] as number) ?? 0;

    // Get appropriate thresholds for this column
    const thresholds = getThresholdsForColumn(colorByColumn);

    // Apply color ramp based on palette mode
    return applyColorRamp(value, thresholds, colorRamp, alpha);
  }, [colorRamp]);

  /**
   * Compute line/outline color for a layer.
   */
  const getLineColor = useCallback((config: LayerConfig): Color => {
    return hexToRgba(config.style.outlineColor, 255);
  }, []);

  return {
    getFillColor,
    getLineColor,
  };
}
