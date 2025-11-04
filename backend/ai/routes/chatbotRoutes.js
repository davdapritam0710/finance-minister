import express from "express";
import {
  sendMessage,
  getChatHistory,
  getConversation,
  deleteConversation,
  archiveConversation,
  rateConversation,
} from "../controllers/chatbotController.js";

// Import auth middleware
import auth from "../../middlewares/auth.js";

const router = express.Router();

// Chat routes
router.post("/chat", auth, sendMessage);
router.get("/chat/history", auth, getChatHistory);
router.get("/chat/:sessionId", auth, getConversation);
router.delete("/chat/:sessionId", auth, deleteConversation);
router.put("/chat/:sessionId/archive", auth, archiveConversation);
router.post("/chat/:sessionId/rate", auth, rateConversation);

export default router;

