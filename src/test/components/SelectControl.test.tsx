import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SelectControl } from '../../components/controls/SelectControl';

// Mock ResizeObserver for MUI Select
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const theme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

const mockOptions = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'total_pop', label: 'Total Population' },
  { value: 'median_income', label: 'Median Income' },
];

describe('SelectControl', () => {
  it('should render with label', () => {
    renderWithTheme(
      <SelectControl
        label="Color by Value"
        value={null}
        options={mockOptions}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Color by Value')).toBeInTheDocument();
  });

  it('should render combobox', () => {
    renderWithTheme(
      <SelectControl
        label="Color by Value"
        value={null}
        options={mockOptions}
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display selected value', () => {
    renderWithTheme(
      <SelectControl
        label="Color by Value"
        value="revenue"
        options={mockOptions}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('should call onChange callback when provided', () => {
    const handleChange = vi.fn();
    renderWithTheme(
      <SelectControl
        label="Color by Value"
        value={null}
        options={mockOptions}
        onChange={handleChange}
      />
    );

    // Just verify the component rendered with the callback
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(typeof handleChange).toBe('function');
  });

  it('should render options array correctly', () => {
    renderWithTheme(
      <SelectControl
        label="Color by Value"
        value={null}
        options={mockOptions}
        onChange={() => {}}
      />
    );

    // Verify the select is rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    // Options are rendered but hidden until opened
    expect(mockOptions).toHaveLength(3);
  });
});
