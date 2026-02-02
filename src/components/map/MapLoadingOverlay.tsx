import { memo } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

interface MapLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  variant?: 'fullscreen' | 'inline';
}

export const MapLoadingOverlay = memo(function MapLoadingOverlay({
  isLoading,
  message = 'Loading...',
  variant = 'fullscreen',
}: MapLoadingOverlayProps) {
  if (!isLoading) return null;

  if (variant === 'inline') {
    return (
      <Box
        data-testid="loading-overlay-inline"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        <LinearProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      data-testid="loading-overlay"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        transition: 'opacity 0.3s ease',
      }}
    >
      <CircularProgress size={48} thickness={4} />
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
});

interface HeatmapLoadingIndicatorProps {
  isLoading: boolean;
}

export const HeatmapLoadingIndicator = memo(function HeatmapLoadingIndicator({
  isLoading,
}: HeatmapLoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <Box
      data-testid="heatmap-loading"
      sx={{
        position: 'absolute',
        bottom: 80,
        right: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'rgba(30, 35, 45, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        px: 2,
        py: 1,
      }}
    >
      <CircularProgress size={16} thickness={4} color="warning" />
      <Typography variant="caption" color="text.secondary">
        Loading heatmap data...
      </Typography>
    </Box>
  );
});

interface LayerLoadingBadgeProps {
  layerName: string;
  isLoading: boolean;
}

export const LayerLoadingBadge = memo(function LayerLoadingBadge({
  layerName: _layerName,
  isLoading,
}: LayerLoadingBadgeProps) {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        ml: 1,
      }}
    >
      <CircularProgress size={12} thickness={4} />
      <Typography variant="caption" color="text.secondary">
        Loading
      </Typography>
    </Box>
  );
});
