import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { useCartoLayers } from './hooks/useCartoLayers';
import MapView from './components/map/MapView';

function App() {
const { deckLayers } = useCartoLayers();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Box 
          component="aside"
          sx={{ 
            width: 320, 
            bgcolor: 'background.paper', 
            borderRight: '1px solid rgba(255,255,255,0.1)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            p: 2
          }}
        >
          <h2>CARTO Dashboard</h2>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, position: 'relative', bgcolor: '#000' }}>
          <MapView layers={deckLayers} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;