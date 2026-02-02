// @ts-nocheck
import { FlyToInterpolator } from '@deck.gl/core';

export const CARTO_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_CARTO_API_BASE_URL,
  accessToken: import.meta.env.VITE_CARTO_ACCESS_TOKEN,
  connectionName: import.meta.env.VITE_CARTO_CONNECTION_NAME,
} as const;

export const INITIAL_VIEW_STATE = {
  longitude: -98,
  latitude: 39,
  zoom: 4,
  pitch: 0,
  bearing: 0,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
};

export const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';