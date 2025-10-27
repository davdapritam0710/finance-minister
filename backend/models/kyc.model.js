import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Personal Information
    personalInfo: {
      dateOfBirth: {
        type: Date,
        required: [true, "Date of birth is required"],
      },
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
        required: [true, "Gender is required"],
      },
      maritalStatus: {
        type: String,
        enum: ["single", "married", "divorced", "widowed", "separated"],
        required: [true, "Marital status is required"],
      },
      nationality: {
        type: String,
        required: [true, "Nationality is required"],
        trim: true,
      },
      occupation: {
        type: String,
        required: [true, "Occupation is required"],
        trim: true,
      },
      employerName: {
        type: String,
        trim: true,
      },
      workExperience: {
        type: Number,
        min: 0,
        max: 50,
      },
    },

    // Financial Information
    financialInfo: {
      annualIncome: {
        type: Number,
        required: [true, "Annual income is required"],
        min: 0,
      },
      incomeSource: {
        type: String,
        enum: [
          "salary",
          "business",
          "freelance",
          "investment",
          "pension",
          "other",
        ],
        required: [true, "Income source is required"],
      },
      monthlyExpenses: {
        type: Number,
        min: 0,
      },
      assets: {
        type: Number,
        min: 0,
        default: 0,
      },
      liabilities: {
        type: Number,
        min: 0,
        default: 0,
      },
      netWorth: {
        type: Number,
        default: 0,
      },
    },

    // Investment Information
    investmentInfo: {
      investmentExperience: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
        required: [true, "Investment experience is required"],
      },
      investmentGoals: [
        {
          type: String,
          enum: [
            "retirement",
            "education",
            "home_purchase",
            "wealth_building",
            "emergency_fund",
            "other",
          ],
        },
      ],
      riskTolerance: {
        type: String,
        enum: ["conservative", "moderate", "aggressive"],
        required: [true, "Risk tolerance is required"],
      },
      investmentHorizon: {
        type: String,
        enum: ["short_term", "medium_term", "long_term"],
        required: [true, "Investment horizon is required"],
      },
      preferredInvestmentTypes: [
        {
          type: String,
          enum: [
            "stocks",
            "bonds",
            "mutual_funds",
            "etfs",
            "real_estate",
            "commodities",
            "crypto",
            "other",
          ],
        },
      ],
    },

    // Compliance Information
    complianceInfo: {
      pepStatus: {
        type: String,
        enum: ["yes", "no", "family_member"],
        required: [true, "PEP status is required"],
      },
      pepDetails: {
        type: String,
        trim: true,
      },
      sanctionsCheck: {
        type: Boolean,
        default: false,
      },
      taxResidency: {
        type: String,
        required: [true, "Tax residency is required"],
        trim: true,
      },
      fatcaStatus: {
        type: String,
        enum: ["us_citizen", "us_resident", "us_person", "non_us"],
        required: [true, "FATCA status is required"],
      },
      crsStatus: {
        type: String,
        enum: ["reportable", "non_reportable"],
        required: [true, "CRS status is required"],
      },
    },

    // Documents
    documents: {
      identityDocument: {
        type: {
          type: String,
          enum: ["passport", "drivers_license", "national_id", "other"],
          required: [true, "Identity document type is required"],
        },
        number: {
          type: String,
          required: [true, "Document number is required"],
          trim: true,
        },
        expiryDate: {
          type: Date,
        },
        fileUrl: {
          type: String,
          trim: true,
        },
      },
      addressDocument: {
        type: {
          type: String,
          enum: ["utility_bill", "bank_statement", "rental_agreement", "other"],
          required: [true, "Address document type is required"],
        },
        fileUrl: {
          type: String,
          trim: true,
        },
      },
      incomeDocument: {
        type: {
          type: String,
          enum: [
            "salary_certificate",
            "tax_return",
            "bank_statement",
            "business_license",
            "other",
          ],
          required: [true, "Income document type is required"],
        },
        fileUrl: {
          type: String,
          trim: true,
        },
      },
    },

    // Status and Verification
    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "requires_documents",
      ],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
kycSchema.index({ userId: 1 });
kycSchema.index({ status: 1 });
kycSchema.index({ createdAt: -1 });

// Virtual for full name (populated from user)
kycSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Pre-save middleware to calculate net worth
kycSchema.pre("save", function (next) {
  if (
    this.financialInfo.assets !== undefined &&
    this.financialInfo.liabilities !== undefined
  ) {
    this.financialInfo.netWorth =
      this.financialInfo.assets - this.financialInfo.liabilities;
  }
  next();
});

// Method to check if KYC is complete
kycSchema.methods.isComplete = function () {
  return this.status === "approved";
};

// Method to get completion percentage
kycSchema.methods.getCompletionPercentage = function () {
  const requiredFields = [
    "personalInfo.dateOfBirth",
    "personalInfo.gender",
    "personalInfo.maritalStatus",
    "personalInfo.nationality",
    "personalInfo.occupation",
    "financialInfo.annualIncome",
    "financialInfo.incomeSource",
    "investmentInfo.investmentExperience",
    "investmentInfo.riskTolerance",
    "investmentInfo.investmentHorizon",
    "complianceInfo.pepStatus",
    "complianceInfo.taxResidency",
    "complianceInfo.fatcaStatus",
    "complianceInfo.crsStatus",
    "documents.identityDocument.type",
    "documents.identityDocument.number",
    "documents.addressDocument.type",
    "documents.incomeDocument.type",
  ];

  let completedFields = 0;
  requiredFields.forEach((field) => {
    const value = this.get(field);
    if (value !== undefined && value !== null && value !== "") {
      completedFields++;
    }
  });

  return Math.round((completedFields / requiredFields.length) * 100);
};

export default mongoose.model("KYC", kycSchema);
