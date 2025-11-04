import mongoose from "mongoose";

const { Schema, model } = mongoose;

const insightSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Type of insight
    type: {
      type: String,
      enum: [
        "spending_pattern",
        "savings_opportunity",
        "budget_alert",
        "unusual_activity",
        "goal_progress",
        "financial_health",
        "recommendation",
      ],
      required: true,
    },

    // Insight category
    category: {
      type: String,
      enum: [
        "spending",
        "saving",
        "investment",
        "budget",
        "goal",
        "alert",
        "advice",
      ],
    },

    // Priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Insight title
    title: {
      type: String,
      required: true,
    },

    // Detailed description
    description: {
      type: String,
      required: true,
    },

    // Actionable recommendations
    recommendations: [
      {
        action: String,
        impact: String,
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
        },
      },
    ],

    // Data supporting the insight
    data: {
      type: Schema.Types.Mixed,
    },

    // Metrics
    metrics: {
      currentValue: Number,
      previousValue: Number,
      change: Number,
      changePercentage: Number,
    },

    // Time period this insight relates to
    period: {
      startDate: Date,
      endDate: Date,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "acknowledged", "dismissed", "acted_upon"],
      default: "active",
    },

    // User interaction
    userFeedback: {
      helpful: Boolean,
      comment: String,
      actionTaken: Boolean,
    },

    // AI metadata
    aiMetadata: {
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
      model: String,
      generatedAt: {
        type: Date,
        default: Date.now,
      },
    },

    // Display settings
    displaySettings: {
      showOnDashboard: {
        type: Boolean,
        default: true,
      },
      notificationSent: {
        type: Boolean,
        default: false,
      },
      dismissible: {
        type: Boolean,
        default: true,
      },
    },

    // Expiry (some insights are time-sensitive)
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for queries
insightSchema.index({ userId: 1, status: 1, createdAt: -1 });
insightSchema.index({ userId: 1, type: 1 });
insightSchema.index({ userId: 1, priority: 1 });
insightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
insightSchema.methods.acknowledge = function () {
  this.status = "acknowledged";
  return this.save();
};

insightSchema.methods.dismiss = function () {
  this.status = "dismissed";
  return this.save();
};

insightSchema.methods.markActedUpon = function () {
  this.status = "acted_upon";
  if (this.userFeedback) {
    this.userFeedback.actionTaken = true;
  }
  return this.save();
};

// Static method to get active insights for user
insightSchema.statics.getActiveInsights = function (userId, limit = 10) {
  return this.find({
    userId,
    status: "active",
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit);
};

export default model("Insight", insightSchema);
