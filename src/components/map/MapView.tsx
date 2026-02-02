import { useState, useMemo, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { INITIAL_VIEW_STATE, BASEMAP_STYLE } from '../../config/carto';
import type { MapViewState, Layer, PickingInfo } from '@deck.gl/core';
import { Box } from '@mui/material';
import { MapTooltip } from './MapTooltip';
import type { TooltipInfo } from '../../types/map';

interface MapViewProps {
  layers: Layer[];
}

export default function MapView({ layers }: MapViewProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

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

  const deck = useMemo(() => (
    <DeckGL
      id="deckgl-overlay"
      viewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState as MapViewState)}
      controller={true}
      layers={layers}
      onHover={handleHover}
      getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
    >
      <Map mapStyle={BASEMAP_STYLE} reuseMaps />
    </DeckGL>
  ), [viewState, layers, handleHover]);

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', bgcolor: '#000' }}>
      {deck}
      {tooltip && <MapTooltip tooltip={tooltip} />}
    </Box>
  );
}