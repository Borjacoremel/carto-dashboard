import { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Whatshot from '@mui/icons-material/Whatshot';
import { usePrefetchHeatmap } from '../../hooks/useCartoQuery';

interface HeatmapToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const HeatmapToggle = memo(function HeatmapToggle({ enabled, onToggle }: HeatmapToggleProps) {
  const prefetchHeatmap = usePrefetchHeatmap();

  // Prefetch heatmap data on hover for instant toggle experience
  const handleMouseEnter = () => {
    if (!enabled) {
      prefetchHeatmap();
    }
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      sx={{
        position: 'absolute',
        bottom: 24,
        right: 16,
        zIndex: 10,
        bgcolor: 'rgba(30, 35, 45, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 3,
        p: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Whatshot
          sx={{ fontSize: 18, color: enabled ? 'warning.main' : 'text.secondary' }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, cursor: 'pointer' }}
          onClick={() => onToggle(!enabled)}
        >
          Heatmap
        </Typography>
        <Switch checked={enabled} onChange={(e) => onToggle(e.target.checked)} size="small" />
      </Box>
    </Box>
  );
});
