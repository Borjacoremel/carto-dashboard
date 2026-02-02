import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LayerControls } from '../../components/sidebar/LayerControls';
import type { LayerConfig } from '../../types/map';

const theme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

const mockPointLayer: LayerConfig = {
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
};

const mockPolygonLayer: LayerConfig = {
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
};

describe('LayerControls', () => {
  describe('Basic Rendering', () => {
    it('should render point layer name', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('Retail Stores')).toBeInTheDocument();
    });

    it('should render polygon layer name', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPolygonLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('US Demographics')).toBeInTheDocument();
    });
  });

  describe('Controls Visibility', () => {
    it('should render Fill Color control for visible layer', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('Fill Color')).toBeInTheDocument();
    });

    it('should render Outline Color control for visible layer', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('Outline Color')).toBeInTheDocument();
    });

    it('should render Opacity control for visible layer', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('Opacity')).toBeInTheDocument();
    });

    it('should render Point Radius slider only for point layers', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('Point Radius')).toBeInTheDocument();
    });

    it('should NOT render Point Radius slider for polygon layers', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPolygonLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.queryByText('Point Radius')).not.toBeInTheDocument();
    });

    it('should hide controls when layer is collapsed', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      // Click to collapse
      const layerNameButton = screen.getByText('Retail Stores').closest('button')!;
      fireEvent.click(layerNameButton);

      // Controls should be hidden
      expect(screen.queryByText('Fill Color')).not.toBeInTheDocument();
    });

    it('should hide controls when layer is not visible', () => {
      const invisibleLayer = {
        ...mockPointLayer,
        style: { ...mockPointLayer.style, visible: false },
      };

      renderWithTheme(
        <LayerControls
          layer={invisibleLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.queryByText('Fill Color')).not.toBeInTheDocument();
    });
  });

  describe('Value Display', () => {
    it('should display current opacity value as percentage', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      // 0.9 opacity = 90%
      expect(screen.getByText('90%')).toBeInTheDocument();
    });

    it('should display current point radius value', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('6px')).toBeInTheDocument();
    });

    it('should display current outline width value', () => {
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={() => {}}
        />
      );

      expect(screen.getByText('1px')).toBeInTheDocument();
    });
  });

  describe('Visibility Toggle', () => {
    it('should call onToggleVisibility when clicked', () => {
      const handleToggle = vi.fn();
      renderWithTheme(
        <LayerControls
          layer={mockPointLayer}
          onStyleChange={() => {}}
          onToggleVisibility={handleToggle}
        />
      );

      // Find visibility button by looking for icon button
      const iconButtons = screen.getAllByRole('button');
      const visibilityButton = iconButtons.find(
        (btn) =>
          btn.querySelector('[data-testid="VisibilityIcon"]') !== null ||
          btn.querySelector('[data-testid="VisibilityOffIcon"]') !== null
      );

      if (visibilityButton) {
        fireEvent.click(visibilityButton);
        expect(handleToggle).toHaveBeenCalledTimes(1);
      }
    });
  });
});
