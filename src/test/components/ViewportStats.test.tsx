import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  ViewportStats,
  formatCurrency,
  formatNumber,
  calculateStats,
} from '../../components/map/ViewportStats';
import type { ViewportFeature } from '../../types/map';

describe('ViewportStats', () => {
  describe('rendering', () => {
    it('renders nothing when features array is empty', () => {
      const { container } = render(<ViewportStats features={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when no relevant stats available', () => {
      const features: ViewportFeature[] = [
        { layerId: 'unknown-layer', properties: { foo: 'bar' } },
      ];
      const { container } = render(<ViewportStats features={features} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders store stats when retail-stores features present', () => {
      const features: ViewportFeature[] = [
        { layerId: 'retail-stores', properties: { revenue: 100000 } },
        { layerId: 'retail-stores', properties: { revenue: 200000 } },
      ];

      render(<ViewportStats features={features} />);

      expect(screen.getByTestId('viewport-stats')).toBeInTheDocument();
      expect(screen.getByText('Stores')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Avg: $150K/yr')).toBeInTheDocument();
    });

    it('renders population stats when sociodemographics features present', () => {
      const features: ViewportFeature[] = [
        { layerId: 'sociodemographics', properties: { total_pop: 5000 } },
        { layerId: 'sociodemographics', properties: { total_pop: 3000 } },
      ];

      render(<ViewportStats features={features} />);

      expect(screen.getByText('Population')).toBeInTheDocument();
      expect(screen.getByText('8.0K')).toBeInTheDocument();
      expect(screen.getByText('2 block groups')).toBeInTheDocument();
    });

    it('renders household stats when present', () => {
      const features: ViewportFeature[] = [
        { layerId: 'sociodemographics', properties: { households: 1500, total_pop: 1 } },
        { layerId: 'sociodemographics', properties: { households: 2500, total_pop: 1 } },
      ];

      render(<ViewportStats features={features} />);

      expect(screen.getByText('Households')).toBeInTheDocument();
      expect(screen.getByText('4.0K')).toBeInTheDocument();
    });

    it('renders average income when present', () => {
      const features: ViewportFeature[] = [
        { layerId: 'sociodemographics', properties: { median_income: 60000, total_pop: 1 } },
        { layerId: 'sociodemographics', properties: { median_income: 80000, total_pop: 1 } },
      ];

      render(<ViewportStats features={features} />);

      expect(screen.getByText('Avg Income')).toBeInTheDocument();
      expect(screen.getByText('$70K')).toBeInTheDocument();
    });

    it('renders all stats when all data present', () => {
      const features: ViewportFeature[] = [
        { layerId: 'retail-stores', properties: { revenue: 500000 } },
        {
          layerId: 'sociodemographics',
          properties: { total_pop: 10000, households: 3000, median_income: 75000 },
        },
      ];

      render(<ViewportStats features={features} />);

      expect(screen.getByText('Stores')).toBeInTheDocument();
      expect(screen.getByText('Population')).toBeInTheDocument();
      expect(screen.getByText('Households')).toBeInTheDocument();
      expect(screen.getByText('Avg Income')).toBeInTheDocument();
    });

    it('applies loading opacity when isLoading is true', () => {
      const features: ViewportFeature[] = [
        { layerId: 'retail-stores', properties: { revenue: 100000 } },
      ];

      render(<ViewportStats features={features} isLoading={true} />);

      const container = screen.getByTestId('viewport-stats');
      expect(container).toHaveStyle({ opacity: '0.7' });
    });

    it('applies full opacity when isLoading is false', () => {
      const features: ViewportFeature[] = [
        { layerId: 'retail-stores', properties: { revenue: 100000 } },
      ];

      render(<ViewportStats features={features} isLoading={false} />);

      const container = screen.getByTestId('viewport-stats');
      expect(container).toHaveStyle({ opacity: '1' });
    });
  });

  describe('population field handling', () => {
    it('uses population field when available', () => {
      const features: ViewportFeature[] = [
        { layerId: 'sociodemographics', properties: { population: 5000 } },
      ];

      render(<ViewportStats features={features} />);

      expect(screen.getByText('5.0K')).toBeInTheDocument();
    });

    it('falls back to total_pop when population not available', () => {
      const features: ViewportFeature[] = [
        { layerId: 'sociodemographics', properties: { total_pop: 7500 } },
      ];

      render(<ViewportStats features={features} />);

      expect(screen.getByText('7.5K')).toBeInTheDocument();
    });
  });
});

describe('formatCurrency', () => {
  it('formats millions with M suffix', () => {
    expect(formatCurrency(1500000)).toBe('$1.5M');
    expect(formatCurrency(2000000)).toBe('$2.0M');
  });

  it('formats thousands with K suffix', () => {
    expect(formatCurrency(75000)).toBe('$75K');
    expect(formatCurrency(150000)).toBe('$150K');
  });

  it('formats small numbers without suffix', () => {
    expect(formatCurrency(500)).toBe('$500');
    expect(formatCurrency(999)).toBe('$999');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('formatNumber', () => {
  it('formats millions with M suffix', () => {
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(2000000)).toBe('2.0M');
  });

  it('formats thousands with K suffix', () => {
    expect(formatNumber(5000)).toBe('5.0K');
    expect(formatNumber(45000)).toBe('45.0K');
  });

  it('formats small numbers with locale string', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(999)).toBe('999');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('calculateStats', () => {
  it('returns zero values for empty features', () => {
    const stats = calculateStats([]);

    expect(stats.totalStores).toBe(0);
    expect(stats.avgRevenue).toBe(0);
    expect(stats.totalPopulation).toBe(0);
    expect(stats.totalHouseholds).toBe(0);
    expect(stats.avgIncome).toBe(0);
    expect(stats.blockGroups).toBe(0);
  });

  it('calculates store statistics correctly', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: { revenue: 100000 } },
      { layerId: 'retail-stores', properties: { revenue: 200000 } },
      { layerId: 'retail-stores', properties: { revenue: 300000 } },
    ];

    const stats = calculateStats(features);

    expect(stats.totalStores).toBe(3);
    expect(stats.avgRevenue).toBe(200000);
  });

  it('calculates demographics statistics correctly', () => {
    const features: ViewportFeature[] = [
      {
        layerId: 'sociodemographics',
        properties: { total_pop: 1000, households: 400, median_income: 50000 },
      },
      {
        layerId: 'sociodemographics',
        properties: { total_pop: 2000, households: 600, median_income: 70000 },
      },
    ];

    const stats = calculateStats(features);

    expect(stats.totalPopulation).toBe(3000);
    expect(stats.totalHouseholds).toBe(1000);
    expect(stats.avgIncome).toBe(60000);
    expect(stats.blockGroups).toBe(2);
  });

  it('handles missing revenue values', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: { revenue: 100000 } },
      { layerId: 'retail-stores', properties: {} },
    ];

    const stats = calculateStats(features);

    expect(stats.totalStores).toBe(2);
    expect(stats.avgRevenue).toBe(50000);
  });

  it('handles non-numeric revenue values', () => {
    const features: ViewportFeature[] = [
      { layerId: 'retail-stores', properties: { revenue: 'invalid' } },
      { layerId: 'retail-stores', properties: { revenue: 100000 } },
    ];

    const stats = calculateStats(features);

    expect(stats.totalStores).toBe(2);
    expect(stats.avgRevenue).toBe(50000);
  });

  it('ignores features from unknown layers', () => {
    const features: ViewportFeature[] = [
      { layerId: 'unknown-layer', properties: { revenue: 999999 } },
      { layerId: 'retail-stores', properties: { revenue: 100000 } },
    ];

    const stats = calculateStats(features);

    expect(stats.totalStores).toBe(1);
    expect(stats.avgRevenue).toBe(100000);
  });
});
