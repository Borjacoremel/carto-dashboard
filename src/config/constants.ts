/**
 * Centralized constants for the CARTO Dashboard application.
 * Extracting magic numbers and shared values improves maintainability
 * and makes the codebase easier to configure.
 */

// ============================================================================
// LAYOUT & RESPONSIVE DESIGN
// ============================================================================

/** Mobile breakpoint in pixels - screens below this are considered mobile */
export const MOBILE_BREAKPOINT = 768;

/** Sidebar width in pixels */
export const SIDEBAR_WIDTH = 320;

/** Mobile drawer height as percentage of viewport */
export const MOBILE_DRAWER_HEIGHT = '70vh';

// ============================================================================
// MAP & VISUALIZATION DEFAULTS
// ============================================================================

/** Default map view state */
export const DEFAULT_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 4,
  pitch: 0,
  bearing: 0,
} as const;

/** Default point radius for point layers */
export const DEFAULT_POINT_RADIUS = 6;

/** Default opacity for layers */
export const DEFAULT_LAYER_OPACITY = 0.9;

/** Default outline width for layers */
export const DEFAULT_OUTLINE_WIDTH = 1;

/** Heatmap configuration */
export const HEATMAP_CONFIG = {
  radiusPixels: 50,
  intensity: 1.5,
  threshold: 0.05,
} as const;

// ============================================================================
// COLOR PALETTES
// ============================================================================

/** Standard Viridis-inspired color ramp for data visualization */
export const COLOR_RAMP_VIRIDIS = [
  [253, 231, 37], // Yellow (low)
  [94, 201, 98], // Light green
  [33, 145, 140], // Teal
  [59, 82, 139], // Blue
  [68, 1, 84], // Purple (high)
] as const;

/** Colorblind-safe palette (Okabe-Ito) */
export const COLOR_RAMP_COLORBLIND_SAFE = [
  [230, 159, 0], // Orange
  [86, 180, 233], // Sky blue
  [0, 158, 115], // Bluish green
  [240, 228, 66], // Yellow
  [0, 114, 178], // Blue
] as const;

/** Heatmap color range (yellow to red) */
export const HEATMAP_COLOR_RANGE = [
  [255, 255, 178],
  [254, 204, 92],
  [253, 141, 60],
  [240, 59, 32],
  [189, 0, 38],
] as const;

/** Default layer colors */
export const DEFAULT_COLORS = {
  retailStores: '#FF6B6B',
  demographics: '#4ECDC4',
  outline: '#ffffff',
  darkOutline: '#1e1e24',
} as const;

// ============================================================================
// DATA THRESHOLDS
// ============================================================================

/** 
 * Thresholds for color-coding data by column type.
 * Values are used to bucket data into color ranges.
 */
export const DATA_THRESHOLDS = {
  /** Revenue thresholds (in currency units) */
  revenue: [50000, 100000, 250000, 500000],
  /** Median income thresholds (in currency units) */
  median_income: [30000, 50000, 75000, 100000],
  /** Population thresholds */
  total_pop: [1000, 2500, 5000, 10000],
  population: [1000, 2500, 5000, 10000],
  /** Generic fallback thresholds */
  default: [100, 500, 1000, 5000],
} as const;

// ============================================================================
// SLIDER CONFIGURATION
// ============================================================================

/** Opacity slider configuration */
export const OPACITY_SLIDER = {
  min: 0.1,
  max: 1,
  step: 0.1,
} as const;

/** Outline width slider configuration */
export const OUTLINE_WIDTH_SLIDER = {
  min: 0,
  max: 5,
  step: 0.5,
} as const;

/** Point radius slider configuration */
export const POINT_RADIUS_SLIDER = {
  min: 2,
  max: 20,
  step: 1,
} as const;

// ============================================================================
// TIMING & PERFORMANCE
// ============================================================================

/** Debounce delay for localStorage persistence (ms) */
export const PERSISTENCE_DEBOUNCE_MS = 300;

/** Throttle delay for viewport updates (ms) */
export const VIEWPORT_UPDATE_THROTTLE_MS = 200;

/** Debounce delay for viewport stats query (ms) */
export const VIEWPORT_STATS_DEBOUNCE_MS = 300;

// ============================================================================
// CACHING (TanStack Query)
// ============================================================================

/** Default stale time for queries (5 minutes) */
export const DEFAULT_STALE_TIME_MS = 5 * 60 * 1000;

/** Default garbage collection time (30 minutes) */
export const DEFAULT_GC_TIME_MS = 30 * 60 * 1000;

/** Heatmap data stale time (10 minutes) */
export const HEATMAP_STALE_TIME_MS = 10 * 60 * 1000;

/** Heatmap data garbage collection time (1 hour) */
export const HEATMAP_GC_TIME_MS = 60 * 60 * 1000;

// ============================================================================
// STORAGE KEYS
// ============================================================================

/** LocalStorage keys for persistence */
export const STORAGE_KEYS = {
  LAYER_STYLES: 'carto-dashboard:layer-styles',
  HEATMAP_ENABLED: 'carto-dashboard:heatmap-enabled',
  VIEW_STATE: 'carto-dashboard:view-state',
} as const;

// ============================================================================
// LAYER IDENTIFIERS
// ============================================================================

/** Layer IDs used throughout the application */
export const LAYER_IDS = {
  SOCIODEMOGRAPHICS: 'sociodemographics',
  RETAIL_STORES: 'retail-stores',
} as const;

/** Data source type indicators */
export const DATA_SOURCE_TYPES = {
  /** Pattern to identify tileset data sources */
  TILESET_PATTERN: 'tilesets',
} as const;

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/** ARIA labels for common UI elements */
export const ARIA_LABELS = {
  toggleLayerVisibility: (layerName: string, isVisible: boolean) =>
    isVisible ? `Hide ${layerName} layer` : `Show ${layerName} layer`,
  expandLayerControls: (layerName: string, isExpanded: boolean) =>
    isExpanded ? `Collapse ${layerName} controls` : `Expand ${layerName} controls`,
  toggleHeatmap: (isEnabled: boolean) =>
    isEnabled ? 'Disable heatmap visualization' : 'Enable heatmap visualization',
  colorPicker: (label: string) => `Select ${label}`,
  slider: (label: string, value: string) => `${label}: ${value}`,
  openMobileDrawer: 'Open layer controls',
  closeMobileDrawer: 'Close layer controls',
} as const;
