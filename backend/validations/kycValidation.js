import { body } from "express-validator";

// @desc    Validation rules for KYC form
const validateKYC = [
  // Personal Information
  body("personalInfo.dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Please provide a valid date of birth")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        throw new Error("You must be at least 18 years old");
      }
      if (age > 100) {
        throw new Error("Please provide a valid date of birth");
      }
      return true;
    }),

  body("personalInfo.gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other", "prefer_not_to_say"])
    .withMessage("Invalid gender selection"),

  body("personalInfo.maritalStatus")
    .notEmpty()
    .withMessage("Marital status is required")
    .isIn(["single", "married", "divorced", "widowed", "separated"])
    .withMessage("Invalid marital status"),

  body("personalInfo.nationality")
    .notEmpty()
    .withMessage("Nationality is required")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nationality must be between 2 and 50 characters"),

  body("personalInfo.occupation")
    .notEmpty()
    .withMessage("Occupation is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Occupation must be between 2 and 100 characters"),

  body("personalInfo.employerName")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Employer name cannot exceed 100 characters"),

  body("personalInfo.workExperience")
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage("Work experience must be between 0 and 50 years"),

  // Financial Information
  body("financialInfo.annualIncome")
    .notEmpty()
    .withMessage("Annual income is required")
    .isFloat({ min: 0 })
    .withMessage("Annual income must be a positive number"),

  body("financialInfo.incomeSource")
    .notEmpty()
    .withMessage("Income source is required")
    .isIn(["salary", "business", "freelance", "investment", "pension", "other"])
    .withMessage("Invalid income source"),

  body("financialInfo.monthlyExpenses")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly expenses must be a positive number"),

  body("financialInfo.assets")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Assets must be a positive number"),

  body("financialInfo.liabilities")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Liabilities must be a positive number"),

  // Investment Information
  body("investmentInfo.investmentExperience")
    .notEmpty()
    .withMessage("Investment experience is required")
    .isIn(["beginner", "intermediate", "advanced", "expert"])
    .withMessage("Invalid investment experience level"),

  body("investmentInfo.investmentGoals")
    .optional()
    .isArray()
    .withMessage("Investment goals must be an array"),

  body("investmentInfo.investmentGoals.*")
    .optional()
    .isIn([
      "retirement",
      "education",
      "home_purchase",
      "wealth_building",
      "emergency_fund",
      "other",
    ])
    .withMessage("Invalid investment goal"),

  body("investmentInfo.riskTolerance")
    .notEmpty()
    .withMessage("Risk tolerance is required")
    .isIn(["conservative", "moderate", "aggressive"])
    .withMessage("Invalid risk tolerance"),

  body("investmentInfo.investmentHorizon")
    .notEmpty()
    .withMessage("Investment horizon is required")
    .isIn(["short_term", "medium_term", "long_term"])
    .withMessage("Invalid investment horizon"),

  body("investmentInfo.preferredInvestmentTypes")
    .optional()
    .isArray()
    .withMessage("Preferred investment types must be an array"),

  body("investmentInfo.preferredInvestmentTypes.*")
    .optional()
    .isIn([
      "stocks",
      "bonds",
      "mutual_funds",
      "etfs",
      "real_estate",
      "commodities",
      "crypto",
      "other",
    ])
    .withMessage("Invalid investment type"),

  // Compliance Information
  body("complianceInfo.pepStatus")
    .notEmpty()
    .withMessage("PEP status is required")
    .isIn(["yes", "no", "family_member"])
    .withMessage("Invalid PEP status"),

  body("complianceInfo.pepDetails")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("PEP details cannot exceed 500 characters"),

  body("complianceInfo.sanctionsCheck")
    .optional()
    .isBoolean()
    .withMessage("Sanctions check must be a boolean"),

  body("complianceInfo.taxResidency")
    .notEmpty()
    .withMessage("Tax residency is required")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tax residency must be between 2 and 50 characters"),

  body("complianceInfo.fatcaStatus")
    .notEmpty()
    .withMessage("FATCA status is required")
    .isIn(["us_citizen", "us_resident", "us_person", "non_us"])
    .withMessage("Invalid FATCA status"),

  body("complianceInfo.crsStatus")
    .notEmpty()
    .withMessage("CRS status is required")
    .isIn(["reportable", "non_reportable"])
    .withMessage("Invalid CRS status"),

  // Documents
  body("documents.identityDocument.type")
    .notEmpty()
    .withMessage("Identity document type is required")
    .isIn(["passport", "drivers_license", "national_id", "other"])
    .withMessage("Invalid identity document type"),

  body("documents.identityDocument.number")
    .notEmpty()
    .withMessage("Document number is required")
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Document number must be between 5 and 50 characters"),

  body("documents.identityDocument.expiryDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid expiry date"),

  body("documents.identityDocument.fileUrl")
    .optional()
    .isURL()
    .withMessage("Please provide a valid file URL"),

  body("documents.addressDocument.type")
    .notEmpty()
    .withMessage("Address document type is required")
    .isIn(["utility_bill", "bank_statement", "rental_agreement", "other"])
    .withMessage("Invalid address document type"),

  body("documents.addressDocument.fileUrl")
    .optional()
    .isURL()
    .withMessage("Please provide a valid file URL"),

  body("documents.incomeDocument.type")
    .notEmpty()
    .withMessage("Income document type is required")
    .isIn([
      "salary_certificate",
      "tax_return",
      "bank_statement",
      "business_license",
      "other",
    ])
    .withMessage("Invalid income document type"),

  body("documents.incomeDocument.fileUrl")
    .optional()
    .isURL()
    .withMessage("Please provide a valid file URL"),
];

// @desc    Validation rules for KYC review (Admin)
const validateKYCReview = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["approved", "rejected", "requires_documents"])
    .withMessage("Invalid status"),

  body("rejectionReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Rejection reason cannot exceed 500 characters"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),
];

export { validateKYC, validateKYCReview };
