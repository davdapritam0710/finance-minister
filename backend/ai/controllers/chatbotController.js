import chatbotService from "../services/chatbotService.js";
import logger from "../../config/logger.js";

/**
 * Send chat message
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await chatbotService.chat(userId, message, sessionId);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error("Chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process chat message",
      error: error.message,
    });
  }
};

/**
 * Get chat history
 */
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const history = await chatbotService.getChatHistory(userId, limit);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    logger.error("Get chat history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get chat history",
      error: error.message,
    });
  }
};

/**
 * Get conversation messages
 */
export const getConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await chatbotService.getConversation(sessionId);

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    logger.error("Get conversation error:", error);
    res.status(404).json({
      success: false,
      message: error.message || "Conversation not found",
    });
  }
};

/**
 * Delete conversation
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;

    await chatbotService.deleteConversation(sessionId, userId);

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    logger.error("Delete conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
      error: error.message,
    });
  }
};

/**
 * Archive conversation
 */
export const archiveConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;

    await chatbotService.archiveConversation(sessionId, userId);

    res.status(200).json({
      success: true,
      message: "Conversation archived successfully",
    });
  } catch (error) {
    logger.error("Archive conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to archive conversation",
      error: error.message,
    });
  }
};

/**
 * Rate conversation
 */
export const rateConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const { helpful, accuracy, comment } = req.body;

    await chatbotService.rateConversation(sessionId, userId, {
      helpful,
      accuracy,
      comment,
    });

    res.status(200).json({
      success: true,
      message: "Thank you for your feedback!",
    });
  } catch (error) {
    logger.error("Rate conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to rate conversation",
      error: error.message,
    });
  }
};

export default {
  sendMessage,
  getChatHistory,
  getConversation,
  deleteConversation,
  archiveConversation,
  rateConversation,
};

