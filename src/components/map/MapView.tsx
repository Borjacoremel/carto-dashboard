import { useState, useMemo, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { INITIAL_VIEW_STATE, BASEMAP_STYLE } from '../../config/carto';
import type { MapViewState, Layer, PickingInfo } from '@deck.gl/core';
import { Box } from '@mui/material';
import { MapTooltip } from './MapTooltip';
import { ViewportStats } from './ViewportStats';
import type { TooltipInfo, ViewportFeature } from '../../types/map';

interface MapViewProps {
  layers: Layer[];
}

export default function MapView({ layers }: MapViewProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [viewportFeatures, setViewportFeatures] = useState<ViewportFeature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);

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

  const handleAfterRender = useCallback(
    ({ deck }: { deck: any }) => {
      if (!deck) return;

      setIsLoadingFeatures(true);

      // Get features in the current viewport
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
    []
  );

  const deck = useMemo(
    () => (
      <DeckGL
        id="deckgl-overlay"
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as MapViewState)}
        controller={true}
        layers={layers}
        onHover={handleHover}
        onAfterRender={handleAfterRender}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      >
        <Map mapStyle={BASEMAP_STYLE} reuseMaps />
      </DeckGL>
    ),
    [viewState, layers, handleHover, handleAfterRender]
  );

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', bgcolor: '#000' }}>
      {deck}
      {tooltip && <MapTooltip tooltip={tooltip} />}
      <ViewportStats features={viewportFeatures} isLoading={isLoadingFeatures} />
    </Box>
  );
}
}