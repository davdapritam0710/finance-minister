import openaiService from "./openaiService.js";
import { categorizationPrompt } from "../utils/promptTemplates.js";
import {
  detectCategory,
  detectSubcategory,
  extractMerchant,
  suggestTags,
} from "../utils/categoryMapping.js";
import aiConfig from "../config/aiConfig.js";
import Transaction from "../../models/transaction.model.js";

class CategorizationService {
  /**
   * Categorize a single transaction
   */
  async categorizeTransaction(transaction, options = {}) {
    const useAI = options.useAI !== false && aiConfig.features.categorization;

    // Always try rule-based first (fast and free)
    const ruleBasedResult = this.categorizeWithRules(transaction);

    // If confidence is high enough, return rule-based result
    if (
      ruleBasedResult.confidence >= aiConfig.categorization.confidenceThreshold
    ) {
      return {
        ...ruleBasedResult,
        method: "rule-based",
      };
    }

    // If AI is enabled and rule-based confidence is low, use AI
    if (useAI && openaiService.isConfigured()) {
      try {
        const aiResult = await this.categorizeWithAI(transaction);
        return {
          ...aiResult,
          method: "ai",
        };
      } catch (error) {
        console.error(
          "AI categorization failed, falling back to rules:",
          error
        );
        return {
          ...ruleBasedResult,
          method: "rule-based-fallback",
        };
      }
    }

    // Return rule-based result as fallback
    return {
      ...ruleBasedResult,
      method: "rule-based",
    };
  }

  /**
   * Rule-based categorization (fast, no API calls)
   */
  categorizeWithRules(transaction) {
    const { description, amount, type } = transaction;

    // Detect category using keywords
    const category = detectCategory(description, amount, type);

    // Detect subcategory
    const subcategory = detectSubcategory(category, description);

    // Extract merchant
    const merchant = extractMerchant(description);

    // Suggest tags
    const tags = suggestTags(category, description, amount, type);

    // Calculate confidence based on keyword match quality
    let confidence = 0.5; // Base confidence

    if (category !== "Other") {
      confidence = 0.75; // Found a match
    }

    if (merchant) {
      confidence += 0.1; // Extracted merchant
    }

    if (tags.length > 0) {
      confidence += 0.05; // Has relevant tags
    }

    confidence = Math.min(confidence, 0.95); // Cap at 0.95

    return {
      category,
      subcategory,
      merchant,
      tags,
      isRecurring: false, // Need historical data
      confidence,
      reasoning: "Categorized using keyword matching",
    };
  }

  /**
   * AI-based categorization (more accurate, uses API)
   */
  async categorizeWithAI(transaction) {
    const prompt = categorizationPrompt(transaction);

    const result = await openaiService.generateCompletion(
      "categorization",
      "You are a financial transaction categorization expert. Analyze transactions and categorize them accurately.",
      prompt
    );

    // Ensure all required fields are present
    return {
      category: result.category || "Other",
      subcategory: result.subcategory || null,
      merchant: result.merchant || extractMerchant(transaction.description),
      tags: result.tags || [],
      isRecurring: result.isRecurring || false,
      confidence: result.confidence || 0.8,
      reasoning: result.reasoning || "AI categorization",
      cached: result.cached,
      metadata: result.metadata,
    };
  }

  /**
   * Batch categorize multiple transactions
   */
  async batchCategorize(transactions, options = {}) {
    const results = [];

    // Process in batches to avoid overwhelming the API
    const batchSize = options.batchSize || 10;

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map((transaction) =>
          this.categorizeTransaction(transaction, options)
        )
      );

      results.push(...batchResults);

      // Small delay between batches to respect rate limits
      if (i + batchSize < transactions.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Auto-categorize and update transaction
   */
  async autoCategorizeAndUpdate(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Get categorization
      const result = await this.categorizeTransaction(transaction);

      // Update transaction if confidence is high enough
      if (result.confidence >= aiConfig.categorization.confidenceThreshold) {
        transaction.category = result.category;

        // Add tags if not already present
        if (result.tags && result.tags.length > 0) {
          transaction.tags = [
            ...new Set([...(transaction.tags || []), ...result.tags]),
          ];
        }

        // Update recurring flag
        if (result.isRecurring) {
          transaction.isRecurring = true;
        }

        await transaction.save();

        return {
          success: true,
          transaction,
          categorization: result,
        };
      }

      return {
        success: false,
        message: "Confidence too low for auto-categorization",
        categorization: result,
      };
    } catch (error) {
      console.error("Auto-categorization failed:", error);
      throw error;
    }
  }

  /**
   * Get category suggestions for a transaction
   */
  async getCategorySuggestions(transaction) {
    const result = await this.categorizeTransaction(transaction);

    return {
      suggested: result.category,
      confidence: result.confidence,
      alternatives: this.getAlternativeCategories(transaction),
      reasoning: result.reasoning,
    };
  }

  /**
   * Get alternative category suggestions
   */
  getAlternativeCategories(transaction) {
    // Return top 3 categories that might also fit
    const allCategories = aiConfig.categorization.defaultCategories;
    const primary = detectCategory(
      transaction.description,
      transaction.amount,
      transaction.type
    );

    return allCategories.filter((cat) => cat !== primary).slice(0, 3);
  }

  /**
   * Learn from user corrections
   */
  async learnFromCorrection(transactionId, correctedCategory) {
    // This can be used to improve future categorizations
    // For now, we'll just log it. In future, we can train a custom model

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    console.log("Learning from correction:", {
      original: transaction.category,
      corrected: correctedCategory,
      description: transaction.description,
      amount: transaction.amount,
    });

    // Update transaction
    transaction.category = correctedCategory;
    await transaction.save();

    return {
      success: true,
      message: "Thank you for the correction! We'll improve our suggestions.",
    };
  }
}

// Singleton instance
const categorizationService = new CategorizationService();

export default categorizationService;
