/**
 * Centralized test utilities for consistent testing patterns.
 * 
 * This module provides reusable test helpers, mocks, and wrapper components
 * to reduce boilerplate and ensure consistency across test files.
 */

import React, { type ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { vi, type Mock } from 'vitest';

/**
 * Default theme for testing
 */
const testTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

/**
 * Creates a new QueryClient configured for testing.
 * Disables retries and caching for predictable test behavior.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface TestProviderProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

/**
 * Wrapper component that provides all necessary context providers for testing.
 * Includes: QueryClientProvider, ThemeProvider, CssBaseline
 */
export function TestProviders({ children, queryClient }: TestProviderProps): React.ReactElement {
  const client = queryClient ?? createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={testTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

/**
 * Custom render function that wraps components with all necessary providers.
 * Use this instead of @testing-library/react's render for component tests.
 * 
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<MyComponent />);
 * ```
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { queryClient, ...renderOptions } = options;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders queryClient={queryClient}>{children}</TestProviders>
  );

  return render(ui, { wrapper, ...renderOptions });
}

/**
 * Creates a mock for window.matchMedia with controllable match state.
 * Essential for testing responsive components.
 * 
 * @param matches - Whether the media query should match
 * @returns Mock implementation of matchMedia
 * 
 * @example
 * ```tsx
 * beforeEach(() => {
 *   vi.stubGlobal('matchMedia', createMediaQueryMock(false));
 * });
 * ```
 */
export function createMediaQueryMock(matches: boolean): Mock {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/**
 * Creates a mock for localStorage with basic functionality.
 * Useful for testing components that persist state.
 * 
 * @example
 * ```tsx
 * const mockStorage = createLocalStorageMock();
 * vi.stubGlobal('localStorage', mockStorage);
 * ```
 */
export function createLocalStorageMock(): Storage {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
}

/**
 * Creates a mock ResizeObserver for testing.
 * Already set up globally in setup.ts, but available for specific overrides.
 */
export function createResizeObserverMock(): typeof ResizeObserver {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof ResizeObserver;
}

/**
 * Mock layer configuration for testing layer-related components.
 */
export const mockLayerConfig = {
  id: 'test-layer',
  name: 'Test Layer',
  tableName: 'test-table',
  type: 'polygon' as const,
  style: {
    fillColor: '#4ECDC4',
    outlineColor: '#ffffff',
    outlineWidth: 1,
    radius: 6,
    colorByColumn: null,
    visible: true,
    opacity: 0.8,
  },
  columns: [{ name: 'population', type: 'number' as const }],
  colorByOptions: ['population', 'income'],
};

/**
 * Mock point layer configuration
 */
export const mockPointLayerConfig = {
  ...mockLayerConfig,
  id: 'test-point-layer',
  name: 'Test Point Layer',
  type: 'point' as const,
  style: {
    ...mockLayerConfig.style,
    radius: 8,
  },
};

/**
 * Mock heatmap data for testing heatmap-related functionality.
 */
export const mockHeatmapData = [
  { coordinates: [-122.4, 37.8] as [number, number], weight: 100 },
  { coordinates: [-122.5, 37.9] as [number, number], weight: 200 },
  { coordinates: [-122.3, 37.7] as [number, number], weight: 150 },
];

/**
 * Waits for a specified amount of time.
 * Useful for testing debounced or async operations.
 * 
 * @param ms - Milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flushes all pending promises in the microtask queue.
 * Useful for testing async state updates.
 */
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Type-safe helper for mocking modules with default exports.
 */
export function createMockModule<T extends Record<string, unknown>>(overrides: Partial<T> = {}): T {
  return {
    default: vi.fn(),
    ...overrides,
  } as unknown as T;
}
