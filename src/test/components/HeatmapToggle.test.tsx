import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HeatmapToggle } from '../../components/map/HeatmapToggle';

const theme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('HeatmapToggle', () => {
  it('should render the heatmap label', () => {
    renderWithTheme(<HeatmapToggle enabled={false} onToggle={() => {}} />);

    expect(screen.getByText('Heatmap')).toBeInTheDocument();
  });

  it('should render a switch', () => {
    renderWithTheme(<HeatmapToggle enabled={false} onToggle={() => {}} />);

    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('should show switch as unchecked when disabled', () => {
    renderWithTheme(<HeatmapToggle enabled={false} onToggle={() => {}} />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).not.toBeChecked();
  });

  it('should show switch as checked when enabled', () => {
    renderWithTheme(<HeatmapToggle enabled={true} onToggle={() => {}} />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).toBeChecked();
  });

  it('should call onToggle with true when switch is clicked while disabled', () => {
    const handleToggle = vi.fn();
    renderWithTheme(<HeatmapToggle enabled={false} onToggle={handleToggle} />);

    const switchEl = screen.getByRole('switch');
    fireEvent.click(switchEl);

    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('should call onToggle with false when switch is clicked while enabled', () => {
    const handleToggle = vi.fn();
    renderWithTheme(<HeatmapToggle enabled={true} onToggle={handleToggle} />);

    const switchEl = screen.getByRole('switch');
    fireEvent.click(switchEl);

    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it('should call onToggle when label text is clicked', () => {
    const handleToggle = vi.fn();
    renderWithTheme(<HeatmapToggle enabled={false} onToggle={handleToggle} />);

    const label = screen.getByText('Heatmap');
    fireEvent.click(label);

    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('should toggle to false when label clicked while enabled', () => {
    const handleToggle = vi.fn();
    renderWithTheme(<HeatmapToggle enabled={true} onToggle={handleToggle} />);

    const label = screen.getByText('Heatmap');
    fireEvent.click(label);

    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it('should render the fire icon', () => {
    renderWithTheme(<HeatmapToggle enabled={false} onToggle={() => {}} />);

    // MUI icons render as svg with data-testid
    const icon = document.querySelector('svg[data-testid="WhatshotIcon"]');
    expect(icon).toBeInTheDocument();
  });
});
