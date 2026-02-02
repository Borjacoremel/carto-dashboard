import { Component, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Warning from '@mui/icons-material/Warning';
import Refresh from '@mui/icons-material/Refresh';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional name for error tracking */
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component for graceful error handling.
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs them, and displays a fallback UI instead of crashing.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary name="MapSection">
 *   <MapView layers={layers} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const boundaryName = this.props.name || 'Unknown';
    
    // Log error with structured context
    logger.error(`ErrorBoundary caught error in ${boundaryName}`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isMapError = this.state.error?.message?.toLowerCase().includes('webgl') ||
                        this.state.error?.message?.toLowerCase().includes('deck') ||
                        this.state.error?.message?.toLowerCase().includes('texture');

      return (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 4,
          }}
          role="alert"
          aria-live="assertive"
        >
          <Paper
            sx={{
              maxWidth: 400,
              width: '100%',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                borderRadius: '50%',
                bgcolor: 'error.dark',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Warning sx={{ fontSize: 32, color: 'error.light' }} />
            </Box>
            
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isMapError ? 'Map Rendering Error' : 'Something went wrong'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {isMapError
                ? 'There was a problem loading the map. This may be due to WebGL compatibility issues with your browser.'
                : 'An unexpected error occurred. Please try again or refresh the page.'}
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(255,0,0,0.1)',
                  borderRadius: 1,
                  textAlign: 'left',
                  maxHeight: 150,
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    m: 0,
                  }}
                >
                  {this.state.error.message}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={this.handleReset}
                aria-label="Try again without reloading"
              >
                Try Again
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
                aria-label="Reload the page"
              >
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * Specialized error boundary for map components.
 * Provides map-specific error messaging and recovery options.
 */
export function MapErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      name="MapView"
      fallback={
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            flexDirection: 'column',
            gap: 2,
          }}
          role="alert"
        >
          <Warning sx={{ fontSize: 48, color: 'warning.main' }} />
          <Typography variant="h6">Map Loading Failed</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, textAlign: 'center' }}>
            Unable to initialize the map. Please check your browser supports WebGL and try refreshing.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            startIcon={<Refresh />}
          >
            Refresh Page
          </Button>
        </Box>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
