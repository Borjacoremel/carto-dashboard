import { memo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Store from '@mui/icons-material/Store';
import Map from '@mui/icons-material/Map';
import type { LayerConfig, LayerStyle } from '../../types/map';
import { ColorPicker } from '../controls/ColorPicker';
import { SliderControl } from '../controls/SliderControl';
import { SelectControl } from '../controls/SelectControl';

interface LayerControlsProps {
  layer: LayerConfig;
  onStyleChange: (updates: Partial<LayerStyle>) => void;
  onToggleVisibility: () => void;
}

export const LayerControls = memo(function LayerControls({
  layer,
  onStyleChange,
  onToggleVisibility,
}: LayerControlsProps) {
  const [expanded, setExpanded] = useState(true);
  const { style } = layer;

  const LayerIcon = layer.type === 'point' ? Store : Map;

  return (
    <Box
      sx={{
        bgcolor: 'rgba(255,255,255,0.03)',
        borderRadius: 1,
        p: 1.5,
        border: '1px solid',
        borderColor: style.visible ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
        opacity: style.visible ? 1 : 0.6,
        transition: 'all 0.2s',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          component="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${layer.name} controls` : `Expand ${layer.name} controls`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            textAlign: 'left',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: 'inherit',
          }}
        >
          <LayerIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }} noWrap>
            {layer.name}
          </Typography>
          {expanded ? (
            <ExpandLess sx={{ fontSize: 18, color: 'text.secondary' }} />
          ) : (
            <ExpandMore sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </Box>
        <IconButton
          size="small"
          onClick={onToggleVisibility}
          sx={{ ml: 1 }}
          aria-label={style.visible ? `Hide ${layer.name} layer` : `Show ${layer.name} layer`}
        >
          {style.visible ? (
            <Visibility sx={{ fontSize: 18 }} />
          ) : (
            <VisibilityOff sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </IconButton>
      </Box>

      {/* Controls */}
      {expanded && style.visible && (
        <Box
          sx={{
            mt: 2,
            '& > *:not(:last-child)': { mb: 2 },
            animation: 'fadeIn 0.2s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-8px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* Fill Color */}
          <ColorPicker
            label="Fill Color"
            color={style.fillColor}
            onChange={(fillColor) => onStyleChange({ fillColor })}
          />

          {/* Color by Column */}
          <SelectControl
            label="Color by Value"
            value={style.colorByColumn}
            options={layer.colorByOptions.map((col) => ({
              value: col,
              label: col
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase()),
            }))}
            onChange={(colorByColumn) => onStyleChange({ colorByColumn })}
            placeholder="None (solid color)"
          />

          {/* Opacity */}
          <SliderControl
            label="Opacity"
            value={style.opacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(opacity) => onStyleChange({ opacity })}
            formatValue={(v) => `${Math.round(v * 100)}%`}
          />

          {/* Outline Color */}
          <ColorPicker
            label="Outline Color"
            color={style.outlineColor}
            onChange={(outlineColor) => onStyleChange({ outlineColor })}
          />

          {/* Outline Width */}
          <SliderControl
            label="Outline Width"
            value={style.outlineWidth}
            min={0}
            max={5}
            step={0.5}
            onChange={(outlineWidth) => onStyleChange({ outlineWidth })}
            formatValue={(v) => `${v}px`}
          />

          {/* Radius (only for point layers) */}
          {layer.type === 'point' && (
            <SliderControl
              label="Point Radius"
              value={style.radius}
              min={2}
              max={20}
              step={1}
              onChange={(radius) => onStyleChange({ radius })}
              formatValue={(v) => `${v}px`}
            />
          )}
        </Box>
      )}
    </Box>
  );
});
