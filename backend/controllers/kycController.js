import KYC from "../models/kyc.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { authLogger } from "../middlewares/logger.js";

/**
 * @description: Create or update KYC form
 * @route: POST /api/kyc
 * @access: Private
 */
const createOrUpdateKYC = async (req, res, next) => {
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

    const userId = req.user.userId;
    const kycData = req.body;

    // Check if KYC already exists
    let kyc = await KYC.findOne({ userId });

    if (kyc) {
      // Update existing KYC
      kyc = await KYC.findOneAndUpdate(
        { userId },
        { ...kycData, status: "pending" },
        { new: true, runValidators: true }
      );

      authLogger("KYC updated", userId, { kycId: kyc._id });
    } else {
      // Create new KYC
      kyc = new KYC({
        userId,
        ...kycData,
        status: "pending",
      });
      await kyc.save();

      authLogger("KYC created", userId, { kycId: kyc._id });
    }

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: kyc.isNew
        ? "KYC form submitted successfully"
        : "KYC form updated successfully",
      data: { kyc },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get user's KYC form
 * @route: GET /api/kyc
 * @access: Private
 */
const getKYC = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const kyc = await KYC.findOne({ userId }).populate(
      "userId",
      "firstName lastName email"
    );

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC form not found",
      });
    }

    authLogger("KYC retrieved", userId, { kycId: kyc._id });

    res.json({
      statusCode: 200,
      success: true,
      message: "KYC form retrieved successfully",
      data: { kyc },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get KYC completion status
 * @route: GET /api/kyc/status
 * @access: Private
 */
const getKYCStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const kyc = await KYC.findOne({ userId });

    if (!kyc) {
      return res.json({
        statusCode: 200,
        success: true,
        message: "KYC status retrieved",
        data: {
          isKycCompleted: false,
          status: "not_started",
          completionPercentage: 0,
          kyc: null,
        },
      });
    }

    const completionPercentage = kyc.getCompletionPercentage();
    const isKycCompleted = kyc.isComplete();

    res.json({
      statusCode: 200,
      success: true,
      message: "KYC status retrieved",
      data: {
        isKycCompleted,
        status: kyc.status,
        completionPercentage,
        kyc,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Submit KYC for review
 * @route: POST /api/kyc/submit
 * @access: Private
 */
const submitKYC = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const kyc = await KYC.findOne({ userId });

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC form not found",
      });
    }

    // Check if KYC is complete enough to submit
    const completionPercentage = kyc.getCompletionPercentage();
    if (completionPercentage < 80) {
      return res.status(400).json({
        success: false,
        message: `KYC form is only ${completionPercentage}% complete. Please complete all required fields before submitting.`,
        data: { completionPercentage },
      });
    }

    // Update status to under review
    kyc.status = "under_review";
    await kyc.save();

    // Update user's KYC status
    await User.findByIdAndUpdate(userId, { isKycCompleted: false });

    authLogger("KYC submitted for review", userId, { kycId: kyc._id });

    res.json({
      statusCode: 200,
      success: true,
      message: "KYC form submitted for review successfully",
      data: { kyc },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get all KYC forms (Admin only)
 * @route: GET /api/kyc/admin
 * @access: Private/Admin
 */
const getAllKYC = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.status = status;
    }

    const kycForms = await KYC.find(query)
      .populate("userId", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await KYC.countDocuments(query);

    authLogger("Admin - Get all KYC forms", req.user.userId, {
      page,
      limit,
      total,
      status,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "KYC forms retrieved successfully",
      data: {
        kycForms,
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
 * @description: Review KYC form (Admin only)
 * @route: PUT /api/kyc/:id/review
 * @access: Private/Admin
 */
const reviewKYC = async (req, res, next) => {
  try {
    const { status, rejectionReason, notes } = req.body;
    const kycId = req.params.id;
    const adminUserId = req.user.userId;

    if (!["approved", "rejected", "requires_documents"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be approved, rejected, or requires_documents",
      });
    }

    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC form not found",
      });
    }

    // Update KYC status
    kyc.status = status;
    kyc.reviewedBy = adminUserId;
    kyc.reviewedAt = new Date();
    kyc.notes = notes;

    if (status === "rejected" && rejectionReason) {
      kyc.rejectionReason = rejectionReason;
    }

    await kyc.save();

    // Update user's KYC status if approved
    if (status === "approved") {
      await User.findByIdAndUpdate(kyc.userId, { isKycCompleted: true });
    }

    authLogger("Admin - KYC reviewed", adminUserId, {
      kycId,
      targetUserId: kyc.userId,
      status,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: `KYC form ${status} successfully`,
      data: { kyc },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get KYC form by ID (Admin only)
 * @route: GET /api/kyc/:id
 * @access: Private/Admin
 */
const getKYCById = async (req, res, next) => {
  try {
    const kycId = req.params.id;

    const kyc = await KYC.findById(kycId)
      .populate("userId", "firstName lastName email phoneNumber")
      .populate("reviewedBy", "firstName lastName");

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC form not found",
      });
    }

    authLogger("Admin - Get KYC by ID", req.user.userId, { kycId });

    res.json({
      statusCode: 200,
      success: true,
      message: "KYC form retrieved successfully",
      data: { kyc },
    });
  } catch (error) {
    next(error);
  }
};

export {
  createOrUpdateKYC,
  getKYC,
  getKYCStatus,
  submitKYC,
  getAllKYC,
  reviewKYC,
  getKYCById,
};
