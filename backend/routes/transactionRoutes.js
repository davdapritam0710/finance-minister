import express from "express";
const router = express.Router();
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} from "../controllers/transactionController.js";

import { authenticateToken } from "../middlewares/auth.js";
import {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateTransactionQuery,
} from "../validations/transactionValidation.js";

// All routes require authentication
router.use(authenticateToken);

// Transaction routes
router.get("/", validateTransactionQuery, getAllTransactions);
router.get("/stats", validateTransactionQuery, getTransactionStats);
router.get("/:id", getTransactionById);
router.post("/", validateCreateTransaction, createTransaction);
router.put("/:id", validateUpdateTransaction, updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
