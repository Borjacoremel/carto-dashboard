import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { useCartoLayers } from './hooks/useCartoLayers';
import MapView from './components/map/MapView';
import { Sidebar } from './components/sidebar/Sidebar';
import { HeatmapToggle } from './components/map/HeatmapToggle';
import { HeatmapLoadingIndicator } from './components/map/MapLoadingOverlay';
import { MobileDrawer } from './components/mobile/MobileDrawer';

function App() {
  const {
    deckLayers,
    layerConfigs,
    toggleLayerVisibility,
    updateLayerStyle,
    heatmapEnabled,
    setHeatmapEnabled,
    heatmapLoading,
  } = useCartoLayers();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Desktop Sidebar - hidden on mobile */}
        <Sidebar
          layers={layerConfigs}
          onStyleChange={updateLayerStyle}
          onToggleVisibility={toggleLayerVisibility}
        />

        <Box component="main" sx={{ flexGrow: 1, position: 'relative', bgcolor: '#000' }}>
          <MapView layers={deckLayers} isHeatmapLoading={heatmapLoading} />
          <HeatmapToggle enabled={heatmapEnabled} onToggle={setHeatmapEnabled} />
          <HeatmapLoadingIndicator isLoading={heatmapLoading} />
        </Box>

        {/* Mobile Drawer - visible only on mobile */}
        <MobileDrawer
          layers={layerConfigs}
          onStyleChange={updateLayerStyle}
          onToggleVisibility={toggleLayerVisibility}
          isOpen={isMobileDrawerOpen}
          onToggle={() => setIsMobileDrawerOpen((prev) => !prev)}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;