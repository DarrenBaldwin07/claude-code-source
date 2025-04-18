/**
 * AI Module
 *
 * Provides AI capabilities using Claude, Anthropic's large language model.
 * This module handles initialization, configuration, and access to AI services.
 */

import { AIClient } from "./client.js"
import { logger } from "../utils/logger.js"
import { createUserError } from "../errors/formatter.js"
import { ErrorCategory } from "../errors/types.js"
import { authManager } from "../auth/index.js"

// Singleton AI client instance
let aiClient: AIClient | null = null

/**
 * Initialize the AI module
 */
export async function initAI(config: any = {}): Promise<AIClient> {
  logger.info("Initializing AI module")

  try {
    const API_KEY = process.env.ANTHROPIC_API_KEY

    // Create AI client
    aiClient = new AIClient(config, API_KEY as string)

    // Test connection
    logger.debug("Testing connection to AI service")
    const connectionSuccess = await aiClient.testConnection()

    if (!connectionSuccess) {
      throw createUserError("Failed to connect to Claude AI service", {
        category: ErrorCategory.CONNECTION,
        resolution:
          "Check your internet connection and API key, then try again.",
      })
    }

    logger.info("AI module initialized successfully")
    return aiClient
  } catch (error) {
    logger.error("Failed to initialize AI module", error)

    throw createUserError("Failed to initialize AI capabilities", {
      cause: error,
      category: ErrorCategory.INITIALIZATION,
      resolution:
        "Check your authentication and internet connection, then try again.",
    })
  }
}

/**
 * Get the AI client instance
 */
export function getAIClient(): AIClient {
  if (!aiClient) {
    throw createUserError("AI module not initialized", {
      category: ErrorCategory.INITIALIZATION,
      resolution: "Make sure to call initAI() before using AI capabilities.",
    })
  }

  return aiClient
}

/**
 * Check if AI module is initialized
 */
export function isAIInitialized(): boolean {
  return !!aiClient
}

// Re-export types and components
export * from "./client.js"
export * from "./prompts.js"
