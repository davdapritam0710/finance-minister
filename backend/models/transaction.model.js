import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, default: "manual" }, // e.g., manual, plaid, yodlee
    externalId: { type: String }, // Bank API transaction ID (future)
    type: { type: String, enum: ["credit", "debit"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    accountName: { type: String },
    description: { type: String },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }],
    isRecurring: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

export default model("Transaction", transactionSchema);
