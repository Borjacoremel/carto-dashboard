import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layers from '@mui/icons-material/Layers';
import Info from '@mui/icons-material/Info';
import Place from '@mui/icons-material/Place';
import type { LayerConfig, LayerStyle } from '../../types/map';
import { LayerControls } from './LayerControls';

interface SidebarProps {
  layers: LayerConfig[];
  onStyleChange: (layerId: string, updates: Partial<LayerStyle>) => void;
  onToggleVisibility: (layerId: string) => void;
}

export function Sidebar({ layers, onStyleChange, onToggleVisibility }: SidebarProps) {
  return (
    <Box
      component="aside"
      sx={{
        width: 320,
        bgcolor: 'background.paper',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: 'primary.dark',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Place sx={{ fontSize: 18, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              CARTO Dashboard
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Layer Style Controls
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Data Source Info */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <strong style={{ color: 'inherit' }}>Data Sources:</strong>
        </Typography>
        <Box
          component="ul"
          sx={{ mt: 0.5, pl: 2, mb: 0, fontSize: '0.75rem', color: 'text.secondary' }}
        >
          <li>retail_stores (BigQuery Table)</li>
          <li>sociodemographics_usa (Tileset)</li>
        </Box>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* Layers Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Layers sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.625rem',
                letterSpacing: '0.05em',
              }}
            >
              Layers
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({layers.filter((l) => l.style.visible).length} visible)
            </Typography>
          </Box>

          <Box sx={{ '& > *:not(:last-child)': { mb: 1 } }}>
            {layers.map((layer) => (
              <LayerControls
                key={layer.id}
                layer={layer}
                onStyleChange={(updates) => onStyleChange(layer.id, updates)}
                onToggleVisibility={() => onToggleVisibility(layer.id)}
              />
            ))}
          </Box>
        </Box>

        {/* Instructions */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'rgba(255,255,255,0.03)',
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Info sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
            <Typography variant="caption" color="text.secondary">
              Hover over features on the map to see their attributes. Use the controls above to
              style each layer.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Powered by CARTO + deck.gl
        </Typography>
      </Box>
    </Box>
  );
}
