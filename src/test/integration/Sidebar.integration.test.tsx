import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { Sidebar } from '../../components/sidebar/Sidebar';
import type { LayerConfig } from '../../types/map';

// Mock layer configs for testing
const createMockLayers = (): LayerConfig[] => [
  {
    id: 'retail-stores',
    name: 'Retail Stores',
    type: 'point',
    tableName: 'carto-demo-data.demo_tables.retail_stores',
    style: {
      fillColor: '#FF6B6B',
      outlineColor: '#ffffff',
      outlineWidth: 1,
      opacity: 0.9,
      visible: true,
      radius: 6,
      colorByColumn: null,
    },
    colorByOptions: ['revenue', 'size_m2', 'storetype'],
  },
  {
    id: 'sociodemographics',
    name: 'US Demographics',
    type: 'polygon',
    tableName: 'carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup',
    style: {
      fillColor: '#4ECDC4',
      outlineColor: '#1e1e24',
      outlineWidth: 0.5,
      opacity: 0.6,
      visible: true,
      colorByColumn: 'total_pop',
    },
    colorByOptions: ['total_pop', 'median_income', 'total_pop_sum'],
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    );
  };
}

describe('Sidebar Integration Tests', () => {
  let mockLayers: LayerConfig[];
  let onStyleChange: ReturnType<typeof vi.fn>;
  let onToggleVisibility: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockLayers = createMockLayers();
    onStyleChange = vi.fn();
    onToggleVisibility = vi.fn();
  });

  it('renders all layer controls', () => {
    render(
      <Sidebar
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Retail Stores')).toBeInTheDocument();
    expect(screen.getByText('US Demographics')).toBeInTheDocument();
  });

  it('calls onToggleVisibility when visibility button is clicked', async () => {
    render(
      <Sidebar
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
      />,
      { wrapper: createWrapper() }
    );

    // Find visibility toggle buttons (IconButtons with VisibilityIcon)
    const visibilityButtons = screen.getAllByTestId('VisibilityIcon');
    const firstButton = visibilityButtons[0].closest('button');
    fireEvent.click(firstButton!);

    expect(onToggleVisibility).toHaveBeenCalledWith('retail-stores');
  });

  it('calls onStyleChange when opacity slider is changed', async () => {
    render(
      <Sidebar
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
      />,
      { wrapper: createWrapper() }
    );

    // Layers are expanded by default, find opacity sliders
    await waitFor(() => {
      expect(screen.getAllByText('Opacity').length).toBeGreaterThan(0);
    });

    // Find all sliders
    const sliders = screen.getAllByRole('slider');
    const opacitySlider = sliders.find(
      (s) => s.getAttribute('aria-valuemax') === '1' && s.getAttribute('aria-valuemin') === '0.1'
    );

    expect(opacitySlider).toBeInTheDocument();

    fireEvent.change(opacitySlider!, { target: { value: '0.5' } });

    await waitFor(() => {
      expect(onStyleChange).toHaveBeenCalled();
    });
  });

  it('shows color options for layers with colorByOptions', async () => {
    render(
      <Sidebar
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
      />,
      { wrapper: createWrapper() }
    );

    // Layers are expanded by default
    // Look for combobox elements (SelectControl)
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('shows radius control for point layers', async () => {
    render(
      <Sidebar
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
      />,
      { wrapper: createWrapper() }
    );

    // Point layer (Retail Stores) should have a radius slider
    // Look for a slider with radius-like values (min 2, max 20)
    await waitFor(() => {
      const sliders = screen.getAllByRole('slider');
      const radiusSlider = sliders.find(
        (s) => s.getAttribute('aria-valuemin') === '2' && s.getAttribute('aria-valuemax') === '20'
      );
      expect(radiusSlider).toBeInTheDocument();
    });
  });

  it('updates visibility icon when toggled', async () => {
    const { rerender } = render(
      <Sidebar
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
      />,
      { wrapper: createWrapper() }
    );

    // Initially should have VisibilityIcon (visible state)
    expect(screen.getAllByTestId('VisibilityIcon').length).toBe(2);

    // Update mock layers to have first layer hidden
    const updatedLayers = createMockLayers();
    updatedLayers[0].style.visible = false;

    rerender(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <ThemeProvider theme={theme}>
          <Sidebar
            layers={updatedLayers}
            onStyleChange={onStyleChange}
            onToggleVisibility={onToggleVisibility}
          />
        </ThemeProvider>
      </QueryClientProvider>
    );

    // Now should have VisibilityOffIcon for hidden layer
    await waitFor(() => {
      expect(screen.getByTestId('VisibilityOffIcon')).toBeInTheDocument();
    });
  });

  it('handles multiple style changes in sequence', async () => {
    render(
      <Sidebar
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
      />,
      { wrapper: createWrapper() }
    );

    // Change opacity
    const sliders = screen.getAllByRole('slider');
    const opacitySlider = sliders.find(
      (s) => s.getAttribute('aria-valuemax') === '1' && s.getAttribute('aria-valuemin') === '0.1'
    );

    fireEvent.change(opacitySlider!, { target: { value: '0.5' } });

    await waitFor(() => {
      expect(onStyleChange).toHaveBeenCalled();
    });

    // Change outline width
    const outlineSlider = sliders.find(
      (s) => s.getAttribute('aria-valuemax') === '5' && s.getAttribute('aria-valuemin') === '0'
    );

    if (outlineSlider) {
      fireEvent.change(outlineSlider, { target: { value: '2' } });

      await waitFor(() => {
        expect(onStyleChange).toHaveBeenCalledTimes(2);
      });
    }
  });
});
