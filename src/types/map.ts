export interface LayerStyle {
  fillColor: string;
  outlineColor: string;
  outlineWidth: number;
  radius: number;
  colorByColumn: string | null;
  visible: boolean;
  opacity: number;
}

export interface LayerConfig {
  id: string;
  name: string;
  tableName: string;
  type: 'point' | 'polygon';
  style: LayerStyle;
  columns: { name: string; type: string }[];
  colorByOptions: string[];
}

export interface HeatmapPoint {
  coordinates: [number, number];
  weight: number;
}

export interface TooltipInfo {
  x: number;
  y: number;
  object: Record<string, unknown> | null;
  layerId: string | null;
}

export interface ViewportFeature {
  layerId: string;
  properties: Record<string, unknown>;
}
}