import { useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Store from '@mui/icons-material/Store';
import People from '@mui/icons-material/People';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Place from '@mui/icons-material/Place';
import type { ViewportFeature } from '../../types/map';

interface ViewportStatsProps {
  features: ViewportFeature[];
  isLoading?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  bgColor: string;
}

const StatCard = memo(function StatCard({ icon, label, value, subValue, bgColor }: StatCardProps) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(30, 35, 45, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        boxShadow: 3,
        border: '1px solid',
        borderColor: 'divider',
        p: 1.5,
        minWidth: 140,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box
          sx={{
            p: 0.75,
            borderRadius: 1,
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}
        >
          {label}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      {subValue && (
        <Typography variant="caption" color="text.secondary">
          {subValue}
        </Typography>
      )}
    </Box>
  );
});

export function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
}

export interface ViewportStatsData {
  totalStores: number;
  avgRevenue: number;
  totalPopulation: number;
  totalHouseholds: number;
  avgIncome: number;
  blockGroups: number;
}

export function calculateStats(features: ViewportFeature[]): ViewportStatsData {
  const storeFeatures = features.filter((f) => f.layerId === 'retail-stores');
  const demoFeatures = features.filter((f) => f.layerId === 'sociodemographics');

  const totalStores = storeFeatures.length;
  const totalRevenue = storeFeatures.reduce((sum, f) => {
    const revenue = f.properties?.revenue;
    return sum + (typeof revenue === 'number' ? revenue : 0);
  }, 0);
  const avgRevenue = totalStores > 0 ? totalRevenue / totalStores : 0;

  const totalPopulation = demoFeatures.reduce((sum, f) => {
    const pop = f.properties?.population ?? f.properties?.total_pop;
    return sum + (typeof pop === 'number' ? pop : 0);
  }, 0);
  const totalHouseholds = demoFeatures.reduce((sum, f) => {
    const households = f.properties?.households;
    return sum + (typeof households === 'number' ? households : 0);
  }, 0);
  const avgIncome =
    demoFeatures.length > 0
      ? demoFeatures.reduce((sum, f) => {
          const income = f.properties?.median_income;
          return sum + (typeof income === 'number' ? income : 0);
        }, 0) / demoFeatures.length
      : 0;

  return {
    totalStores,
    avgRevenue,
    totalPopulation,
    totalHouseholds,
    avgIncome,
    blockGroups: demoFeatures.length,
  };
}

const ViewportStats = memo(function ViewportStats({ features, isLoading }: ViewportStatsProps) {
  const stats = useMemo(() => calculateStats(features), [features]);

  const hasData =
    stats.totalStores > 0 ||
    stats.totalPopulation > 0 ||
    stats.totalHouseholds > 0 ||
    stats.avgIncome > 0;

  if (!hasData) return null;

  return (
    <Box
      data-testid="viewport-stats"
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: 1,
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      {stats.totalStores > 0 && (
        <StatCard
          icon={<Store sx={{ fontSize: 18, color: 'warning.main' }} />}
          label="Stores"
          value={stats.totalStores}
          subValue={`Avg: ${formatCurrency(stats.avgRevenue)}/yr`}
          bgColor="rgba(255, 139, 0, 0.15)"
        />
      )}

      {stats.totalPopulation > 0 && (
        <StatCard
          icon={<People sx={{ fontSize: 18, color: 'primary.main' }} />}
          label="Population"
          value={formatNumber(stats.totalPopulation)}
          subValue={`${stats.blockGroups} block groups`}
          bgColor="rgba(27, 169, 245, 0.15)"
        />
      )}

      {stats.totalHouseholds > 0 && (
        <StatCard
          icon={<Place sx={{ fontSize: 18, color: 'success.main' }} />}
          label="Households"
          value={formatNumber(stats.totalHouseholds)}
          bgColor="rgba(54, 179, 126, 0.15)"
        />
      )}

      {stats.avgIncome > 0 && (
        <StatCard
          icon={<TrendingUp sx={{ fontSize: 18, color: 'hsl(280, 68%, 60%)' }} />}
          label="Avg Income"
          value={formatCurrency(stats.avgIncome)}
          bgColor="rgba(155, 89, 182, 0.15)"
        />
      )}
    </Box>
  );
});

export { ViewportStats };
