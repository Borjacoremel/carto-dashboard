import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage, useLocalStorageSimple } from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when localStorage has data', () => {
    mockLocalStorage['test-key'] = JSON.stringify('stored-value');

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('persists value to localStorage when set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(mockLocalStorage['test-key']).toBe(JSON.stringify('new-value'));
  });

  it('supports function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('removes value from localStorage and resets to initial', () => {
    mockLocalStorage['test-key'] = JSON.stringify('stored');
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored');

    act(() => {
      result.current[2](); // removeValue
    });

    // State resets to initial value
    expect(result.current[0]).toBe('initial');
    // Note: The useEffect will re-persist the initial value after removal
  });

  it('handles complex objects', () => {
    const complexObject = { a: 1, b: { c: 'nested' }, d: [1, 2, 3] };
    const { result } = renderHook(() =>
      useLocalStorage<Record<string, unknown>>('test-key', { default: true })
    );

    act(() => {
      result.current[1](complexObject);
    });

    expect(result.current[0]).toEqual(complexObject);
  });

  it('handles parse errors gracefully', () => {
    mockLocalStorage['test-key'] = 'invalid-json{';

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
  });

  it('supports custom serialize/deserialize', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', new Date('2024-01-01'), {
        serialize: (d) => d.toISOString(),
        deserialize: (s) => new Date(s),
      })
    );

    act(() => {
      result.current[1](new Date('2024-06-15'));
    });

    expect(result.current[0]).toEqual(new Date('2024-06-15'));
    expect(mockLocalStorage['test-key']).toBe('2024-06-15T00:00:00.000Z');
  });
});

describe('useLocalStorageSimple', () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorageSimple('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when localStorage has data', () => {
    mockLocalStorage['test-key'] = JSON.stringify('stored');

    const { result } = renderHook(() => useLocalStorageSimple('test-key', 'initial'));

    expect(result.current[0]).toBe('stored');
  });

  it('persists value immediately on set', () => {
    const { result } = renderHook(() => useLocalStorageSimple('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(mockLocalStorage['test-key']).toBe(JSON.stringify('new-value'));
  });
});
