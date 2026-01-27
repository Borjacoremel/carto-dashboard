import { useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { INITIAL_VIEW_STATE, BASEMAP_STYLE } from '../../config/carto';
import type { MapViewState, Layer } from '@deck.gl/core';
import { Box } from '@mui/material';

interface MapViewProps {
  layers: Layer[];
}

export default function MapView({ layers }: MapViewProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  const deck = useMemo(() => (
    <DeckGL
      id="deckgl-overlay"
      viewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState as MapViewState)}
      controller={true}
      layers={layers}
      getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
    >
      <Map mapStyle={BASEMAP_STYLE} reuseMaps />
    </DeckGL>
  ), [viewState, layers]);

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', bgcolor: '#000' }}>
      {deck}
    </Box>
  );
}