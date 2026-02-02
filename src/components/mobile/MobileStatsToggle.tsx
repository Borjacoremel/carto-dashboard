import { useState, memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import BarChart from '@mui/icons-material/BarChart';
import Close from '@mui/icons-material/Close';
import type { ViewportFeature } from '../../types/map';
import { MobileViewportStats } from './MobileViewportStats';

interface MobileStatsToggleProps {
  features: ViewportFeature[];
  isLoading?: boolean;
}

export const MobileStatsToggle = memo(function MobileStatsToggle({
  features,
  isLoading,
}: MobileStatsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <Fade in={!isOpen} unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 30,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <Fab
            size="medium"
            color="secondary"
            onClick={() => setIsOpen(true)}
            aria-label="Show viewport statistics"
          >
            <BarChart />
          </Fab>
        </Box>
      </Fade>

      {/* Stats panel */}
      <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 30,
            display: { xs: 'block', md: 'none' },
          }}
          role="dialog"
          aria-modal="false"
          aria-label="Viewport statistics"
        >
          <Box
            sx={{
              bgcolor: 'rgba(30, 35, 45, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              boxShadow: 4,
              border: '1px solid',
              borderColor: 'divider',
              p: 1.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Stats
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                aria-label="Close statistics"
              >
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
            <MobileViewportStats features={features} isLoading={isLoading} />
          </Box>
        </Box>
      </Slide>
    </>
  );
});
