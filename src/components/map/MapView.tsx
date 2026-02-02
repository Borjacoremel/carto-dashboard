import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { INITIAL_VIEW_STATE, BASEMAP_STYLE } from '../../config/carto';
import type { MapViewState, Layer, PickingInfo } from '@deck.gl/core';
import { Box } from '@mui/material';
import { MapTooltip } from './MapTooltip';
import { ViewportStats } from './ViewportStats';
import type { TooltipInfo, ViewportFeature } from '../../types/map';
import { useThrottledCallback } from '../../hooks/useThrottledCallback';

const VIEW_STATE_STORAGE_KEY = 'carto-dashboard:view-state';
const VIEWPORT_STATS_THROTTLE_MS = 500;

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
}

function MapViewComponent({ layers }: MapViewProps) {
  const [viewState, setViewState] = useState<MapViewState>(loadPersistedViewState);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [viewportFeatures, setViewportFeatures] = useState<ViewportFeature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
  const deckRef = useRef<any>(null);

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

  // Throttled viewport feature picking for performance
  const updateViewportFeatures = useThrottledCallback(
    (deck: any) => {
      if (!deck) return;

      const features: ViewportFeature[] = [];
      const pickOptions = {
        x: 0,
        y: 0,
        width: deck.width,
        height: deck.height,
      };

      try {
        const pickedObjects = deck.pickObjects(pickOptions);
        for (const picked of pickedObjects) {
          if (picked.object && picked.layer) {
            const obj = picked.object as { properties?: Record<string, unknown> };
            if (obj.properties) {
              features.push({
                layerId: picked.layer.id,
                properties: obj.properties,
              });
            }
          }
        }
      } catch {
        // Picking may fail during transitions
      }

      setViewportFeatures(features);
      setIsLoadingFeatures(false);
    },
    VIEWPORT_STATS_THROTTLE_MS
  );

  const handleAfterRender = useCallback(
    ({ deck }: { deck: any }) => {
      if (!deck) return;
      setIsLoadingFeatures(true);
      updateViewportFeatures(deck);
    },
    [updateViewportFeatures]
  );

  const handleViewStateChange = useCallback(({ viewState }: { viewState: MapViewState }) => {
    setViewState(viewState);
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
        onAfterRender={handleAfterRender}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      >
        <Map mapStyle={BASEMAP_STYLE} reuseMaps />
      </DeckGL>
    ),
    [viewState, layers, handleHover, handleAfterRender, handleViewStateChange]
  );

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', bgcolor: '#000' }}>
      {deck}
      {tooltip && <MapTooltip tooltip={tooltip} />}
      <ViewportStats features={viewportFeatures} isLoading={isLoadingFeatures} />
    </Box>
  );
}

// Memoize the component to prevent unnecessary re-renders
const MapView = memo(MapViewComponent);
export default MapView;