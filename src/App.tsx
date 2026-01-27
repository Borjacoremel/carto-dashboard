import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <Box 
          component="aside"
          sx={{ 
            width: 320, 
            bgcolor: 'background.paper', 
            borderRight: '1px solid rgba(255,255,255,0.1)',
            zIndex: 10
          }}
        >
        </Box>

        <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;