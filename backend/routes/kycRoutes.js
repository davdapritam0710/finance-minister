import express from "express";
import {
  createOrUpdateKYC,
  getKYC,
  getKYCStatus,
  submitKYC,
  getAllKYC,
  reviewKYC,
  getKYCById,
} from "../controllers/kycController.js";
import {
  validateKYC,
  validateKYCReview,
} from "../validations/kycValidation.js";
import { authenticateToken } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/authorization.js";

const router = express.Router();

// User routes (require authentication)
router.post("/", authenticateToken, validateKYC, createOrUpdateKYC);
router.get("/", authenticateToken, getKYC);
router.get("/status", authenticateToken, getKYCStatus);
router.post("/submit", authenticateToken, submitKYC);

// Admin routes (require authentication and admin role)
router.get("/admin", authenticateToken, requireAdmin, getAllKYC);
router.get("/admin/:id", authenticateToken, requireAdmin, getKYCById);
router.put(
  "/admin/:id/review",
  authenticateToken,
  requireAdmin,
  validateKYCReview,
  reviewKYC
);

export default router;
