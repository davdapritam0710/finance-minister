import mongoose from "mongoose";
import Bank from "../models/banks.model.js";
import { validationResult } from "express-validator";
import { authLogger } from "../middlewares/logger.js";

/**
 * @description: Get all banks for a user
 * @route: GET /api/banks
 * @access: Private
 */
const getAllBanks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, accountType, currency, search } = req.query;

    // Build filter object
    const filter = { user: req.user.userId, deleted: false };

    // Add status filter
    if (
      status &&
      ["linked", "pending", "failed", "disabled", "unlinked"].includes(status)
    ) {
      filter.status = status;
    }

    // Add account type filter
    if (
      accountType &&
      ["checking", "savings", "credit", "loan", "other"].includes(accountType)
    ) {
      filter.accountType = accountType;
    }

    // Add currency filter
    if (currency) {
      filter.currency = currency.toUpperCase();
    }

    // Add search filter
    if (search) {
      filter.$or = [
        { bankName: { $regex: search, $options: "i" } },
        { accountHolderName: { $regex: search, $options: "i" } },
        { bankId: { $regex: search, $options: "i" } },
      ];
    }

    const banks = await Bank.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName lastName email")
      .lean();

    // Use safeJSON to mask sensitive data
    const safeBanks = banks.map((bank) => {
      const bankDoc = new Bank(bank);
      return bankDoc.safeJSON();
    });

    const total = await Bank.countDocuments(filter);

    // Log bank access
    authLogger("Get all banks", req.user.userId, {
      page,
      limit,
      filters: { status, accountType, currency, search },
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Banks fetched successfully",
      data: {
        banks: safeBanks,
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
 * @description: Get a single bank by ID
 * @route: GET /api/banks/:id
 * @access: Private
 */
const getBankById = async (req, res, next) => {
  try {
    const bank = await Bank.findOne({
      _id: req.params.id,
      user: req.user.userId,
      deleted: false,
    }).populate("user", "firstName lastName email");

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    // Use safeJSON to mask sensitive data
    const safeBank = bank.safeJSON();

    // Log bank access
    authLogger("Get bank by ID", req.user.userId, {
      bankId: req.params.id,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Bank fetched successfully",
      data: { bank: safeBank },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Create a new bank
 * @route: POST /api/banks
 * @access: Private
 */
const createBank = async (req, res, next) => {
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

    const {
      bankName,
      bankId,
      accountHolderName,
      accountNumber,
      routingNumber,
      accountType,
      currency,
      country,
      balance,
      status,
    } = req.body;

    // Create new bank
    const bank = new Bank({
      user: req.user.userId,
      bankName,
      bankId,
      accountHolderName: accountHolderName || null,
      accountType: accountType || "checking",
      currency: currency || "INR",
      country: country || "IN",
      balance: balance
        ? {
            current: balance.current || 0,
            available: balance.available || balance.current || 0,
            lastUpdatedAt: new Date(),
          }
        : {
            current: 0,
            available: 0,
            lastUpdatedAt: null,
          },
      status: status || "pending",
      linkedAt: status === "linked" ? new Date() : null,
    });

    // Set encrypted fields using methods (will encrypt automatically)
    if (accountNumber) {
      bank.setAccountNumber(accountNumber);
    }
    if (routingNumber) {
      bank.setRoutingNumber(routingNumber);
    }

    await bank.save();

    // Use safeJSON to mask sensitive data
    const safeBank = bank.safeJSON();

    // Log bank creation
    authLogger("Create bank", req.user.userId, {
      bankId: bank._id,
      bankName,
      accountType,
    });

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Bank created successfully",
      data: { bank: safeBank },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Update a bank
 * @route: PUT /api/banks/:id
 * @access: Private
 */
const updateBank = async (req, res, next) => {
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
      "bankName",
      "bankId",
      "accountHolderName",
      "accountNumber",
      "routingNumber",
      "accountType",
      "currency",
      "country",
      "balance",
      "status",
    ];
    const updates = {};

    // Only allow certain fields to be updated
    // Handle accountNumber and routingNumber separately for encryption
    const accountNumber = req.body.accountNumber;
    const routingNumber = req.body.routingNumber;

    allowedUpdates.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        field !== "accountNumber" &&
        field !== "routingNumber"
      ) {
        updates[field] = req.body[field];
      }
    });

    // Handle balance update
    if (updates.balance) {
      updates.balance = {
        current: updates.balance.current || 0,
        available: updates.balance.available || updates.balance.current || 0,
        lastUpdatedAt: new Date(),
      };
    }

    // Handle status change - update linkedAt/unlinkedAt accordingly
    if (updates.status) {
      if (updates.status === "linked" && !updates.linkedAt) {
        updates.linkedAt = new Date();
      } else if (updates.status === "unlinked") {
        updates.unlinkedAt = new Date();
      }
    }

    let bank = await Bank.findOne({
      _id: req.params.id,
      user: req.user.userId,
      deleted: false,
    });

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
      bank[key] = updates[key];
    });

    // Handle encrypted fields separately
    if (accountNumber !== undefined) {
      bank.setAccountNumber(accountNumber);
    }
    if (routingNumber !== undefined) {
      bank.setRoutingNumber(routingNumber);
    }

    await bank.save();

    // Use safeJSON to mask sensitive data
    const safeBank = bank.safeJSON();

    // Log bank update
    authLogger("Update bank", req.user.userId, {
      bankId: req.params.id,
      updatedFields: Object.keys(updates),
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Bank updated successfully",
      data: { bank: safeBank },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Soft delete a bank
 * @route: DELETE /api/banks/:id
 * @access: Private
 */
const deleteBank = async (req, res, next) => {
  try {
    const bank = await Bank.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId, deleted: false },
      { deleted: true, deletedAt: new Date(), status: "unlinked" },
      { new: true }
    );

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    // Log bank deletion
    authLogger("Delete bank", req.user.userId, {
      bankId: req.params.id,
      bankName: bank.bankName,
      accountType: bank.accountType,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Bank deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Update bank balance
 * @route: PATCH /api/banks/:id/balance
 * @access: Private
 */
const updateBankBalance = async (req, res, next) => {
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

    const { current, available } = req.body;

    if (current === undefined && available === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "At least one balance field (current or available) is required",
      });
    }

    const bank = await Bank.findOne({
      _id: req.params.id,
      user: req.user.userId,
      deleted: false,
    });

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    // Update balance
    bank.balance.current =
      current !== undefined ? current : bank.balance.current;
    bank.balance.available =
      available !== undefined ? available : bank.balance.available;
    bank.balance.lastUpdatedAt = new Date();

    await bank.save();

    // Use safeJSON to mask sensitive data
    const safeBank = bank.safeJSON();

    // Log balance update
    authLogger("Update bank balance", req.user.userId, {
      bankId: req.params.id,
      current: bank.balance.current,
      available: bank.balance.available,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Bank balance updated successfully",
      data: { bank: safeBank },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Link a bank (change status to linked)
 * @route: PATCH /api/banks/:id/link
 * @access: Private
 */
const linkBank = async (req, res, next) => {
  try {
    const bank = await Bank.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId, deleted: false },
      { status: "linked", linkedAt: new Date() },
      { new: true }
    );

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    // Use safeJSON to mask sensitive data
    const safeBank = bank.safeJSON();

    // Log bank linking
    authLogger("Link bank", req.user.userId, {
      bankId: req.params.id,
      bankName: bank.bankName,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Bank linked successfully",
      data: { bank: safeBank },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Unlink a bank (change status to unlinked)
 * @route: PATCH /api/banks/:id/unlink
 * @access: Private
 */
const unlinkBank = async (req, res, next) => {
  try {
    const bank = await Bank.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId, deleted: false },
      { status: "unlinked", unlinkedAt: new Date() },
      { new: true }
    );

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    // Use safeJSON to mask sensitive data
    const safeBank = bank.safeJSON();

    // Log bank unlinking
    authLogger("Unlink bank", req.user.userId, {
      bankId: req.params.id,
      bankName: bank.bankName,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Bank unlinked successfully",
      data: { bank: safeBank },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
  deleteBank,
  updateBankBalance,
  linkBank,
  unlinkBank,
};
