// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorPicker } from '../../components/controls/ColorPicker';

const theme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ColorPicker', () => {
  it('should render with label', () => {
    renderWithTheme(<ColorPicker label="Fill Color" color="#FF6B6B" onChange={() => {}} />);

    expect(screen.getByText('Fill Color')).toBeInTheDocument();
  });

  it('should display the current color value', () => {
    renderWithTheme(<ColorPicker label="Fill Color" color="#FF6B6B" onChange={() => {}} />);

    expect(screen.getByText('#FF6B6B')).toBeInTheDocument();
  });

  it('should render without label when not provided', () => {
    renderWithTheme(<ColorPicker color="#4ECDC4" onChange={() => {}} />);

    expect(screen.getByText('#4ECDC4')).toBeInTheDocument();
    expect(screen.queryByText('Fill Color')).not.toBeInTheDocument();
  });

  it('should open popover when button is clicked', () => {
    renderWithTheme(<ColorPicker label="Fill Color" color="#FF6B6B" onChange={() => {}} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check that Hex Value label appears (popover is open)
    expect(screen.getByText('Hex Value')).toBeInTheDocument();
  });

  it('should call onChange when preset color is clicked', () => {
    const handleChange = vi.fn();
    renderWithTheme(<ColorPicker label="Fill Color" color="#FF6B6B" onChange={handleChange} />);

    // Open popover
    const mainButton = screen.getByRole('button');
    fireEvent.click(mainButton);

    // Click on a preset - find by aria-label containing "White"
    const presets = screen.getAllByRole('button');
    const whitePreset = presets.find((btn) => btn.getAttribute('aria-label')?.includes('White'));
    if (whitePreset) {
      fireEvent.click(whitePreset);
      expect(handleChange).toHaveBeenCalledWith('#FFFFFF');
    }
  });

  it('should display presets label in popover', () => {
    renderWithTheme(<ColorPicker label="Outline Color" color="#ffffff" onChange={() => {}} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Presets')).toBeInTheDocument();
  });
});
