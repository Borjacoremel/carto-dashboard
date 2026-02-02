import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Creates a QueryClient with optimized caching settings for CARTO data.
 * 
 * Cache Strategy:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes
 * - gcTime: 30 minutes - Cached data is garbage collected after 30 minutes of inactivity
 * - refetchOnWindowFocus: false - Prevents unnecessary refetches when user returns to tab
 * - retry: 2 - Retry failed requests twice before giving up
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 5 minutes - no refetch during this time
        staleTime: 5 * 60 * 1000,
        // Keep unused data in cache for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Don't refetch when window regains focus (map data doesn't change frequently)
        refetchOnWindowFocus: false,
        // Don't refetch on mount if data exists in cache
        refetchOnMount: false,
        // Retry failed requests twice
        retry: 2,
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient once per component lifecycle
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
