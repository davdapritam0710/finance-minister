import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Conversation session ID
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    // Messages in the conversation
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        metadata: {
          tokensUsed: Number,
          model: String,
          responseTime: Number,
        },
      },
    ],

    // Conversation metadata
    metadata: {
      title: String, // Auto-generated conversation title
      totalMessages: {
        type: Number,
        default: 0,
      },
      totalTokensUsed: {
        type: Number,
        default: 0,
      },
      averageResponseTime: Number,
    },

    // Context data used in conversation
    context: {
      transactionIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
      insightIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Insight",
        },
      ],
      dateRange: {
        start: Date,
        end: Date,
      },
    },

    // Status
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },

    // Last activity
    lastActivity: {
      type: Date,
      default: Date.now,
    },

    // User rating
    rating: {
      helpful: Boolean,
      accuracy: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
  },
  { timestamps: true }
);

// Indexes
chatHistorySchema.index({ userId: 1, status: 1, lastActivity: -1 });
chatHistorySchema.index({ sessionId: 1 });

// Methods
chatHistorySchema.methods.addMessage = function (role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata,
    timestamp: new Date(),
  });

  this.metadata.totalMessages = this.messages.length;
  this.lastActivity = new Date();

  if (metadata.tokensUsed) {
    this.metadata.totalTokensUsed += metadata.tokensUsed;
  }

  return this.save();
};

chatHistorySchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// Static method to get user's recent conversations
chatHistorySchema.statics.getRecentConversations = function (
  userId,
  limit = 10
) {
  return this.find({
    userId,
    status: { $in: ["active", "archived"] },
  })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .select("sessionId metadata.title lastActivity createdAt");
};

export default model("ChatHistory", chatHistorySchema);
