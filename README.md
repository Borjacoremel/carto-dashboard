# CARTO Dashboard

A production-ready geospatial visualization dashboard built with React 19, deck.gl v9, and CARTO. This application demonstrates modern frontend architecture patterns for rendering large-scale map data with interactive layer controls.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19-blue)
![deck.gl](https://img.shields.io/badge/deck.gl-9.2-green)
![Vite](https://img.shields.io/badge/Vite-6.3-purple)

## Features

- **Interactive Map Visualization** - Pan, zoom, and explore US demographic data and retail store locations
- **Dynamic Layer Styling** - Real-time control of colors, opacity, outlines, and data-driven coloring
- **Heatmap Toggle** - Switch between point markers and heatmap visualization for density analysis
- **Responsive Design** - Full desktop sidebar and mobile drawer interface
- **State Persistence** - Layer styles and view state saved to localStorage
- **Accessible** - WCAG-compliant with proper ARIA labels and keyboard navigation

---

## Architecture

### Hook Composition Pattern

The application uses a **facade pattern** for state management, composing focused hooks into a unified API:

```
useCartoLayers (facade)
├── useLayerState      → Layer configuration + persistence
├── useLayerStyles     → Color computation + hex-to-RGBA conversion
├── useDeckLayers      → deck.gl layer generation (pure transformation)
└── useHeatmapData     → TanStack Query cached data fetching
```

**Why this pattern?**
- **Testability**: Each hook can be unit tested in isolation
- **Single Responsibility**: Clear separation of concerns
- **Pure Transformations**: `useDeckLayers` has no side effects, making it predictable
- **Derived State**: Heatmap opacity adjustments computed via `useMemo`, not state mutations

### Project Structure

```
src/
├── components/
│   ├── controls/          # Reusable form controls (ColorPicker, Slider, Select)
│   ├── map/               # Map-related components (MapView, Tooltip, HeatmapToggle)
│   ├── mobile/            # Mobile-specific components (Drawer, Stats)
│   └── sidebar/           # Desktop sidebar (LayerControls)
├── config/
│   ├── carto.ts           # CARTO API configuration
│   └── constants.ts       # Centralized constants (no magic numbers)
├── hooks/
│   ├── useCartoLayers.tsx # Main facade hook
│   ├── useLayerState.ts   # State management + localStorage persistence
│   ├── useLayerStyles.ts  # Color computation logic
│   ├── useDeckLayers.ts   # deck.gl layer factory
│   └── useCartoQuery.ts   # TanStack Query data fetching
├── test/
│   ├── integration/       # Integration tests
│   └── utils.tsx          # Test utilities and mocks
├── types/
│   └── map.ts             # TypeScript interfaces
└── utils/
    └── logger.ts          # Structured logging utility
```

---

## Technical Decisions

### deck.gl v9 + CARTO Integration

deck.gl v9 introduced breaking changes with luma.gl device initialization. This project resolves the common `maxTextureDimension2D undefined` error by:

1. Strict version synchronization across all `@deck.gl/*` packages
2. Using `VectorTileLayer` with `binary: true` for optimal performance
3. Proper `updateTriggers` configuration for React state-driven style updates

### State Management Strategy

| Concern | Solution | Rationale |
|---------|----------|-----------|
| Server state | TanStack Query | Caching, background refetch, stale-while-revalidate |
| UI state | React `useState` | Simple, colocated with components |
| Persistence | localStorage + debounce | Offline support, 300ms debounce prevents thrashing |
| Derived state | `useMemo` | Avoids state mutation anti-patterns |

### Why Not Redux/Zustand?

The application's state is:
- Primarily **server-driven** (handled by TanStack Query)
- **Component-local** (layer controls affect only the map)
- **Derivable** (heatmap adjustments computed, not stored)

Adding a global store would increase complexity without benefit.

### Error Handling

```typescript
// Validation before layer creation
const validHeatmapData = validateHeatmapData(heatmapData);

// Graceful degradation with logging
if (!CARTO_CONFIG.accessToken) {
  logger.error('CARTO access token is missing', { layerId: config.id });
  return null;
}
```

Invalid data is filtered with structured logging for observability.

### Accessibility

- All interactive elements have `aria-label` attributes
- Expand/collapse buttons use `aria-expanded`
- Color inputs have proper labels
- Mobile drawer uses proper focus management

### Testing Strategy

The project implements a **multi-layered testing approach**:

```
┌─────────────────────────────────────────────────┐
│           Mutation Testing (Stryker)            │  ← Validates test quality
├─────────────────────────────────────────────────┤
│              Integration Tests                   │  ← User flows & hook composition
├─────────────────────────────────────────────────┤
│                 Unit Tests                       │  ← Individual hooks & utilities
└─────────────────────────────────────────────────┘
```

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit Tests** | Vitest + React Testing Library | Test hooks and components in isolation |
| **Integration Tests** | Vitest + RTL | Test component interactions and user flows |
| **Mutation Testing** | Stryker Mutator | Verify test suite catches real bugs |

**Why Stryker Mutation Testing?**

Traditional coverage metrics only show which lines are executed, not whether tests would catch bugs. Stryker introduces small mutations (e.g., `>` → `>=`, `true` → `false`) and verifies tests fail. A high mutation score means tests are actually validating behavior, not just running code.

```bash
# Run mutation testing
pnpm test:mutation
```

**What's Not Included (and Why)**

- **E2E Tests (Playwright/Cypress)**: For a production application, E2E tests would validate the full user journey including map interactions. They were omitted here to focus on demonstrating architecture patterns, but the component structure is E2E-ready.
- **Visual Regression**: Would be valuable for map styling consistency, but requires CI infrastructure with screenshot comparison.

**Test Utilities**

Centralized test helpers in `src/test/utils.tsx`:

```typescript
// Render with all providers (QueryClient, Theme)
renderWithProviders(<Component />);

// Mock responsive breakpoints
vi.stubGlobal('matchMedia', createMediaQueryMock(false));

// Mock localStorage
vi.stubGlobal('localStorage', createLocalStorageMock());
```

---

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone [<repository-url>](https://github.com/Borjacoremel/carto-dashboard)
cd carto-dashboard

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with your CARTO credentials:

```env
VITE_CARTO_API_BASE_URL=https://gcp-us-east1.api.carto.com
VITE_CARTO_ACCESS_TOKEN=your_carto_access_token
VITE_CARTO_CONNECTION_NAME=carto_dw
```

### Development

```bash
# Start development server
pnpm dev

# Run type checking
pnpm typecheck

# Run linter
pnpm lint

# Format code
pnpm format
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With UI
pnpm test:ui

# Coverage report
pnpm coverage

# Mutation testing
pnpm test:mutation
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Data Sources

The dashboard visualizes two CARTO datasets:

| Layer | Type | Source |
|-------|------|--------|
| US Demographics | Polygon (Tileset) | `sociodemographics_usa_blockgroup` |
| Retail Stores | Point (Table) | `retail_stores` |

Demographics support color-by-value for `total_pop` and `median_income`.
Retail stores support color-by-value for `revenue`.

---

## Performance Considerations

- **Binary mode**: `VectorTileLayer` uses binary encoding for 2-3x faster parsing
- **Memoization**: All deck.gl layers memoized with proper dependency arrays
- **Debounced persistence**: 300ms debounce on localStorage writes
- **TanStack Query caching**: 5-10 minute stale times reduce API calls
- **Web Worker ready**: Heatmap data processing can be offloaded (hook exists)

---

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

Requires WebGL2 support for deck.gl rendering.

---
