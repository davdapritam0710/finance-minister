import categorizationService from "../services/categorizationService.js";
import insightService from "../services/insightService.js";
import logger from "../../config/logger.js";

/**
 * Categorize a transaction
 */
export const categorizeTransaction = async (req, res) => {
  try {
    const { description, amount, type, date, accountName } = req.body;

    const transaction = {
      description,
      amount,
      type,
      date,
      accountName,
    };

    const result = await categorizationService.categorizeTransaction(
      transaction
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Transaction categorization error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to categorize transaction",
      error: error.message,
    });
  }
};

/**
 * Auto-categorize an existing transaction
 */
export const autoCategorize = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await categorizationService.autoCategorizeAndUpdate(
      transactionId
    );

    res.status(200).json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    logger.error("Auto-categorization error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to auto-categorize transaction",
      error: error.message,
    });
  }
};

/**
 * Get category suggestions
 */
export const getCategorySuggestions = async (req, res) => {
  try {
    const { description, amount, type } = req.query;

    const transaction = {
      description,
      amount: parseFloat(amount),
      type,
    };

    const suggestions = await categorizationService.getCategorySuggestions(
      transaction
    );

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    logger.error("Category suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get category suggestions",
      error: error.message,
    });
  }
};

/**
 * Learn from user correction
 */
export const learnFromCorrection = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { correctedCategory } = req.body;

    const result = await categorizationService.learnFromCorrection(
      transactionId,
      correctedCategory
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Learn from correction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process correction",
      error: error.message,
    });
  }
};

/**
 * Generate insights for user
 */
export const generateInsights = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period } = req.query;

    const result = await insightService.generateInsights(userId, { period });

    res.status(200).json({
      success: result.success,
      data: result.insights || [],
      message: result.message,
    });
  } catch (error) {
    logger.error("Insight generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate insights",
      error: error.message,
    });
  }
};

/**
 * Get active insights
 */
export const getActiveInsights = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const insights = await insightService.getActiveInsights(userId, limit);

    res.status(200).json({
      success: true,
      data: insights,
      count: insights.length,
    });
  } catch (error) {
    logger.error("Get insights error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get insights",
      error: error.message,
    });
  }
};

/**
 * Acknowledge insight
 */
export const acknowledgeInsight = async (req, res) => {
  try {
    const { insightId } = req.params;
    const userId = req.user.userId;

    const Insight = (await import("../models/insight.model.js")).default;
    const insight = await Insight.findOne({ _id: insightId, userId });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
      });
    }

    await insight.acknowledge();

    res.status(200).json({
      success: true,
      data: insight,
    });
  } catch (error) {
    logger.error("Acknowledge insight error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to acknowledge insight",
      error: error.message,
    });
  }
};

/**
 * Dismiss insight
 */
export const dismissInsight = async (req, res) => {
  try {
    const { insightId } = req.params;
    const userId = req.user.userId;

    const Insight = (await import("../models/insight.model.js")).default;
    const insight = await Insight.findOne({ _id: insightId, userId });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
      });
    }

    await insight.dismiss();

    res.status(200).json({
      success: true,
      data: insight,
    });
  } catch (error) {
    logger.error("Dismiss insight error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to dismiss insight",
      error: error.message,
    });
  }
};

/**
 * Calculate financial health score
 */
export const getFinancialHealthScore = async (req, res) => {
  try {
    const userId = req.user.userId;

    const healthScore = await insightService.calculateFinancialHealthScore(
      userId
    );

    res.status(200).json({
      success: true,
      data: healthScore,
    });
  } catch (error) {
    logger.error("Financial health score error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate financial health score",
      error: error.message,
    });
  }
};

export default {
  categorizeTransaction,
  autoCategorize,
  getCategorySuggestions,
  learnFromCorrection,
  generateInsights,
  getActiveInsights,
  acknowledgeInsight,
  dismissInsight,
  getFinancialHealthScore,
};

