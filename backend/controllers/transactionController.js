import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import { validationResult } from "express-validator";
import { dbLogger, authLogger } from "../middlewares/logger.js";

/**
 * @description: Get all transactions for a user
 * @route: GET /api/transactions
 * @access: Private
 */
const getAllTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { type, category, startDate, endDate, search } = req.query;

    // Build filter object
    const filter = { userId: req.user.userId, isDeleted: false };

    // Add type filter
    if (type && ["credit", "debit"].includes(type)) {
      filter.type = type;
    }

    // Add category filter
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // Add date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Add search filter
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { accountName: { $regex: search, $options: "i" } },
      ];
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName email");

    const total = await Transaction.countDocuments(filter);

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const summary = await Transaction.aggregate([
      { $match: { ...filter, userId } },
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] },
          },
          totalDebit: {
            $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] },
          },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    const summaryData = summary[0] || {
      totalCredit: 0,
      totalDebit: 0,
      transactionCount: 0,
    };

    // Log transaction access
    authLogger("Get all transactions", req.user.userId, {
      page,
      limit,
      filters: { type, category, startDate, endDate, search },
    });
    dbLogger("read", "transactions", {
      userId: req.user.userId,
      pagination: { page, limit },
      filters: { type, category, startDate, endDate, search },
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Transactions fetched successfully",
      data: {
        transactions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
        summary: {
          totalCredit: summaryData.totalCredit,
          totalDebit: summaryData.totalDebit,
          netAmount: summaryData.totalCredit - summaryData.totalDebit,
          transactionCount: summaryData.transactionCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get a single transaction by ID
 * @route: GET /api/transactions/:id
 * @access: Private
 */
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.userId,
      isDeleted: false,
    }).populate("userId", "firstName lastName email");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Log transaction access
    authLogger("Get transaction by ID", req.user.userId, {
      transactionId: req.params.id,
    });
    dbLogger("read", "transactions", {
      userId: req.user.userId,
      transactionId: req.params.id,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Transaction fetched successfully",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Create a new transaction
 * @route: POST /api/transactions
 * @access: Private
 */
const createTransaction = async (req, res, next) => {
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
      type,
      category,
      amount,
      currency,
      accountName,
      description,
      date,
      tags,
      isRecurring,
      source,
      externalId,
    } = req.body;

    // Create new transaction
    const transaction = new Transaction({
      userId: req.user.userId,
      type,
      category,
      amount,
      currency: currency || "INR",
      accountName,
      description,
      date: date ? new Date(date) : new Date(),
      tags: tags || [],
      isRecurring: isRecurring || false,
      source: source || "manual",
      externalId,
    });

    await transaction.save();

    // Log transaction creation
    authLogger("Create transaction", req.user.userId, {
      transactionId: transaction._id,
      type,
      category,
      amount,
    });
    dbLogger("create", "transactions", {
      userId: req.user.userId,
      transactionId: transaction._id,
      type,
      category,
      amount,
    });

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Transaction created successfully",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Update a transaction
 * @route: PUT /api/transactions/:id
 * @access: Private
 */
const updateTransaction = async (req, res, next) => {
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
      "type",
      "category",
      "amount",
      "currency",
      "accountName",
      "description",
      "date",
      "tags",
      "isRecurring",
      "source",
      "externalId",
    ];
    const updates = {};

    // Only allow certain fields to be updated
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Convert date string to Date object if provided
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId, isDeleted: false },
      updates,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Log transaction update
    authLogger("Update transaction", req.user.userId, {
      transactionId: req.params.id,
      updatedFields: Object.keys(updates),
    });
    dbLogger("update", "transactions", {
      userId: req.user.userId,
      transactionId: req.params.id,
      updates,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Transaction updated successfully",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Soft delete a transaction
 * @route: DELETE /api/transactions/:id
 * @access: Private
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Log transaction deletion
    authLogger("Delete transaction", req.user.userId, {
      transactionId: req.params.id,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
    });
    dbLogger("delete", "transactions", {
      userId: req.user.userId,
      transactionId: req.params.id,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description: Get transaction statistics
 * @route: GET /api/transactions/stats
 * @access: Private
 */
const getTransactionStats = async (req, res, next) => {
  try {
    const { period = "month" } = req.query;
    let startDate, endDate;

    // Calculate date range based on period
    const now = new Date();
    switch (period) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.userId,
          isDeleted: false,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] },
          },
          totalDebit: {
            $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] },
          },
          transactionCount: { $sum: 1 },
          avgTransactionAmount: { $avg: "$amount" },
        },
      },
    ]);

    // Get category-wise breakdown
    const categoryStats = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.userId,
          isDeleted: false,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          creditAmount: {
            $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] },
          },
          debitAmount: {
            $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
    ]);

    const result = stats[0] || {
      totalCredit: 0,
      totalDebit: 0,
      transactionCount: 0,
      avgTransactionAmount: 0,
    };

    // Log stats access
    authLogger("Get transaction stats", req.user.userId, { period });
    dbLogger("read", "transactions", {
      userId: req.user.userId,
      operation: "stats",
      period,
    });

    res.json({
      statusCode: 200,
      success: true,
      message: "Transaction statistics fetched successfully",
      data: {
        period,
        dateRange: { startDate, endDate },
        summary: {
          totalCredit: result.totalCredit,
          totalDebit: result.totalDebit,
          netAmount: result.totalCredit - result.totalDebit,
          transactionCount: result.transactionCount,
          avgTransactionAmount: result.avgTransactionAmount,
        },
        categoryBreakdown: categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
};
