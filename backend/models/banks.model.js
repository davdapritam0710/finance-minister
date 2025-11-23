import mongoose from "mongoose";
import crypto from "crypto";

// Encryption key for account number and routing number
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "finance-minister-encryption-key";
const ENC_ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const KEY_LENGTH = 32; // 32 bytes for AES-256

// Get or derive encryption key (must be exactly 32 bytes)
function getEncryptionKey() {
  if (!ENCRYPTION_KEY) {
    throw new Error("Missing ENCRYPTION_KEY env var for encryption");
  }

  // Try to decode as base64 first
  try {
    const decoded = Buffer.from(ENCRYPTION_KEY, "base64");
    if (decoded.length === KEY_LENGTH) {
      return decoded;
    }
  } catch (e) {
    // Not valid base64, will derive from string
  }

  // If not base64 or wrong length, derive a 32-byte key using SHA-256
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

function encryptField(plain) {
  if (!plain) return null;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ENC_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plain), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // store as base64 iv:tag:ciphertext
  return `${iv.toString("base64")}:${tag.toString(
    "base64"
  )}:${encrypted.toString("base64")}`;
}

function decryptField(ciphertext) {
  if (!ciphertext) return null;
  const key = getEncryptionKey();
  const parts = String(ciphertext).split(":");
  if (parts.length !== 3) return null;
  const [ivB64, tagB64, ctB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ct = Buffer.from(ctB64, "base64");
  const decipher = crypto.createDecipheriv(ENC_ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ct), decipher.final()]);
  return dec.toString("utf8");
}

function maskAccountNumber(accountNumber, showLast = 4) {
  if (!accountNumber) return null;
  const clean = String(accountNumber).replace(/\s+/g, "");
  const last = clean.slice(-showLast);
  const maskedLen = Math.max(0, clean.length - showLast);
  return `${"*".repeat(maskedLen)}${last}`;
}

const bankSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    bankId: {
      type: String,
      required: true,
    },

    // Account details (sensitive fields are encrypted)
    accountHolderName: { type: String, default: null },
    accountNumber: { type: String, default: null }, // encrypted - stored encrypted
    maskedAccount: { type: String, default: null },

    // Routing number is used for international transfers
    // Not required for domestic transfers
    // They are kind of IFSC code, branch code, etc.
    routingNumber: { type: String, default: null }, // encrypted - stored encrypted
    accountType: {
      type: String,
      enum: ["checking", "savings", "credit", "loan", "other"],
      default: "checking",
    },

    // Basic display / metadata
    currency: { type: String, default: "INR" },
    country: { type: String, default: "IN" },

    // Balance
    balance: {
      current: { type: Number, default: 0 }, // in the account currency unit
      available: { type: Number, default: 0 },
      lastUpdatedAt: { type: Date, default: null },
    },

    // Linking status & timestamps
    status: {
      type: String,
      enum: ["linked", "pending", "failed", "disabled", "unlinked"],
      default: "pending",
    },
    linkedAt: { type: Date, default: null },
    unlinkedAt: { type: Date, default: null },

    // Soft-delete
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Method to decrypt and get account number
bankSchema.methods.getAccountNumber = function () {
  if (!this.accountNumber) return null;
  try {
    return decryptField(this.accountNumber);
  } catch (e) {
    return null;
  }
};

// Method to decrypt and get routing number
bankSchema.methods.getRoutingNumber = function () {
  if (!this.routingNumber) return null;
  try {
    return decryptField(this.routingNumber);
  } catch (e) {
    return null;
  }
};

// Method to set account number (encrypts automatically)
bankSchema.methods.setAccountNumber = function (plain) {
  if (plain) {
    this.accountNumber = encryptField(plain);
    this.maskedAccount = maskAccountNumber(plain, 4);
  } else {
    this.accountNumber = null;
    this.maskedAccount = null;
  }
};

// Method to set routing number (encrypts automatically)
bankSchema.methods.setRoutingNumber = function (plain) {
  if (plain) {
    this.routingNumber = encryptField(plain);
  } else {
    this.routingNumber = null;
  }
};

// Method to get masked account number
bankSchema.methods.getMaskedAccount = function (showLast = 4) {
  if (this.maskedAccount) return this.maskedAccount;
  const acct = this.getAccountNumber();
  return maskAccountNumber(acct, showLast);
};

bankSchema.methods.safeJSON = function () {
  return {
    id: this._id,
    user: this.user,
    bankName: this.bankName,
    bankId: this.bankId,
    accountHolderName: this.accountHolderName,
    accountType: this.accountType,
    maskedAccount: this.getMaskedAccount(),
    currency: this.currency,
    balance: this.balance,
    status: this.status,
    linkedAt: this.linkedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

bankSchema.pre("save", function (next) {
  try {
    // If accountNumber is set and maskedAccount is not, generate it
    if (this.accountNumber && !this.maskedAccount) {
      try {
        const acct = decryptField(this.accountNumber);
        this.maskedAccount = maskAccountNumber(acct, 4);
      } catch (e) {
        // If decryption fails, accountNumber might already be encrypted
        // Try to decrypt it to generate masked account
        console.warn(
          "Could not decrypt account number for masking:",
          e.message
        );
      }
    }

    // If accountNumber is being set as plain text, encrypt it
    if (this.isModified("accountNumber") && this.accountNumber) {
      // Check if it's already encrypted (contains colons from encryption format)
      if (!this.accountNumber.includes(":")) {
        // It's plain text, encrypt it
        const plain = this.accountNumber;
        this.accountNumber = encryptField(plain);
        this.maskedAccount = maskAccountNumber(plain, 4);
      }
    }

    // If routingNumber is being set as plain text, encrypt it
    if (this.isModified("routingNumber") && this.routingNumber) {
      // Check if it's already encrypted (contains colons from encryption format)
      if (!this.routingNumber.includes(":")) {
        // It's plain text, encrypt it
        this.routingNumber = encryptField(this.routingNumber);
      }
    }
  } catch (e) {
    console.error("Error in bankSchema.pre('save'):", e);
  }
  next();
});

const Bank = mongoose.model("Bank", bankSchema);

export default Bank;
