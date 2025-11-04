import openaiService from "./openaiService.js";
import {
  chatbotSystemPrompt,
  chatbotUserPrompt,
} from "../utils/promptTemplates.js";
import ChatHistory from "../models/chatHistory.model.js";
import Transaction from "../../models/transaction.model.js";
import Insight from "../models/insight.model.js";
import User from "../../models/user.model.js";
import KYC from "../../models/kyc.model.js";
import aiConfig from "../config/aiConfig.js";
import { v4 as uuidv4 } from "uuid";

class ChatbotService {
  /**
   * Handle chat message
   */
  async chat(userId, message, sessionId = null) {
    // Create new session if none provided
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ sessionId });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId,
        sessionId,
        messages: [],
        metadata: {
          totalMessages: 0,
          totalTokensUsed: 0,
        },
      });
    }

    // Add user message to history
    await chatHistory.addMessage("user", message);

    // Get context for the conversation
    const context = await this.getConversationContext(userId);

    // Generate response
    const response = await this.generateResponse(
      userId,
      message,
      chatHistory.messages,
      context
    );

    // Add assistant response to history
    await chatHistory.addMessage("assistant", response.content, {
      tokensUsed: response.metadata?.tokensUsed,
      model: response.metadata?.model,
      responseTime: response.metadata?.responseTime,
    });

    return {
      sessionId,
      message: response.content,
      metadata: response.metadata,
    };
  }

  /**
   * Get conversation context
   */
  async getConversationContext(userId) {
    try {
      // Get recent transactions
      const recentTransactions = await Transaction.find({
        userId,
        isDeleted: false,
      })
        .sort({ date: -1 })
        .limit(10)
        .select("date description amount type category");

      // Get active insights
      const insights = await Insight.find({
        userId,
        status: "active",
      })
        .sort({ priority: -1, createdAt: -1 })
        .limit(5)
        .select("title description type priority");

      // Get user profile
      const user = await User.findById(userId).select(
        "firstName preferences.finance"
      );

      const kyc = await KYC.findOne({ userId }).select(
        "financialInfo investmentInfo"
      );

      return {
        transactions: recentTransactions,
        insights,
        goals: user?.preferences?.finance?.financialGoals || [],
        financialProfile: kyc
          ? {
              income: kyc.financialInfo?.annualIncome,
              riskTolerance: kyc.investmentInfo?.riskTolerance,
            }
          : null,
      };
    } catch (error) {
      console.error("Failed to get conversation context:", error);
      return {};
    }
  }

  /**
   * Generate chatbot response
   */
  async generateResponse(userId, message, history, context) {
    if (!openaiService.isConfigured()) {
      return {
        content: this.getRuleBasedResponse(message, context),
        metadata: { method: "rule-based" },
      };
    }

    try {
      // Get user info for personalization
      const user = await User.findById(userId).select("firstName");

      // Build system prompt
      const systemPrompt = chatbotSystemPrompt({
        name: user?.firstName || "User",
        financialProfile: context.financialProfile
          ? `Income: ${context.financialProfile.income}, Risk: ${context.financialProfile.riskTolerance}`
          : "Not available",
        recentActivity: `${
          context.transactions?.length || 0
        } recent transactions`,
      });

      // Build user prompt with context
      const userPrompt = chatbotUserPrompt(message, context);

      // Build conversation history for context
      const messages = [{ role: "system", content: systemPrompt }];

      // Add recent conversation history (last N messages)
      const recentHistory = history.slice(-aiConfig.chatbot.contextWindow * 2);
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      });

      // Add current user message
      messages.push({ role: "user", content: userPrompt });

      // Generate response
      const response = await openaiService.generateChatCompletion(messages, {
        maxTokens: aiConfig.chatbot.maxResponseLength,
        temperature: 0.7, // Slightly higher for more natural conversation
      });

      return response;
    } catch (error) {
      console.error("AI chat response failed:", error);
      return {
        content: this.getRuleBasedResponse(message, context),
        metadata: { method: "rule-based-fallback" },
      };
    }
  }

  /**
   * Rule-based response (fallback)
   */
  getRuleBasedResponse(message, context) {
    const lowerMessage = message.toLowerCase();

    // Spending queries
    if (
      lowerMessage.includes("spend") ||
      lowerMessage.includes("spent") ||
      lowerMessage.includes("expense")
    ) {
      if (context.transactions && context.transactions.length > 0) {
        const totalSpent = context.transactions
          .filter((t) => t.type === "debit")
          .reduce((sum, t) => sum + t.amount, 0);

        return `Based on your recent transactions, you've spent approximately ₹${totalSpent.toFixed(
          2
        )}. Your top spending categories are ${this.getTopCategories(
          context.transactions
        )}. Would you like more details about any specific category?`;
      }
      return "I don't have enough transaction data yet to analyze your spending. Please add some transactions first.";
    }

    // Savings queries
    if (
      lowerMessage.includes("save") ||
      lowerMessage.includes("saving") ||
      lowerMessage.includes("savings")
    ) {
      return "Here are some tips to increase your savings: 1) Set up automatic transfers to a savings account, 2) Track and reduce discretionary spending, 3) Look for subscriptions you don't use, 4) Cook at home more often. Would you like personalized recommendations based on your spending?";
    }

    // Budget queries
    if (lowerMessage.includes("budget")) {
      return "Creating a budget is a great step! I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Based on your income and expenses, I can help you create a personalized budget. Would you like me to do that?";
    }

    // Goals queries
    if (lowerMessage.includes("goal")) {
      if (context.goals && context.goals.length > 0) {
        const goalsList = context.goals
          .map(
            (g) =>
              `${g.name}: ₹${g.currentAmount}/${
                g.targetAmount
              } (${this.calculateProgress(g)}%)`
          )
          .join(", ");
        return `Your financial goals: ${goalsList}. Keep up the good work! Would you like tips on reaching your goals faster?`;
      }
      return "You haven't set any financial goals yet. Setting clear goals is important for financial success. Would you like help creating your first goal?";
    }

    // Insights queries
    if (
      lowerMessage.includes("insight") ||
      lowerMessage.includes("recommendation")
    ) {
      if (context.insights && context.insights.length > 0) {
        const insight = context.insights[0];
        return `Here's a key insight: ${insight.title} - ${insight.description}`;
      }
      return "I'm analyzing your financial data to generate personalized insights. Check back soon!";
    }

    // Default response
    return "I'm here to help you with your finances! You can ask me about your spending, savings, budget, financial goals, or request personalized recommendations. What would you like to know?";
  }

  /**
   * Get top spending categories
   */
  getTopCategories(transactions) {
    const categorySpending = {};

    transactions
      .filter((t) => t.type === "debit")
      .forEach((t) => {
        const category = t.category || "Other";
        categorySpending[category] =
          (categorySpending[category] || 0) + t.amount;
      });

    const sorted = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return sorted
      .map(([cat, amount]) => `${cat} (₹${amount.toFixed(2)})`)
      .join(", ");
  }

  /**
   * Calculate goal progress
   */
  calculateProgress(goal) {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    return Math.round((goal.currentAmount / goal.targetAmount) * 100);
  }

  /**
   * Get chat history for a user
   */
  async getChatHistory(userId, limit = 10) {
    return await ChatHistory.getRecentConversations(userId, limit);
  }

  /**
   * Get conversation messages
   */
  async getConversation(sessionId) {
    const chat = await ChatHistory.findOne({ sessionId });

    if (!chat) {
      throw new Error("Conversation not found");
    }

    return {
      sessionId: chat.sessionId,
      messages: chat.messages,
      metadata: chat.metadata,
    };
  }

  /**
   * Delete conversation
   */
  async deleteConversation(sessionId, userId) {
    const chat = await ChatHistory.findOne({ sessionId, userId });

    if (!chat) {
      throw new Error("Conversation not found");
    }

    chat.status = "deleted";
    await chat.save();

    return { success: true };
  }

  /**
   * Archive conversation
   */
  async archiveConversation(sessionId, userId) {
    const chat = await ChatHistory.findOne({ sessionId, userId });

    if (!chat) {
      throw new Error("Conversation not found");
    }

    await chat.archive();

    return { success: true };
  }

  /**
   * Rate conversation
   */
  async rateConversation(sessionId, userId, rating) {
    const chat = await ChatHistory.findOne({ sessionId, userId });

    if (!chat) {
      throw new Error("Conversation not found");
    }

    chat.rating = {
      helpful: rating.helpful,
      accuracy: rating.accuracy,
      comment: rating.comment,
    };

    await chat.save();

    return { success: true };
  }
}

// Singleton instance
const chatbotService = new ChatbotService();

export default chatbotService;
