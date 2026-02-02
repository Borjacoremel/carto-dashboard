import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TooltipInfo } from '../../types/map';

interface MapTooltipProps {
  tooltip: TooltipInfo;
}

const DISPLAY_FIELDS: Record<string, string[]> = {
  'retail-stores': ['store_id', 'storetype', 'address', 'revenue', 'size_m2'],
  sociodemographics: ['population', 'total_pop', 'households', 'median_age', 'median_income'],
};

const LAYER_NAMES: Record<string, string> = {
  'retail-stores': 'Retail Store',
  sociodemographics: 'Census Block Group',
};

const COLUMN_LABELS: Record<string, string> = {
  store_id: 'Store ID',
  storetype: 'Store Type',
  address: 'Address',
  revenue: 'Annual Revenue',
  size_m2: 'Store Size',
  population: 'Population',
  total_pop: 'Total Population',
  households: 'Households',
  median_age: 'Median Age',
  median_income: 'Median Income',
};

export function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—';

  if (typeof value === 'number') {
    if (key.includes('revenue') || key.includes('income')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    }
    if (key.includes('age')) {
      return value.toFixed(1) + ' years';
    }
    if (key.includes('size')) {
      return `${new Intl.NumberFormat('en-US').format(value)} m²`;
    }
    return new Intl.NumberFormat('en-US').format(value);
  }

  return String(value);
}

export function formatKey(key: string): string {
  if (COLUMN_LABELS[key]) {
    return COLUMN_LABELS[key];
  }
  return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function MapTooltip({ tooltip }: MapTooltipProps) {
  if (!tooltip.object || !tooltip.layerId) return null;

  const { properties } = tooltip.object as { properties?: Record<string, unknown> };
  if (!properties) return null;

  const fieldsToShow = DISPLAY_FIELDS[tooltip.layerId] || Object.keys(properties).slice(0, 6);
  const layerName = LAYER_NAMES[tooltip.layerId] || tooltip.layerId;

  // Calculate safe position to keep tooltip on screen
  const safeX = Math.min(tooltip.x + 12, window.innerWidth - 260);
  const safeY = Math.min(tooltip.y + 12, window.innerHeight - 200);

  return (
    <Box
      data-testid="map-tooltip"
      sx={{
        position: 'absolute',
        left: Math.max(12, safeX),
        top: Math.max(12, safeY),
        pointerEvents: 'none',
        zIndex: 100,
        bgcolor: 'rgba(30, 35, 45, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 3,
        p: 1.5,
        minWidth: 180,
        maxWidth: 280,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}
      >
        {layerName}
      </Typography>
      {fieldsToShow.map((field) => {
        const value = properties[field];
        if (value === undefined) return null;
        return (
          <Box
            key={field}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              py: 0.25,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatKey(field)}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {formatValue(field, value)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
