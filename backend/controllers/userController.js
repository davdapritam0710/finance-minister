import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { authLogger, securityLogger } from "../middlewares/logger.js";

/**
 * @description: Register a new user
 * @route: POST /api/users/register
 * @access: Public
 */
const registerUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      securityLogger("Duplicate registration attempt", { email });
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    });

    // Generate email verification token
    // TODO: Uncomment this when email verification is implemented
    // const emailVerificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Log successful registration
    authLogger("User registration", user._id, { email, role: user.role });

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        token,
        // TODO: Uncomment this when email verification is implemented
        // emailVerificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Login user
 * @route: POST /api/users/login
 * @access: Public
 */
const loginUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      securityLogger("Failed login attempt - user not found", {
        email,
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      securityLogger("Failed login attempt - account deactivated", {
        email,
        userId: user._id,
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      securityLogger("Failed login attempt - invalid password", {
        email,
        userId: user._id,
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Log successful login
    authLogger("User login", user._id, { email, role: user.role, ip: req.ip });

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get current user profile
 * @route: GET /api/users/profile
 * @access: Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      statusCode: 200,
      success: true,
      message: "Profile fetched successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Update user profile
 * @route: PUT /api/users/profile
 * @access: Private
 */
const updateProfile = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const allowedUpdates = [
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
      "preferences",
    ];
    const updates = {};

    // Only allow certain fields to be updated
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Log profile update
    authLogger("Profile update", user._id, {
      updatedFields: Object.keys(updates),
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Change password
 * @route: PUT /api/users/change-password
 * @access: Private
 */
const changePassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(req.user.userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log password change
    authLogger("Password change", user._id, { ip: req.ip });
    securityLogger("Password changed", { userId: user._id, ip: req.ip });

    res.json({
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get all users (Admin only)
 * @route: GET /api/users
 * @access: Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password -emailVerificationToken -passwordResetToken")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    // Log admin action
    authLogger("Admin - Get all users", req.user.userId, {
      page,
      limit,
      total,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get user by ID (Admin only)
 * @route: GET /api/users/:id
 * @access: Private/Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      statusCode: 200,
      success: true,
      message: "User fetched successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Update user by ID (Admin only)
 * @route: PUT /api/users/:id
 * @access: Private/Admin
 */
const updateUserById = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "role",
      "isActive",
    ];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Log admin action
    authLogger("Admin - Update user", req.user.userId, {
      targetUserId: req.params.id,
      updates,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Delete user by ID (Admin only)
 * @route: DELETE /api/users/:id
 * @access: Private/Admin
 */
const deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Log admin action
    authLogger("Admin - Delete user", req.user.userId, {
      targetUserId: req.params.id,
      deletedUser: user.email,
    });

    securityLogger("User deleted by admin", {
      adminUserId: req.user.userId,
      deletedUserId: req.params.id,
      deletedUserEmail: user.email,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Forgot password
 * @route: POST /api/users/forgot-password
 * @access: Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Log password reset request
    authLogger("Password reset requested", user._id, { email, ip: req.ip });
    securityLogger("Password reset token generated", {
      userId: user._id,
      email,
      ip: req.ip,
    });

    // In a real application, you would send this token via email
    res.json({
      statusCode: 200,
      success: true,
      message: "Password reset token generated",
      data: { resetToken }, // Remove this in production
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Reset password
 * @route: POST /api/users/reset-password
 * @access: Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    if (decoded.type !== "password_reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log successful password reset
    authLogger("Password reset completed", user._id, { ip: req.ip });
    securityLogger("Password reset completed", {
      userId: user._id,
      ip: req.ip,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
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
};
