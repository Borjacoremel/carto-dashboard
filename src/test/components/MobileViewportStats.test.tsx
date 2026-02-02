import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material';
import { MobileViewportStats } from '../../components/mobile/MobileViewportStats';
import type { ViewportFeature } from '../../types/map';

const theme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('MobileViewportStats', () => {
  it('renders with empty features', () => {
    renderWithTheme(<MobileViewportStats features={[]} />);
    expect(screen.getByTestId('mobile-viewport-stats')).toBeInTheDocument();
  });

  it('displays store count correctly', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: { revenue: 100000 } },
      { layerId: 'retail-stores', properties: { revenue: 150000 } },
      { layerId: 'retail-stores', properties: { revenue: 200000 } },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Stores')).toBeInTheDocument();
  });

  it('displays average revenue correctly', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: { revenue: 100000 } },
      { layerId: 'retail-stores', properties: { revenue: 200000 } },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    // Avg revenue: (100000 + 200000) / 2 = 150000 = $150K
    expect(screen.getByText('$150K')).toBeInTheDocument();
  });

  it('displays population correctly', () => {
    const features: ViewportFeature[] = [
      { layerId: 'sociodemographics', properties: { population: 50000 } },
      { layerId: 'sociodemographics', properties: { population: 75000 } },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    // Total pop: 125000 = 125.0K (formatNumber uses toFixed(1))
    expect(screen.getByText('125.0K')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
  });

  it('displays average income correctly', () => {
    const features: ViewportFeature[] = [
      { layerId: 'sociodemographics', properties: { median_income: 60000 } },
      { layerId: 'sociodemographics', properties: { median_income: 80000 } },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    // Avg income: (60000 + 80000) / 2 = 70000 = $70K
    expect(screen.getByText('$70K')).toBeInTheDocument();
  });

  it('handles mixed layer types', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: { revenue: 500000 } },
      { layerId: 'sociodemographics', properties: { population: 100000, median_income: 50000 } },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 store
    expect(screen.getByText('$500K')).toBeInTheDocument(); // Avg revenue
    expect(screen.getByText('100.0K')).toBeInTheDocument(); // Population (formatNumber uses toFixed(1))
    expect(screen.getByText('$50K')).toBeInTheDocument(); // Avg income
  });

  it('shows loading indicator when isLoading is true', () => {
    renderWithTheme(<MobileViewportStats features={[]} isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles features with missing properties', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: {} },
      { layerId: 'sociodemographics', properties: {} },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    expect(screen.getByTestId('mobile-viewport-stats')).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    const features: ViewportFeature[] = [
      { layerId: 'sociodemographics', properties: { population: 5000000 } },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    // formatNumber uses toFixed(1) so 5M becomes 5.0M
    expect(screen.getByText('5.0M')).toBeInTheDocument();
  });

  it('formats large currency correctly', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: { revenue: 2500000 } },
    ];

    renderWithTheme(<MobileViewportStats features={features} />);
    expect(screen.getByText('$2.5M')).toBeInTheDocument();
  });
});
