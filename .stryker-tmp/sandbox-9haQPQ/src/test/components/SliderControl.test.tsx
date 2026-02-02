// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SliderControl } from '../../components/controls/SliderControl';

const theme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('SliderControl', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render with label and formatted value', () => {
      renderWithTheme(
        <SliderControl
          label="Opacity"
          value={0.5}
          min={0}
          max={1}
          step={0.1}
          onChange={() => {}}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
      );

      expect(screen.getByText('Opacity')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should display formatted value for pixels', () => {
      renderWithTheme(
        <SliderControl
          label="Point Radius"
          value={10}
          min={2}
          max={20}
          step={1}
          onChange={() => {}}
          formatValue={(v) => `${v}px`}
        />
      );

      expect(screen.getByText('10px')).toBeInTheDocument();
    });

    it('should render slider element', () => {
      renderWithTheme(
        <SliderControl
          label="Outline Width"
          value={2}
          min={0}
          max={5}
          step={0.5}
          onChange={() => {}}
        />
      );

      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    it('should use default formatValue when not provided', () => {
      renderWithTheme(
        <SliderControl label="Test" value={42} min={0} max={100} onChange={() => {}} />
      );

      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('Value Updates', () => {
    it('should update display when prop value changes', () => {
      const { rerender } = renderWithTheme(
        <SliderControl
          label="Opacity"
          value={0.5}
          min={0}
          max={1}
          step={0.1}
          onChange={() => {}}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
      );

      expect(screen.getByText('50%')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <SliderControl
            label="Opacity"
            value={0.8}
            min={0}
            max={1}
            step={0.1}
            onChange={() => {}}
            formatValue={(v) => `${Math.round(v * 100)}%`}
          />
        </ThemeProvider>
      );

      expect(screen.getByText('80%')).toBeInTheDocument();
    });
  });

  describe('Debounced onChange', () => {
    it('should debounce onChange callback', () => {
      const handleChange = vi.fn();
      renderWithTheme(
        <SliderControl
          label="Opacity"
          value={0.5}
          min={0}
          max={1}
          step={0.1}
          onChange={handleChange}
          debounceMs={100}
        />
      );

      const slider = screen.getByRole('slider');

      act(() => {
        fireEvent.change(slider, { target: { value: 0.6 } });
      });

      // Should not be called immediately
      expect(handleChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle min value correctly', () => {
      renderWithTheme(
        <SliderControl
          label="Opacity"
          value={0}
          min={0}
          max={1}
          step={0.1}
          onChange={() => {}}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
      );

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle max value correctly', () => {
      renderWithTheme(
        <SliderControl
          label="Opacity"
          value={1}
          min={0}
          max={1}
          step={0.1}
          onChange={() => {}}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });
});
