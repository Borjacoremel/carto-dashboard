// @ts-nocheck
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { useCartoLayers } from './hooks/useCartoLayers';
import MapView from './components/map/MapView';
import { Sidebar } from './components/sidebar/Sidebar';

function App() {
  const { deckLayers, layerConfigs, toggleLayerVisibility, updateLayerStyle } = useCartoLayers();

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
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;