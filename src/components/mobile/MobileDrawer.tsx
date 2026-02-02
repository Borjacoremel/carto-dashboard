import { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Layers from '@mui/icons-material/Layers';
import Close from '@mui/icons-material/Close';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import type { LayerConfig, LayerStyle } from '../../types/map';
import { LayerControls } from '../sidebar/LayerControls';

interface MobileDrawerProps {
  layers: LayerConfig[];
  onStyleChange: (layerId: string, updates: Partial<LayerStyle>) => void;
  onToggleVisibility: (layerId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileDrawer = memo(function MobileDrawer({
  layers,
  onStyleChange,
  onToggleVisibility,
  isOpen,
  onToggle,
}: MobileDrawerProps) {
  return (
    <>
      {/* Floating toggle button when drawer is closed */}
      <Fade in={!isOpen} unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 30,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <Fab
            variant="extended"
            color="primary"
            onClick={onToggle}
            aria-label="Open layer controls"
            sx={{ gap: 1, px: 2 }}
          >
            <Layers />
            <span>Layers</span>
            <KeyboardArrowUp />
          </Fab>
        </Box>
      </Fade>

      {/* Backdrop */}
      <Fade in={isOpen} unmountOnExit>
        <Box
          onClick={onToggle}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            display: { xs: 'block', md: 'none' },
          }}
          aria-hidden="true"
        />
      </Fade>

      {/* Bottom sheet drawer */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: { xs: 'block', md: 'none' },
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Layer controls"
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px 16px 0 0',
              maxHeight: '70vh',
              overflow: 'hidden',
            }}
          >
            {/* Handle bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'action.disabled',
                }}
              />
            </Box>

            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                pb: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Layers sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Layer Controls
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({layers.filter((l) => l.style.visible).length} visible)
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={onToggle}
                aria-label="Close layer controls"
              >
                <Close />
              </IconButton>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ overflowY: 'auto', p: 2, maxHeight: 'calc(70vh - 80px)' }}>
              <Box sx={{ '& > *:not(:last-child)': { mb: 1.5 } }}>
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
          </Box>
        </Box>
      </Slide>
    </>
  );
});
