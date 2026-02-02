/**
 * Logging utility for consistent observability across the application.
 * 
 * Provides structured logging with different severity levels and
 * optional context for better debugging and monitoring.
 * 
 * In production, this could be extended to send logs to external
 * services like Sentry, DataDog, or LogRocket.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Set minimum log level based on environment
const MIN_LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

/**
 * Format a log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  return `${prefix} ${entry.message}`;
}

/**
 * Create a log entry with metadata
 */
function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

/**
 * Determine if a log should be output based on level
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
}

/**
 * Main logger object with methods for each log level
 */
export const logger = {
  /**
   * Debug level - verbose development information
   * @example logger.debug('Layer config updated', { layerId: 'retail-stores' })
   */
  debug(message: string, context?: LogContext): void {
    if (!shouldLog('debug')) return;
    
    const entry = createLogEntry('debug', message, context);
    console.debug(formatLogEntry(entry), context || '');
  },

  /**
   * Info level - general operational information
   * @example logger.info('Map initialized successfully')
   */
  info(message: string, context?: LogContext): void {
    if (!shouldLog('info')) return;
    
    const entry = createLogEntry('info', message, context);
    console.info(formatLogEntry(entry), context || '');
  },

  /**
   * Warn level - potential issues that don't break functionality
   * @example logger.warn('Fallback to default colors', { reason: 'Invalid hex' })
   */
  warn(message: string, context?: LogContext): void {
    if (!shouldLog('warn')) return;
    
    const entry = createLogEntry('warn', message, context);
    console.warn(formatLogEntry(entry), context || '');
  },

  /**
   * Error level - errors that affect functionality
   * @example logger.error('Failed to fetch layer data', { error: err.message })
   */
  error(message: string, context?: LogContext): void {
    if (!shouldLog('error')) return;
    
    const entry = createLogEntry('error', message, context);
    console.error(formatLogEntry(entry), context || '');
    
    // In production, you could send to error tracking service here
    // Example: sendToErrorTracking(entry);
  },

  /**
   * Log performance metrics
   * @example logger.perf('Layer rendering', 150)
   */
  perf(operation: string, durationMs: number, context?: LogContext): void {
    if (!shouldLog('debug')) return;
    
    const entry = createLogEntry('debug', `[PERF] ${operation}: ${durationMs}ms`, context);
    console.debug(formatLogEntry(entry), context || '');
  },

  /**
   * Create a timer for measuring operation duration
   * @example
   * const timer = logger.startTimer('data-fetch');
   * await fetchData();
   * timer.end();
   */
  startTimer(operation: string): { end: (context?: LogContext) => void } {
    const startTime = performance.now();
    return {
      end: (context?: LogContext) => {
        const duration = Math.round(performance.now() - startTime);
        this.perf(operation, duration, context);
      },
    };
  },

  /**
   * Group related log messages
   * @example
   * logger.group('Layer initialization');
   * logger.info('Loading config...');
   * logger.info('Creating layers...');
   * logger.groupEnd();
   */
  group(label: string): void {
    if (!shouldLog('debug')) return;
    console.group(label);
  },

  groupEnd(): void {
    if (!shouldLog('debug')) return;
    console.groupEnd();
  },
};

export default logger;
