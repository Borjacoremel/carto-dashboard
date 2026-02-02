import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useState, useCallback, useId } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#36B37E', name: 'Green' },
  { hex: '#FF8B00', name: 'Orange' },
  { hex: '#9B59B6', name: 'Purple' },
  { hex: '#E74C3C', name: 'Red' },
];

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const labelId = useId();
  const popoverId = useId();

  const handleChange = useCallback(
    (newColor: string) => {
      onChange(newColor);
    },
    [onChange]
  );

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ '& > *:not(:last-child)': { mb: 0.75 } }}>
      {label && (
        <Typography
          component="label"
          id={labelId}
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.5,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
            textTransform: 'uppercase',
            fontSize: '0.625rem',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        component="button"
        type="button"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : `Select color, current: ${color}`}
        aria-describedby={open ? popoverId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          px: 1.5,
          py: 1,
          borderRadius: 1,
          border: '2px solid transparent',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)',
          transition: 'all 0.2s',
          '&:hover': {
            background: 'rgba(255,255,255,0.1)',
          },
          '&:focus-visible': {
            outline: 'none',
            borderColor: 'primary.main',
            background: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 20,
            height: 20,
            borderRadius: 0.5,
            border: '2px solid',
            borderColor: 'rgba(255,255,255,0.3)',
            bgcolor: color,
            // Checkerboard pattern for transparency indication
            backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), 
                              linear-gradient(-45deg, #808080 25%, transparent 25%), 
                              linear-gradient(45deg, transparent 75%, #808080 75%), 
                              linear-gradient(-45deg, transparent 75%, #808080 75%)`,
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              bgcolor: color,
              borderRadius: 'inherit',
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          {color}
        </Typography>
      </Box>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { p: 1.5, width: 220 },
            role: 'dialog',
            'aria-label': `${label || 'Color'} picker`,
          },
        }}
      >
        <Box
          sx={{
            '& .react-colorful': {
              width: '100%',
              height: 150,
            },
            '& .react-colorful__saturation': {
              borderRadius: '4px 4px 0 0',
            },
            '& .react-colorful__hue': {
              height: 12,
              borderRadius: '0 0 4px 4px',
            },
            '& .react-colorful__pointer': {
              width: 16,
              height: 16,
            },
          }}
        >
          <HexColorPicker color={color} onChange={handleChange} />
        </Box>

        {/* Accessible hex input */}
        <Box sx={{ mt: 1.5 }}>
          <Typography
            component="label"
            htmlFor={`${popoverId}-hex-input`}
            variant="caption"
            sx={{
              display: 'block',
              mb: 0.5,
              color: 'text.secondary',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
            }}
          >
            Hex Value
          </Typography>
          <HexColorInput
            id={`${popoverId}-hex-input`}
            color={color}
            onChange={handleChange}
            prefixed
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.05)',
              color: 'inherit',
              fontFamily: 'monospace',
              fontSize: '14px',
              textTransform: 'uppercase',
            }}
          />
        </Box>

        {/* Preset colors with proper labels */}
        <Box sx={{ mt: 1.5 }}>
          <Typography
            component="span"
            variant="caption"
            sx={{
              display: 'block',
              mb: 0.5,
              color: 'text.secondary',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
            }}
          >
            Presets
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }} role="group" aria-label="Preset colors">
            {PRESET_COLORS.map((preset) => (
              <Box
                key={preset.hex}
                component="button"
                type="button"
                onClick={() => handleChange(preset.hex)}
                aria-label={`${preset.name} (${preset.hex})`}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 0.5,
                  border: '2px solid',
                  borderColor: color === preset.hex ? 'primary.main' : 'rgba(255,255,255,0.2)',
                  bgcolor: preset.hex,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 2px rgba(27, 169, 245, 0.4)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
