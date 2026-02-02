import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material';
import { MobileDrawer } from '../../components/mobile/MobileDrawer';
import type { LayerConfig } from '../../types/map';

const theme = createTheme({ palette: { mode: 'dark' } });

const mockLayers: LayerConfig[] = [
  {
    id: 'retail-stores',
    name: 'Retail Stores',
    tableName: 'retail_stores',
    type: 'point',
    style: {
      fillColor: '#FF8B00',
      outlineColor: '#FFFFFF',
      outlineWidth: 1,
      radius: 6,
      colorByColumn: null,
      visible: true,
      opacity: 1,
    },
    columns: [],
    colorByOptions: [],
  },
  {
    id: 'sociodemographics',
    name: 'Sociodemographics',
    tableName: 'sociodemographics_usa',
    type: 'polygon',
    style: {
      fillColor: '#1BA9F5',
      outlineColor: '#FFFFFF',
      outlineWidth: 1,
      radius: 6,
      colorByColumn: null,
      visible: false,
      opacity: 0.7,
    },
    columns: [],
    colorByOptions: [],
  },
];

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('MobileDrawer', () => {
  it('renders toggle button when closed', () => {
    const onStyleChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onToggle = vi.fn();

    renderWithTheme(
      <MobileDrawer
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
        isOpen={false}
        onToggle={onToggle}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /open layer controls/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', () => {
    const onStyleChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onToggle = vi.fn();

    renderWithTheme(
      <MobileDrawer
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
        isOpen={false}
        onToggle={onToggle}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /open layer controls/i });
    fireEvent.click(toggleButton);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders drawer content when open', () => {
    const onStyleChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onToggle = vi.fn();

    renderWithTheme(
      <MobileDrawer
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    expect(screen.getByText('Layer Controls')).toBeInTheDocument();
    expect(screen.getByText('(1 visible)')).toBeInTheDocument();
  });

  it('renders close button when open', () => {
    const onStyleChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onToggle = vi.fn();

    renderWithTheme(
      <MobileDrawer
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close layer controls/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onToggle when close button is clicked', () => {
    const onStyleChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onToggle = vi.fn();

    renderWithTheme(
      <MobileDrawer
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close layer controls/i });
    fireEvent.click(closeButton);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders backdrop when open', () => {
    const onStyleChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onToggle = vi.fn();

    renderWithTheme(
      <MobileDrawer
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    // Find backdrop by aria-hidden attribute
    const backdrop = document.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
  });

  it('has proper accessibility attributes when open', () => {
    const onStyleChange = vi.fn();
    const onToggleVisibility = vi.fn();
    const onToggle = vi.fn();

    renderWithTheme(
      <MobileDrawer
        layers={mockLayers}
        onStyleChange={onStyleChange}
        onToggleVisibility={onToggleVisibility}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Layer controls');
  });
});
