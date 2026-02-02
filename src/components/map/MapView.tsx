import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { INITIAL_VIEW_STATE, BASEMAP_STYLE } from '../../config/carto';
import type { MapViewState, Layer, PickingInfo } from '@deck.gl/core';
import { Box } from '@mui/material';
import { MapTooltip } from './MapTooltip';
import { ViewportStats } from './ViewportStats';
import { MapLoadingOverlay } from './MapLoadingOverlay';
import { MobileStatsToggle } from '../mobile/MobileStatsToggle';
import type { TooltipInfo, ViewportFeature } from '../../types/map';

const VIEW_STATE_STORAGE_KEY = 'carto-dashboard:view-state';
const VIEWPORT_QUERY_DEBOUNCE_MS = 300;

/**
 * Load persisted view state from localStorage
 */
function loadPersistedViewState(): MapViewState {
  if (typeof window === 'undefined') return INITIAL_VIEW_STATE;

  try {
    const stored = window.localStorage.getItem(VIEW_STATE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with initial to ensure all required fields exist
      return { ...INITIAL_VIEW_STATE, ...parsed, transitionDuration: 0 };
    }
  } catch {
    // Invalid stored state
  }
  return INITIAL_VIEW_STATE;
}

interface MapViewProps {
  layers: Layer[];
  isHeatmapLoading?: boolean;
}

function MapViewComponent({ layers, isHeatmapLoading = false }: MapViewProps) {
  const [viewState, setViewState] = useState<MapViewState>(loadPersistedViewState);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [viewportFeatures, setViewportFeatures] = useState<ViewportFeature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const deckRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist view state (debounced)
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = setTimeout(() => {
      try {
        const { longitude, latitude, zoom, pitch, bearing } = viewState;
        window.localStorage.setItem(
          VIEW_STATE_STORAGE_KEY,
          JSON.stringify({ longitude, latitude, zoom, pitch, bearing })
        );
      } catch {
        // Storage unavailable
      }
    }, 500);

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, [viewState]);

  // Query viewport features using grid-based sampling
  const queryViewportFeatures = useCallback(() => {
    if (!deckRef.current?.deck || !containerRef.current) return;

    setIsLoadingFeatures(true);

    try {
      const deck = deckRef.current.deck;
      const { width, height } = containerRef.current.getBoundingClientRect();

      // Sample points across the viewport for picking (8x8 grid)
      const samplePoints: [number, number][] = [];
      const gridSize = 8;

      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          samplePoints.push([
            (x + 0.5) * (width / gridSize),
            (y + 0.5) * (height / gridSize),
          ]);
        }
      }

      // Pick objects at sample points
      const pickedObjects = samplePoints
        .map(([x, y]) => {
          try {
            return deck.pickObject({ x, y, radius: 50 });
          } catch {
            return null;
          }
        })
        .filter((info: any): info is any => info !== null && info.object !== undefined);

      // Deduplicate by creating a unique key for each feature
      const uniqueFeatures: Record<string, ViewportFeature> = {};

      pickedObjects.forEach((info: any) => {
        // CARTO VectorTileLayer stores properties directly on the object
        const props = info.object?.properties || info.object;
        if (!props || typeof props !== 'object') return;

        // Create a unique key based on layer and feature id
        const featureId =
          props.store_id ||
          props.geoid ||
          props.blockgroup ||
          props.id ||
          `${info.layer?.id}-${info.index}`;
        const layerId = info.layer?.id || 'unknown';
        const key = `${layerId}-${featureId}`;

        if (!uniqueFeatures[key]) {
          uniqueFeatures[key] = {
            layerId,
            properties: info.object?.properties || props,
          };
        }
      });

      setViewportFeatures(Object.values(uniqueFeatures));
    } catch (error) {
      console.error('Error querying viewport features:', error);
    } finally {
      setIsLoadingFeatures(false);
    }
  }, []);

  // Debounced viewport query on view state or layers change
  useEffect(() => {
    if (!isMapReady) return;

    if (queryTimeoutRef.current) {
      clearTimeout(queryTimeoutRef.current);
    }

    queryTimeoutRef.current = setTimeout(queryViewportFeatures, VIEWPORT_QUERY_DEBOUNCE_MS);

    return () => {
      if (queryTimeoutRef.current) {
        clearTimeout(queryTimeoutRef.current);
      }
    };
  }, [viewState.longitude, viewState.latitude, viewState.zoom, layers, isMapReady, queryViewportFeatures]);

  const handleHover = useCallback((info: PickingInfo) => {
    if (info.object && info.layer) {
      setTooltip({
        x: info.x,
        y: info.y,
        object: info.object as Record<string, unknown>,
        layerId: info.layer.id,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleMapLoad = useCallback(() => {
    setIsMapReady(true);
    // Initial query after map loads
    setTimeout(queryViewportFeatures, 500);
  }, [queryViewportFeatures]);

  const handleViewStateChange = useCallback((params: any) => {
    const newViewState = params.viewState;
    if (newViewState) {
      setViewState({
        longitude: newViewState.longitude,
        latitude: newViewState.latitude,
        zoom: newViewState.zoom,
        pitch: newViewState.pitch ?? 0,
        bearing: newViewState.bearing ?? 0,
      });
    }
  }, []);

  const deck = useMemo(
    () => (
      <DeckGL
        id="deckgl-overlay"
        ref={deckRef}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={true}
        layers={layers}
        onHover={handleHover}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      >
        <Map mapStyle={BASEMAP_STYLE} reuseMaps onLoad={handleMapLoad} />
      </DeckGL>
    ),
    [viewState, layers, handleHover, handleViewStateChange, handleMapLoad]
  );

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', height: '100%', width: '100%', bgcolor: '#000' }}
    >
      {deck}
      {tooltip && <MapTooltip tooltip={tooltip} />}
      {/* Desktop viewport stats */}
      <ViewportStats features={viewportFeatures} isLoading={isLoadingFeatures} />
      {/* Mobile viewport stats toggle */}
      <MobileStatsToggle features={viewportFeatures} isLoading={isLoadingFeatures} />
      <MapLoadingOverlay isLoading={!isMapReady} message="Loading map..." />
      <MapLoadingOverlay isLoading={isHeatmapLoading} variant="inline" />
    </Box>
  );
}

// Memoize the component to prevent unnecessary re-renders
const MapView = memo(MapViewComponent);
export default MapView;