/**
 * Error Handling Module
 *
 * Provides centralized error handling, tracking, and reporting.
 */
import { UserError, ErrorOptions } from "./types.js";
/**
 * ErrorManager interface
 */
export interface ErrorManager {
    handleFatalError(error: unknown): never;
    handleUnhandledRejection(reason: unknown, promise: Promise<unknown>): void;
    handleUncaughtException(error: unknown): void;
    handleError(error: unknown, options?: ErrorOptions): void;
}
/**
 * Initialize error handling system
 */
export declare function initErrorHandling(): ErrorManager;
export * from "./types.js";
/**
 * Format an error for user display
 */
export declare function formatUserErrorForDisplay(error: UserError): string;
/**
 * Format an error for display to the user
 */
export declare function formatDisplayForUser(error: unknown): string;
