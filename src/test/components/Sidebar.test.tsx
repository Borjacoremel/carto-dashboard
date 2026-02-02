import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Sidebar } from '../../components/sidebar/Sidebar';
import type { LayerConfig } from '../../types/map';

const theme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

const mockLayers: LayerConfig[] = [
  {
    id: 'retail-stores',
    name: 'Retail Stores',
    tableName: 'carto-demo-data.demo_tables.retail_stores',
    type: 'point',
    style: {
      fillColor: '#FF6B6B',
      outlineColor: '#ffffff',
      outlineWidth: 1,
      radius: 6,
      colorByColumn: null,
      visible: true,
      opacity: 0.9,
    },
    columns: [{ name: 'revenue', type: 'number' }],
    colorByOptions: ['revenue'],
  },
  {
    id: 'sociodemographics',
    name: 'US Demographics',
    tableName: 'carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup',
    type: 'polygon',
    style: {
      fillColor: '#4ECDC4',
      outlineColor: '#1e1e24',
      outlineWidth: 0.5,
      radius: 0,
      colorByColumn: 'total_pop',
      visible: true,
      opacity: 0.6,
    },
    columns: [{ name: 'total_pop', type: 'number' }],
    colorByOptions: ['total_pop', 'median_income'],
  },
];

describe('Sidebar', () => {
  it('should render the dashboard title', () => {
    renderWithTheme(
      <Sidebar layers={mockLayers} onStyleChange={() => {}} onToggleVisibility={() => {}} />
    );

    expect(screen.getByText('CARTO Dashboard')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    renderWithTheme(
      <Sidebar layers={mockLayers} onStyleChange={() => {}} onToggleVisibility={() => {}} />
    );

    expect(screen.getByText('Layer Style Controls')).toBeInTheDocument();
  });

  it('should render data source information', () => {
    renderWithTheme(
      <Sidebar layers={mockLayers} onStyleChange={() => {}} onToggleVisibility={() => {}} />
    );

    expect(screen.getByText('retail_stores (BigQuery Table)')).toBeInTheDocument();
    expect(screen.getByText('sociodemographics_usa (Tileset)')).toBeInTheDocument();
  });

  it('should render all layer names', () => {
    renderWithTheme(
      <Sidebar layers={mockLayers} onStyleChange={() => {}} onToggleVisibility={() => {}} />
    );

    expect(screen.getByText('Retail Stores')).toBeInTheDocument();
    expect(screen.getByText('US Demographics')).toBeInTheDocument();
  });

  it('should display visible layer count', () => {
    renderWithTheme(
      <Sidebar layers={mockLayers} onStyleChange={() => {}} onToggleVisibility={() => {}} />
    );

    expect(screen.getByText('(2 visible)')).toBeInTheDocument();
  });

  it('should update visible count when a layer is hidden', () => {
    const layersWithOneHidden = [
      mockLayers[0],
      { ...mockLayers[1], style: { ...mockLayers[1].style, visible: false } },
    ];

    renderWithTheme(
      <Sidebar
        layers={layersWithOneHidden}
        onStyleChange={() => {}}
        onToggleVisibility={() => {}}
      />
    );

    expect(screen.getByText('(1 visible)')).toBeInTheDocument();
  });

  it('should render footer with credit', () => {
    renderWithTheme(
      <Sidebar layers={mockLayers} onStyleChange={() => {}} onToggleVisibility={() => {}} />
    );

    expect(screen.getByText('Powered by CARTO + deck.gl')).toBeInTheDocument();
  });

  it('should render with empty layers array', () => {
    renderWithTheme(
      <Sidebar layers={[]} onStyleChange={() => {}} onToggleVisibility={() => {}} />
    );

    expect(screen.getByText('CARTO Dashboard')).toBeInTheDocument();
    expect(screen.getByText('(0 visible)')).toBeInTheDocument();
  });
});
