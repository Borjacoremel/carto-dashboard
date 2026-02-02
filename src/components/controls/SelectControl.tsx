import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

interface SelectControlProps {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  allowNone?: boolean;
}

export function SelectControl({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  allowNone = true,
}: SelectControlProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          mb: 0.75,
          display: 'block',
          color: 'text.secondary',
          fontWeight: 500,
          textTransform: 'uppercase',
          fontSize: '0.625rem',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={value || 'none'}
          onChange={(e) => onChange(e.target.value === 'none' ? null : e.target.value)}
          displayEmpty
          sx={{
            bgcolor: 'rgba(255,255,255,0.05)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          {allowNone && (
            <MenuItem value="none">
              <Typography variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            </MenuItem>
          )}
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
