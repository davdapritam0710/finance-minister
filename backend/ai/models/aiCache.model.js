import mongoose from "mongoose";

const { Schema, model } = mongoose;

const aiCacheSchema = new Schema(
  {
    // Cache key (hash of request)
    cacheKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Type of AI operation
    operationType: {
      type: String,
      enum: [
        "categorization",
        "insight",
        "chatbot",
        "prediction",
        "recommendation",
      ],
      required: true,
      index: true,
    },

    // Input data (for debugging/audit)
    input: {
      type: Schema.Types.Mixed,
    },

    // Cached response
    response: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // Provider used
    provider: {
      type: String,
      enum: ["openai", "claude", "gemini", "local"],
      required: true,
    },

    // Metadata
    metadata: {
      model: String,
      tokensUsed: Number,
      responseTime: Number, // milliseconds
      cost: Number, // estimated cost in USD
    },

    // Hit count (how many times this cache was used)
    hitCount: {
      type: Number,
      default: 0,
    },

    // Last accessed
    lastAccessed: {
      type: Date,
      default: Date.now,
    },

    // Expiry
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for cleanup
aiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for operations
aiCacheSchema.index({ operationType: 1, createdAt: -1 });

// Update hit count and last accessed on retrieval
aiCacheSchema.methods.recordHit = function () {
  this.hitCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

export default model("AICache", aiCacheSchema);
