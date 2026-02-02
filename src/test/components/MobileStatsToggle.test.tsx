import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material';
import { MobileStatsToggle } from '../../components/mobile/MobileStatsToggle';
import type { ViewportFeature } from '../../types/map';

const theme = createTheme({ palette: { mode: 'dark' } });

const mockFeatures: ViewportFeature[] = [
  {
    layerId: 'retail-stores',
    properties: { revenue: 150000, store_name: 'Store A' },
  },
  {
    layerId: 'retail-stores',
    properties: { revenue: 200000, store_name: 'Store B' },
  },
  {
    layerId: 'sociodemographics',
    properties: { population: 50000, median_income: 75000 },
  },
];

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('MobileStatsToggle', () => {
  it('renders toggle button when closed', () => {
    renderWithTheme(<MobileStatsToggle features={mockFeatures} />);

    const toggleButton = screen.getByRole('button', { name: /show viewport statistics/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('shows stats panel when toggle button is clicked', () => {
    renderWithTheme(<MobileStatsToggle features={mockFeatures} />);

    const toggleButton = screen.getByRole('button', { name: /show viewport statistics/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-viewport-stats')).toBeInTheDocument();
  });

  it('hides stats panel when close button is clicked', async () => {
    renderWithTheme(<MobileStatsToggle features={mockFeatures} />);

    // Open the panel
    const toggleButton = screen.getByRole('button', { name: /show viewport statistics/i });
    fireEvent.click(toggleButton);

    // Close the panel
    const closeButton = screen.getByRole('button', { name: /close statistics/i });
    fireEvent.click(closeButton);

    // Wait for animation to complete and stats panel to be hidden
    await waitFor(() => {
      expect(screen.queryByText('Stats')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /show viewport statistics/i })).toBeInTheDocument();
  });

  it('passes features to MobileViewportStats', () => {
    renderWithTheme(<MobileStatsToggle features={mockFeatures} />);

    const toggleButton = screen.getByRole('button', { name: /show viewport statistics/i });
    fireEvent.click(toggleButton);

    // Should show store count
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders with empty features', () => {
    renderWithTheme(<MobileStatsToggle features={[]} />);

    const toggleButton = screen.getByRole('button', { name: /show viewport statistics/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('shows loading indicator when isLoading is true', () => {
    renderWithTheme(<MobileStatsToggle features={mockFeatures} isLoading={true} />);

    const toggleButton = screen.getByRole('button', { name: /show viewport statistics/i });
    fireEvent.click(toggleButton);

    // LinearProgress should be present
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
