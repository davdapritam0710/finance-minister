import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

import { authenticateToken } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/authorization.js";
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateUpdateUser,
  validateForgotPassword,
  validateResetPassword,
} from "../validations/userValidation.js";

// Public routes
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, validateUpdateProfile, updateProfile);
router.put(
  "/change-password",
  authenticateToken,
  validateChangePassword,
  changePassword
);

// Admin routes (require admin role)
router.get("/", authenticateToken, requireAdmin, getAllUsers);
router.get("/:id", authenticateToken, requireAdmin, getUserById);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateUpdateUser,
  updateUserById
);
router.delete("/:id", authenticateToken, requireAdmin, deleteUserById);

export default router;
