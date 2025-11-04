import openaiService from "./openaiService.js";
import {
  insightGenerationPrompt,
  financialHealthPrompt,
} from "../utils/promptTemplates.js";
import Insight from "../models/insight.model.js";
import Transaction from "../../models/transaction.model.js";
import KYC from "../../models/kyc.model.js";
import User from "../../models/user.model.js";
import aiConfig from "../config/aiConfig.js";

class InsightService {
  /**
   * Generate insights for a user
   */
  async generateInsights(userId, options = {}) {
    const period = options.period || "30days";

    // Fetch user data
    const userData = await this.getUserData(userId);

    // Fetch transactions for the period
    const transactions = await this.getTransactions(userId, period);

    // Check if we have enough data
    if (transactions.length < aiConfig.insights.minTransactionsForInsights) {
      return {
        success: false,
        message: "Not enough transaction data to generate insights",
      };
    }

    // Generate insights using AI
    const insights = await this.generateAIInsights(
      userData,
      transactions,
      period
    );

    // Save insights to database
    const savedInsights = await this.saveInsights(userId, insights);

    return {
      success: true,
      insights: savedInsights,
      count: savedInsights.length,
    };
  }

  /**
   * Get user data for context
   */
  async getUserData(userId) {
    const user = await User.findById(userId).select(
      "preferences.finance firstName"
    );
    const kyc = await KYC.findOne({ userId });

    return {
      name: user?.firstName || "User",
      income: kyc?.financialInfo?.annualIncome || 0,
      monthlyIncome: (kyc?.financialInfo?.annualIncome || 0) / 12,
      monthlyExpenses: kyc?.financialInfo?.monthlyExpenses || 0,
      goals: user?.preferences?.finance?.financialGoals || [],
      riskTolerance: kyc?.investmentInfo?.riskTolerance || "moderate",
      netWorth: kyc?.financialInfo?.netWorth || 0,
    };
  }

  /**
   * Get transactions for a period
   */
  async getTransactions(userId, period) {
    const startDate = this.getStartDate(period);

    return await Transaction.find({
      userId,
      date: { $gte: startDate },
      isDeleted: false,
    }).sort({ date: -1 });
  }

  /**
   * Get start date for period
   */
  getStartDate(period) {
    const now = new Date();

    switch (period) {
      case "7days":
        return new Date(now.setDate(now.getDate() - 7));
      case "30days":
        return new Date(now.setDate(now.getDate() - 30));
      case "90days":
        return new Date(now.setDate(now.getDate() - 90));
      case "1year":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  }

  /**
   * Generate AI-powered insights
   */
  async generateAIInsights(userData, transactions, period) {
    if (!openaiService.isConfigured()) {
      return this.generateRuleBasedInsights(userData, transactions, period);
    }

    try {
      const prompt = insightGenerationPrompt(userData, transactions, period);

      const result = await openaiService.generateCompletion(
        "insight",
        "You are a financial advisor analyzing user's financial data to provide actionable insights.",
        prompt
      );

      // Ensure result is an array
      return Array.isArray(result) ? result : [result];
    } catch (error) {
      console.error("AI insight generation failed:", error);
      return this.generateRuleBasedInsights(userData, transactions, period);
    }
  }

  /**
   * Rule-based insights (fallback)
   */
  generateRuleBasedInsights(userData, transactions, period) {
    const insights = [];

    // Calculate spending by category
    const categorySpending = this.calculateCategorySpending(transactions);

    // Insight 1: Top spending category
    const topCategory = Object.entries(categorySpending).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (topCategory) {
      insights.push({
        type: "spending_pattern",
        category: "spending",
        priority: "medium",
        title: `Your top spending category is ${topCategory[0]}`,
        description: `You spent ₹${topCategory[1].toFixed(2)} on ${topCategory[0]} in the last ${period}. This represents ${this.getPercentage(topCategory[1], this.getTotalSpending(transactions))}% of your total spending.`,
        recommendations: [
          {
            action: `Review your ${topCategory[0]} expenses`,
            impact: "Identify potential savings",
            difficulty: "easy",
          },
        ],
        data: { category: topCategory[0], amount: topCategory[1] },
      });
    }

    // Insight 2: Savings rate
    const totalIncome = this.getTotalIncome(transactions);
    const totalSpending = this.getTotalSpending(transactions);
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

    insights.push({
      type: "financial_health",
      category: "saving",
      priority: savingsRate < 10 ? "high" : "medium",
      title: `Your savings rate is ${savingsRate.toFixed(1)}%`,
      description:
        savingsRate < 20
          ? "Your savings rate is below the recommended 20%. Consider reducing discretionary spending."
          : "Great job! You're saving more than 20% of your income.",
      recommendations: [
        {
          action: "Set up automatic savings",
          impact: "Increase savings rate by 5-10%",
          difficulty: "easy",
        },
      ],
      metrics: {
        currentValue: savingsRate,
        previousValue: 0,
        change: 0,
      },
    });

    // Insight 3: Unusual spending
    const avgDailySpending = totalSpending / 30;
    const highSpendingDays = this.getHighSpendingDays(
      transactions,
      avgDailySpending * 2
    );

    if (highSpendingDays.length > 0) {
      insights.push({
        type: "unusual_activity",
        category: "alert",
        priority: "medium",
        title: "Unusual spending detected",
        description: `You had ${highSpendingDays.length} days with unusually high spending (above ₹${(avgDailySpending * 2).toFixed(2)}).`,
        recommendations: [
          {
            action: "Review these high-spending days",
            impact: "Understand spending spikes",
            difficulty: "easy",
          },
        ],
        data: { days: highSpendingDays },
      });
    }

    return insights;
  }

  /**
   * Calculate spending by category
   */
  calculateCategorySpending(transactions) {
    const spending = {};

    transactions
      .filter((t) => t.type === "debit")
      .forEach((t) => {
        const category = t.category || "Other";
        spending[category] = (spending[category] || 0) + t.amount;
      });

    return spending;
  }

  /**
   * Get total spending
   */
  getTotalSpending(transactions) {
    return transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get total income
   */
  getTotalIncome(transactions) {
    return transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get percentage
   */
  getPercentage(part, total) {
    return total > 0 ? ((part / total) * 100).toFixed(1) : 0;
  }

  /**
   * Get high spending days
   */
  getHighSpendingDays(transactions, threshold) {
    const dailySpending = {};

    transactions
      .filter((t) => t.type === "debit")
      .forEach((t) => {
        const date = new Date(t.date).toISOString().split("T")[0];
        dailySpending[date] = (dailySpending[date] || 0) + t.amount;
      });

    return Object.entries(dailySpending)
      .filter(([, amount]) => amount > threshold)
      .map(([date, amount]) => ({ date, amount }));
  }

  /**
   * Save insights to database
   */
  async saveInsights(userId, insights) {
    const savedInsights = [];

    for (const insight of insights) {
      try {
        const saved = await Insight.create({
          userId,
          type: insight.type,
          category: insight.category,
          priority: insight.priority,
          title: insight.title,
          description: insight.description,
          recommendations: insight.recommendations || [],
          data: insight.data || {},
          metrics: insight.metrics || {},
          period: {
            startDate: this.getStartDate("30days"),
            endDate: new Date(),
          },
          aiMetadata: {
            confidence: insight.confidence || 0.8,
            model: "openai",
            generatedAt: new Date(),
          },
        });

        savedInsights.push(saved);
      } catch (error) {
        console.error("Failed to save insight:", error);
      }
    }

    return savedInsights;
  }

  /**
   * Calculate financial health score
   */
  async calculateFinancialHealthScore(userId) {
    const userData = await this.getUserData(userId);
    const transactions = await this.getTransactions(userId, "90days");

    if (!openaiService.isConfigured()) {
      return this.calculateRuleBasedHealthScore(userData, transactions);
    }

    try {
      const prompt = financialHealthPrompt({
        ...userData,
        monthlyIncome: userData.monthlyIncome,
        monthlyExpenses: userData.monthlyExpenses,
        savingsRate:
          ((userData.monthlyIncome - userData.monthlyExpenses) /
            userData.monthlyIncome) *
          100,
        totalDebt: 0,
        totalAssets: userData.netWorth,
        netWorth: userData.netWorth,
        emergencyFund: 0,
      });

      const result = await openaiService.generateCompletion(
        "financial_health",
        "You are a financial health assessment expert. Calculate comprehensive financial health scores.",
        prompt
      );

      return result;
    } catch (error) {
      console.error("AI health score calculation failed:", error);
      return this.calculateRuleBasedHealthScore(userData, transactions);
    }
  }

  /**
   * Rule-based health score calculation
   */
  calculateRuleBasedHealthScore(userData, transactions) {
    const totalIncome = this.getTotalIncome(transactions);
    const totalSpending = this.getTotalSpending(transactions);
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

    // Simple scoring algorithm
    let score = 50; // Base score

    // Savings rate impact (max +30)
    if (savingsRate > 30) score += 30;
    else if (savingsRate > 20) score += 20;
    else if (savingsRate > 10) score += 10;

    // Income stability (max +20)
    if (totalIncome > 0) score += 20;

    return {
      overallScore: Math.min(score, 100),
      categoryScores: {
        incomeStability: totalIncome > 0 ? 80 : 50,
        debtManagement: 70,
        savingsRate: Math.min(savingsRate * 5, 100),
        emergencyPreparedness: 50,
        investmentHealth: 50,
      },
      strengths: ["Regular income"],
      weaknesses: savingsRate < 20 ? ["Low savings rate"] : [],
      recommendations: [
        {
          priority: 1,
          action: "Increase savings rate",
          impact: "Better financial security",
          timeframe: "3 months",
        },
      ],
      summary: `Your financial health score is ${score}/100.`,
    };
  }

  /**
   * Get active insights for user
   */
  async getActiveInsights(userId, limit = 10) {
    return await Insight.getActiveInsights(userId, limit);
  }
}

// Singleton instance
const insightService = new InsightService();

export default insightService;

