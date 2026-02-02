import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { useCartoLayers } from './hooks/useCartoLayers';
import MapView from './components/map/MapView';
import { Sidebar } from './components/sidebar/Sidebar';
import { HeatmapToggle } from './components/map/HeatmapToggle';

function App() {
  const {
    deckLayers,
    layerConfigs,
    toggleLayerVisibility,
    updateLayerStyle,
    heatmapEnabled,
    setHeatmapEnabled,
  } = useCartoLayers();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar
          layers={layerConfigs}
          onStyleChange={updateLayerStyle}
          onToggleVisibility={toggleLayerVisibility}
        />

        <Box component="main" sx={{ flexGrow: 1, position: 'relative', bgcolor: '#000' }}>
          <MapView layers={deckLayers} />
          <HeatmapToggle enabled={heatmapEnabled} onToggle={setHeatmapEnabled} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;