/**
 * Error Handling Module
 *
 * Provides centralized error handling, tracking, and reporting.
 */

import { logger } from "../utils/logger.js"
import { ErrorLevel, ErrorCategory, UserError, ErrorOptions } from "./types.js"
import { formatErrorForDisplay } from "./formatter.js"
import { setupConsoleErrorHandling } from "./console.js"

/**
 * ErrorManager interface
 */
export interface ErrorManager {
  handleFatalError(error: unknown): never
  handleUnhandledRejection(reason: unknown, promise: Promise<unknown>): void
  handleUncaughtException(error: unknown): void
  handleError(error: unknown, options?: ErrorOptions): void
}

/**
 * Initialize error handling system
 */
export function initErrorHandling(): ErrorManager {
  logger.debug("Initializing error handling system")

  // Create error manager instance
  const errorManager = new ErrorHandlerImpl()

  try {
    // Set up Sentry error reporting if enabled
    // We're skipping Sentry SDK as requested

    // Set up console error handling
    setupConsoleErrorHandling(errorManager)

    return errorManager
  } catch (error) {
    logger.error("Failed to initialize error handling system", error)

    // Return a basic error manager even if initialization failed
    return errorManager
  }
}

/**
 * Implementation of the ErrorManager interface
 */
class ErrorHandlerImpl implements ErrorManager {
  private errorCount: Map<string, number> = new Map()
  private readonly MAX_ERRORS = 100

  /**
   * Handle a fatal error that should terminate the application
   */
  handleFatalError(error: unknown): never {
    const formattedError = this.formatError(error, {
      level: ErrorLevel.CRITICAL,
      category: ErrorCategory.APPLICATION,
    })

    logger.error("FATAL ERROR:", formattedError)

    // Exit with error code
    process.exit(1)
  }

  /**
   * Handle an unhandled promise rejection
   */
  handleUnhandledRejection(reason: unknown, promise: Promise<unknown>): void {
    const formattedError = this.formatError(reason, {
      level: ErrorLevel.MAJOR,
      category: ErrorCategory.APPLICATION,
      context: { promise },
    })

    logger.error("Unhandled Promise Rejection:", formattedError)
  }

  /**
   * Handle an uncaught exception
   */
  handleUncaughtException(error: unknown): void {
    const formattedError = this.formatError(error, {
      level: ErrorLevel.CRITICAL,
      category: ErrorCategory.APPLICATION,
    })

    logger.error("Uncaught Exception:", formattedError)
  }

  /**
   * Handle a general error
   */
  handleError(error: unknown, options: ErrorOptions = {}): void {
    const category = options.category || ErrorCategory.APPLICATION
    const level = options.level || ErrorLevel.MINOR

    // Track error count for rate limiting
    const errorKey = `${category}:${level}:${this.getErrorMessage(error)}`
    const count = (this.errorCount.get(errorKey) || 0) + 1
    this.errorCount.set(errorKey, count)

    // Format the error
    const formattedError = this.formatError(error, options)

    // Log the error based on level
    if (
      (level as number) === ErrorLevel.CRITICAL ||
      (level as number) === ErrorLevel.MAJOR
    ) {
      logger.error(
        `[${ErrorCategory[category]}] ${formattedError.message}`,
        formattedError
      )
    } else if ((level as number) === ErrorLevel.MINOR) {
      logger.warn(
        `[${ErrorCategory[category]}] ${formattedError.message}`,
        formattedError
      )
    } else if ((level as number) === ErrorLevel.INFORMATIONAL) {
      logger.info(
        `[${ErrorCategory[category]}] ${formattedError.message}`,
        formattedError
      )
    }

    // Report to telemetry/monitoring if appropriate
    if (
      (level as number) === ErrorLevel.MAJOR ||
      (level as number) === ErrorLevel.CRITICAL
    ) {
      this.reportError(formattedError, options)
    }
  }

  /**
   * Format an error object for consistent handling
   */
  private formatError(error: unknown, options: ErrorOptions = {}): any {
    try {
      // We're passing just the error to formatErrorForDisplay since it seems to only accept one parameter
      return formatErrorForDisplay(error)
    } catch (formattingError) {
      // If formatting fails, return a basic error object
      return {
        message: this.getErrorMessage(error),
        originalError: error,
        formattingError,
      }
    }
  }

  /**
   * Get an error message from any error type
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    } else if (typeof error === "string") {
      return error
    } else {
      try {
        return JSON.stringify(error)
      } catch {
        return String(error)
      }
    }
  }

  /**
   * Report an error to monitoring/telemetry systems
   */
  private reportError(error: any, options: ErrorOptions = {}): void {
    // We're skipping Sentry SDK as requested
    // In a real implementation, this would send the error to Sentry

    // Instead, just log that we would report it
    logger.debug("Would report error to monitoring system:", {
      error: error.message,
      level: options.level,
      category: options.category,
    })
  }
}

// Export error types
export * from "./types.js"

function getSeverityMessage(level: ErrorLevel): string {
  switch (level) {
    case ErrorLevel.CRITICAL:
      return "This is a critical error that prevents the application from functioning."
    case ErrorLevel.MAJOR:
      return "This is a significant error that may impact functionality."
    case ErrorLevel.MINOR:
      return "This is a minor error that should not significantly impact functionality."
    case ErrorLevel.INFORMATIONAL:
      return "This is an informational message about an error condition."
    case ErrorLevel.DEBUG:
    case ErrorLevel.INFO:
    case ErrorLevel.WARNING:
    case ErrorLevel.ERROR:
    case ErrorLevel.FATAL:
    default:
      return ""
  }
}

function shouldShowResolution(level: ErrorLevel): boolean {
  if (level === ErrorLevel.MAJOR || level === ErrorLevel.CRITICAL) {
    return true
  }
  return false
}

/**
 * Format an error for user display
 */
export function formatUserErrorForDisplay(error: UserError): string {
  return `Error: ${error.message}${
    error.resolution
      ? `\nResolution: ${
          Array.isArray(error.resolution)
            ? error.resolution.join("\n  - ")
            : error.resolution
        }`
      : ""
  }`
}

/**
 * Format an error for display to the user
 */
export function formatDisplayForUser(error: unknown): string {
  // For user errors, use a more friendly format
  if (error instanceof UserError) {
    return formatUserErrorForDisplay(error)
  }

  // For system errors, provide a more technical but still readable format
  if (error instanceof Error) {
    return formatErrorForDisplay(error)
  }

  // For unknown errors, convert to string
  return String(error)
}
