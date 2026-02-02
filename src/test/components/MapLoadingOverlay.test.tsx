import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  MapLoadingOverlay,
  HeatmapLoadingIndicator,
  LayerLoadingBadge,
} from '../../components/map/MapLoadingOverlay';

describe('MapLoadingOverlay', () => {
  describe('fullscreen variant', () => {
    it('renders nothing when not loading', () => {
      const { container } = render(<MapLoadingOverlay isLoading={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders overlay when loading', () => {
      render(<MapLoadingOverlay isLoading={true} />);
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });

    it('displays default message', () => {
      render(<MapLoadingOverlay isLoading={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays custom message', () => {
      render(<MapLoadingOverlay isLoading={true} message="Loading map data..." />);
      expect(screen.getByText('Loading map data...')).toBeInTheDocument();
    });

    it('renders spinner', () => {
      render(<MapLoadingOverlay isLoading={true} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('inline variant', () => {
    it('renders nothing when not loading', () => {
      const { container } = render(<MapLoadingOverlay isLoading={false} variant="inline" />);
      expect(container.firstChild).toBeNull();
    });

    it('renders inline progress bar when loading', () => {
      render(<MapLoadingOverlay isLoading={true} variant="inline" />);
      expect(screen.getByTestId('loading-overlay-inline')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});

describe('HeatmapLoadingIndicator', () => {
  it('renders nothing when not loading', () => {
    const { container } = render(<HeatmapLoadingIndicator isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders indicator when loading', () => {
    render(<HeatmapLoadingIndicator isLoading={true} />);
    expect(screen.getByTestId('heatmap-loading')).toBeInTheDocument();
  });

  it('displays loading message', () => {
    render(<HeatmapLoadingIndicator isLoading={true} />);
    expect(screen.getByText('Loading heatmap data...')).toBeInTheDocument();
  });

  it('renders spinner', () => {
    render(<HeatmapLoadingIndicator isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

describe('LayerLoadingBadge', () => {
  it('renders nothing when not loading', () => {
    const { container } = render(<LayerLoadingBadge layerName="Test Layer" isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders badge when loading', () => {
    render(<LayerLoadingBadge layerName="Test Layer" isLoading={true} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
