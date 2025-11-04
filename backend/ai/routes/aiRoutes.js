import express from "express";
import {
  categorizeTransaction,
  autoCategorize,
  getCategorySuggestions,
  learnFromCorrection,
  generateInsights,
  getActiveInsights,
  acknowledgeInsight,
  dismissInsight,
  getFinancialHealthScore,
} from "../controllers/aiController.js";

// Import auth middleware (will use existing one)
import auth from "../../middlewares/auth.js";

const router = express.Router();

// Categorization routes
router.post("/categorize", auth, categorizeTransaction);
router.post("/categorize/:transactionId", auth, autoCategorize);
router.get("/categorize/suggestions", auth, getCategorySuggestions);
router.post("/categorize/learn/:transactionId", auth, learnFromCorrection);

// Insights routes
router.post("/insights/generate", auth, generateInsights);
router.get("/insights", auth, getActiveInsights);
router.put("/insights/:insightId/acknowledge", auth, acknowledgeInsight);
router.put("/insights/:insightId/dismiss", auth, dismissInsight);

// Financial health routes
router.get("/health-score", auth, getFinancialHealthScore);

export default router;

