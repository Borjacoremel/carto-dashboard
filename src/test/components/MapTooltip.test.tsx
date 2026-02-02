import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MapTooltip, formatValue, formatKey } from '../../components/map/MapTooltip';
import type { TooltipInfo } from '../../types/map';

describe('MapTooltip', () => {
  const mockWindowDimensions = { innerWidth: 1920, innerHeight: 1080 };

  beforeEach(() => {
    vi.stubGlobal('innerWidth', mockWindowDimensions.innerWidth);
    vi.stubGlobal('innerHeight', mockWindowDimensions.innerHeight);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('rendering', () => {
    it('renders nothing when object is null', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 100,
        object: null,
        layerId: 'retail-stores',
      };

      const { container } = render(<MapTooltip tooltip={tooltip} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when layerId is null', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 100,
        object: { properties: { store_id: '123' } },
        layerId: null,
      };

      const { container } = render(<MapTooltip tooltip={tooltip} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when object has no properties', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 100,
        object: { noProperties: true },
        layerId: 'retail-stores',
      };

      const { container } = render(<MapTooltip tooltip={tooltip} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders tooltip with retail-stores data', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 100,
        object: {
          properties: {
            store_id: 'ABC123',
            storetype: 'Supermarket',
            address: '123 Main St',
            revenue: 1500000,
            size_m2: 2500,
          },
        },
        layerId: 'retail-stores',
      };

      render(<MapTooltip tooltip={tooltip} />);

      expect(screen.getByTestId('map-tooltip')).toBeInTheDocument();
      expect(screen.getByText('Retail Store')).toBeInTheDocument();
      expect(screen.getByText('ABC123')).toBeInTheDocument();
      expect(screen.getByText('Supermarket')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('$1,500,000')).toBeInTheDocument();
      expect(screen.getByText('2,500 m²')).toBeInTheDocument();
    });

    it('renders tooltip with sociodemographics data', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 100,
        object: {
          properties: {
            population: 45000,
            households: 12000,
            median_age: 35.7,
            median_income: 75000,
          },
        },
        layerId: 'sociodemographics',
      };

      render(<MapTooltip tooltip={tooltip} />);

      expect(screen.getByText('Census Block Group')).toBeInTheDocument();
      expect(screen.getByText('45,000')).toBeInTheDocument();
      expect(screen.getByText('12,000')).toBeInTheDocument();
      expect(screen.getByText('35.7 years')).toBeInTheDocument();
      expect(screen.getByText('$75,000')).toBeInTheDocument();
    });

    it('renders tooltip with unknown layer using first 6 fields', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 100,
        object: {
          properties: {
            field1: 'value1',
            field2: 'value2',
            field3: 'value3',
            field4: 'value4',
            field5: 'value5',
            field6: 'value6',
            field7: 'value7', // This should be excluded
          },
        },
        layerId: 'unknown-layer',
      };

      render(<MapTooltip tooltip={tooltip} />);

      expect(screen.getByText('unknown-layer')).toBeInTheDocument();
      expect(screen.getByText('value1')).toBeInTheDocument();
      expect(screen.getByText('value6')).toBeInTheDocument();
      expect(screen.queryByText('value7')).not.toBeInTheDocument();
    });

    it('skips undefined fields', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 100,
        object: {
          properties: {
            store_id: 'ABC123',
            // storetype is undefined
          },
        },
        layerId: 'retail-stores',
      };

      render(<MapTooltip tooltip={tooltip} />);

      expect(screen.getByText('ABC123')).toBeInTheDocument();
      expect(screen.queryByText('Store Type')).not.toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    it('positions tooltip at hover location with offset', () => {
      const tooltip: TooltipInfo = {
        x: 100,
        y: 200,
        object: { properties: { store_id: '123' } },
        layerId: 'retail-stores',
      };

      render(<MapTooltip tooltip={tooltip} />);

      const tooltipEl = screen.getByTestId('map-tooltip');
      expect(tooltipEl).toHaveStyle({ left: '112px', top: '212px' });
    });

    it('constrains tooltip position to stay within viewport', () => {
      vi.stubGlobal('innerWidth', 300);
      vi.stubGlobal('innerHeight', 250);

      const tooltip: TooltipInfo = {
        x: 280,
        y: 200,
        object: { properties: { store_id: '123' } },
        layerId: 'retail-stores',
      };

      render(<MapTooltip tooltip={tooltip} />);

      const tooltipEl = screen.getByTestId('map-tooltip');
      // safeX = Math.min(280 + 12, 300 - 260) = Math.min(292, 40) = 40
      // safeY = Math.min(200 + 12, 250 - 200) = Math.min(212, 50) = 50
      expect(tooltipEl).toHaveStyle({ left: '40px', top: '50px' });
    });

    it('ensures minimum position of 12px from edge', () => {
      const tooltip: TooltipInfo = {
        x: -100,
        y: -100,
        object: { properties: { store_id: '123' } },
        layerId: 'retail-stores',
      };

      render(<MapTooltip tooltip={tooltip} />);

      const tooltipEl = screen.getByTestId('map-tooltip');
      expect(tooltipEl).toHaveStyle({ left: '12px', top: '12px' });
    });
  });
});

describe('formatValue', () => {
  it('returns dash for null values', () => {
    expect(formatValue('any_field', null)).toBe('—');
  });

  it('returns dash for undefined values', () => {
    expect(formatValue('any_field', undefined)).toBe('—');
  });

  it('formats revenue as currency', () => {
    expect(formatValue('revenue', 1500000)).toBe('$1,500,000');
  });

  it('formats income as currency', () => {
    expect(formatValue('median_income', 75000)).toBe('$75,000');
  });

  it('formats age with years suffix', () => {
    expect(formatValue('median_age', 35.7)).toBe('35.7 years');
  });

  it('formats size with m² suffix', () => {
    expect(formatValue('size_m2', 2500)).toBe('2,500 m²');
  });

  it('formats regular numbers with thousands separator', () => {
    expect(formatValue('population', 45000)).toBe('45,000');
  });

  it('converts non-number values to string', () => {
    expect(formatValue('address', '123 Main St')).toBe('123 Main St');
  });

  it('handles boolean values', () => {
    expect(formatValue('is_open', true)).toBe('true');
    expect(formatValue('is_open', false)).toBe('false');
  });
});

describe('formatKey', () => {
  it('returns mapped label for known keys', () => {
    expect(formatKey('store_id')).toBe('Store ID');
    expect(formatKey('median_income')).toBe('Median Income');
    expect(formatKey('size_m2')).toBe('Store Size');
  });

  it('converts unknown keys to title case', () => {
    expect(formatKey('unknown_field')).toBe('Unknown Field');
    expect(formatKey('another_test_key')).toBe('Another Test Key');
  });

  it('handles single word keys', () => {
    expect(formatKey('name')).toBe('Name');
  });
});
