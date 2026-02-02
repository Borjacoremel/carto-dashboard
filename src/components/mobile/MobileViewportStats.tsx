import { useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Fade from '@mui/material/Fade';
import Store from '@mui/icons-material/Store';
import TrendingUp from '@mui/icons-material/TrendingUp';
import People from '@mui/icons-material/People';
import Place from '@mui/icons-material/Place';
import type { ViewportFeature } from '../../types/map';
import { calculateStats, formatCurrency, formatNumber } from '../map/ViewportStats';

interface MobileViewportStatsProps {
  features: ViewportFeature[];
  isLoading?: boolean;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  show: boolean;
}

const StatItem = memo(function StatItem({ icon, label, value, bgColor, show }: StatItemProps) {
  return (
    <Fade in={show} timeout={300}>
      <Box sx={{ bgcolor: bgColor, borderRadius: 1, p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
          {icon}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', fontSize: '0.625rem' }}
          >
            {label}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Fade>
  );
});

export const MobileViewportStats = memo(function MobileViewportStats({
  features,
  isLoading,
}: MobileViewportStatsProps) {
  const stats = useMemo(() => calculateStats(features), [features]);

  return (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, minWidth: 200 }}
      data-testid="mobile-viewport-stats"
    >
      <StatItem
        icon={<Store sx={{ fontSize: 12, color: 'warning.main' }} />}
        label="Stores"
        value={String(stats.totalStores)}
        bgColor="rgba(255, 139, 0, 0.1)"
        show={stats.totalStores > 0}
      />

      <StatItem
        icon={<TrendingUp sx={{ fontSize: 12, color: 'success.main' }} />}
        label="Avg Rev"
        value={formatCurrency(stats.avgRevenue)}
        bgColor="rgba(54, 179, 126, 0.1)"
        show={stats.avgRevenue > 0}
      />

      <StatItem
        icon={<People sx={{ fontSize: 12, color: 'primary.main' }} />}
        label="Pop"
        value={formatNumber(stats.totalPopulation)}
        bgColor="rgba(27, 169, 245, 0.1)"
        show={stats.totalPopulation > 0}
      />

      <StatItem
        icon={<Place sx={{ fontSize: 12, color: 'secondary.main' }} />}
        label="Avg Inc"
        value={formatCurrency(stats.avgIncome)}
        bgColor="rgba(155, 89, 182, 0.1)"
        show={stats.avgIncome > 0}
      />

      {isLoading && (
        <Box sx={{ gridColumn: '1 / -1' }}>
          <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
        </Box>
      )}
    </Box>
  );
});
