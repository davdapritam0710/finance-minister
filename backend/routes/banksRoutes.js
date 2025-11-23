import express from "express";
const router = express.Router();
import {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
  deleteBank,
  updateBankBalance,
  linkBank,
  unlinkBank,
} from "../controllers/banksController.js";

import { authenticateToken } from "../middlewares/auth.js";
import {
  validateCreateBank,
  validateUpdateBank,
  validateUpdateBalance,
  validateBankQuery,
} from "../validations/banksValidation.js";

// All routes require authentication
router.use(authenticateToken);

// Bank routes
router.get("/", validateBankQuery, getAllBanks);
router.get("/:id", getBankById);
router.post("/", validateCreateBank, createBank);
router.put("/:id", validateUpdateBank, updateBank);
router.delete("/:id", deleteBank);
router.patch("/:id/balance", validateUpdateBalance, updateBankBalance);
router.patch("/:id/link", linkBank);
router.patch("/:id/unlink", unlinkBank);

export default router;
