import { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  debounceMs?: number;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => v.toString(),
  debounceMs = 16,
}: SliderControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (newValue: number) => {
      setLocalValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
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
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            color: 'primary.main',
            fontWeight: 500,
          }}
        >
          {formatValue(localValue)}
        </Typography>
      </Box>
      <Slider
        value={localValue}
        min={min}
        max={max}
        step={step}
        onChange={(_, v) => handleChange(v as number)}
        size="small"
      />
    </Box>
  );
}
