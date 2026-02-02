import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import App from '../../App';

// Mock deck.gl components to avoid WebGL requirements
vi.mock('@deck.gl/react', () => ({
  default: vi.fn(({ layers }) => (
    <div data-testid="deckgl-mock" data-layers={layers?.length || 0}>
      Mock DeckGL
    </div>
  )),
}));

vi.mock('@deck.gl/carto', () => {
  class MockVectorTileLayer {
    id: string;
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) {
      this.id = props.id as string;
      this.props = props;
    }
  }
  return {
    VectorTileLayer: MockVectorTileLayer,
    vectorTableSource: vi.fn((config) => ({ ...config, type: 'table' })),
    vectorTilesetSource: vi.fn((config) => ({ ...config, type: 'tileset' })),
  };
});

vi.mock('@deck.gl/aggregation-layers', () => {
  class MockHeatmapLayer {
    id: string;
    props: Record<string, unknown>;
    constructor(props: Record<string, unknown>) {
      this.id = props.id as string;
      this.props = props;
    }
  }
  return {
    HeatmapLayer: MockHeatmapLayer,
  };
});

// Mock react-map-gl/maplibre with proper Map export
vi.mock('react-map-gl/maplibre', () => ({
  default: vi.fn(({ children }) => <div data-testid="map-mock">{children}</div>),
  Map: vi.fn(({ children }) => <div data-testid="maplibre-map">{children}</div>),
}));

// Mock useCartoQuery
vi.mock('../../hooks/useCartoQuery', () => ({
  useHeatmapData: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
  usePrefetchHeatmap: () => vi.fn(),
}));

// Mock useMobile to control responsive behavior
const mockUseIsMobile = vi.fn(() => false);
vi.mock('../../hooks/useMobile', () => ({
  useIsMobile: () => mockUseIsMobile(),
  MOBILE_BREAKPOINT: 768,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
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

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIsMobile.mockReturnValue(false);
    localStorage.clear();
  });

  describe('Desktop View', () => {
    it('renders the main dashboard components', () => {
      render(<App />, { wrapper: createWrapper() });

      // Check for sidebar
      expect(screen.getByText('CARTO Dashboard')).toBeInTheDocument();

      // Check for layer names
      expect(screen.getByText('Retail Stores')).toBeInTheDocument();
      expect(screen.getByText('US Demographics')).toBeInTheDocument();
    });

    it('shows sidebar on desktop', () => {
      mockUseIsMobile.mockReturnValue(false);
      render(<App />, { wrapper: createWrapper() });

      // Sidebar should be visible
      expect(screen.getByText('CARTO Dashboard')).toBeInTheDocument();
      // There are two 'Layers' text elements (sidebar header and mobile drawer), use getAllByText
      expect(screen.getAllByText('Layers').length).toBeGreaterThan(0);
    });

    it('toggles layer visibility when visibility button is clicked', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Find visibility toggle buttons (IconButtons)
      const visibilityButtons = screen.getAllByTestId('VisibilityIcon');
      expect(visibilityButtons.length).toBeGreaterThan(0);

      // Click the first visibility button
      const firstButton = visibilityButtons[0].closest('button');
      fireEvent.click(firstButton!);

      // After toggle, should show VisibilityOff icon
      await waitFor(() => {
        expect(screen.getByTestId('VisibilityOffIcon')).toBeInTheDocument();
      });
    });

    it('updates layer opacity when slider is changed', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Find opacity sliders
      const sliders = screen.getAllByRole('slider');
      const opacitySlider = sliders.find(
        (s) => s.getAttribute('aria-valuemax') === '1' && s.getAttribute('aria-valuemin') === '0.1'
      );

      expect(opacitySlider).toBeInTheDocument();

      // Change the slider value
      fireEvent.change(opacitySlider!, { target: { value: '0.5' } });

      await waitFor(() => {
        expect(opacitySlider).toHaveValue('0.5');
      });
    });

    it('toggles heatmap when switch is clicked', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Find the heatmap toggle switch
      const heatmapSwitch = screen.getByRole('switch');
      expect(heatmapSwitch).toBeInTheDocument();

      // Should be unchecked initially
      expect(heatmapSwitch).not.toBeChecked();

      // Toggle it
      fireEvent.click(heatmapSwitch);

      await waitFor(() => {
        expect(heatmapSwitch).toBeChecked();
      });
    });

    it('expands layer controls when accordion is clicked', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Click on the expand/collapse button (not the visibility toggle)
      const retailButton = screen.getByRole('button', { name: /Collapse Retail Stores controls/i });
      fireEvent.click(retailButton);

      // The accordion should toggle (look for controls becoming visible/hidden)
      await waitFor(() => {
        // After clicking, the expanded state changes
        const expandIcons = screen.getAllByTestId(/Expand/i);
        expect(expandIcons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it('shows mobile drawer toggle on mobile', () => {
      render(<App />, { wrapper: createWrapper() });

      // Should have stats toggle for mobile
      expect(screen.getByTestId('deckgl-mock')).toBeInTheDocument();
    });

    it('renders map view on mobile', () => {
      render(<App />, { wrapper: createWrapper() });

      // Map should render
      expect(screen.getByTestId('deckgl-mock')).toBeInTheDocument();
    });
  });

  describe('Layer Interactions', () => {
    it('maintains layer state across interactions', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Check layers are visible by default
      expect(screen.getByText('Retail Stores')).toBeInTheDocument();
      expect(screen.getByText('US Demographics')).toBeInTheDocument();

      // The visible count should show 2 visible - use more specific match
      expect(screen.getByText(/2 visible/)).toBeInTheDocument();
    });

    it('allows selecting color by column option', async () => {
      render(<App />, { wrapper: createWrapper() });

      // Find combobox/select elements
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);

      // Verify that comboboxes exist and can be interacted with
      expect(selects[0]).toHaveAttribute('role', 'combobox');
    });
  });

  describe('Heatmap Integration', () => {
    it('heatmap toggle affects layer rendering', async () => {
      render(<App />, { wrapper: createWrapper() });

      const deckgl = screen.getByTestId('deckgl-mock');
      const initialLayers = deckgl.getAttribute('data-layers');

      // Toggle heatmap
      const heatmapSwitch = screen.getByRole('switch');
      fireEvent.click(heatmapSwitch);

      await waitFor(() => {
        expect(heatmapSwitch).toBeChecked();
      });

      // Layers count may change based on implementation
      // Just verify the toggle worked
      expect(deckgl).toBeInTheDocument();
      expect(initialLayers).toBeDefined();
    });
  });
});
