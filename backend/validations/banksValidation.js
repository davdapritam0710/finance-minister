import { body, query } from "express-validator";

// @desc    Validation rules for creating a bank
const validateCreateBank = [
  body("bankName")
    .trim()
    .notEmpty()
    .withMessage("Bank name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Bank name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,]+$/)
    .withMessage("Bank name contains invalid characters"),

  body("bankId")
    .trim()
    .notEmpty()
    .withMessage("Bank ID is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Bank ID must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage(
      "Bank ID can only contain letters, numbers, hyphens, and underscores"
    ),

  body("accountHolderName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Account holder name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s\-'.]+$/)
    .withMessage("Account holder name contains invalid characters"),

  body("accountNumber")
    .optional()
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Account number must be between 4 and 30 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Account number can only contain letters and numbers"),

  body("routingNumber")
    .optional()
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Routing number must be between 4 and 20 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Routing number can only contain letters and numbers"),

  body("accountType")
    .optional()
    .isIn(["checking", "savings", "credit", "loan", "other"])
    .withMessage(
      "Account type must be one of: checking, savings, credit, loan, other"
    ),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code")
    .isUppercase()
    .withMessage("Currency must be uppercase")
    .isIn([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "INR",
      "AED",
      "SGD",
      "HKD",
      "NZD",
      "SEK",
      "NOK",
      "DKK",
      "PLN",
      "CZK",
      "HUF",
      "RUB",
      "BRL",
      "MXN",
      "ZAR",
      "KRW",
      "THB",
      "MYR",
      "IDR",
      "PHP",
      "VND",
      "TRY",
      "ILS",
    ])
    .withMessage("Invalid currency code"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage("Country must be a 2-letter ISO code")
    .isUppercase()
    .withMessage("Country must be uppercase"),

  body("balance")
    .optional()
    .isObject()
    .withMessage("Balance must be an object"),

  body("balance.current")
    .optional()
    .isNumeric()
    .withMessage("Current balance must be a number")
    .isFloat({ min: 0 })
    .withMessage("Current balance must be greater than or equal to 0"),

  body("balance.available")
    .optional()
    .isNumeric()
    .withMessage("Available balance must be a number")
    .isFloat({ min: 0 })
    .withMessage("Available balance must be greater than or equal to 0"),

  body("status")
    .optional()
    .isIn(["linked", "pending", "failed", "disabled", "unlinked"])
    .withMessage(
      "Status must be one of: linked, pending, failed, disabled, unlinked"
    ),
];

// @desc    Validation rules for updating a bank
const validateUpdateBank = [
  body("bankName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Bank name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,]+$/)
    .withMessage("Bank name contains invalid characters"),

  body("bankId")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Bank ID must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage(
      "Bank ID can only contain letters, numbers, hyphens, and underscores"
    ),

  body("accountHolderName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Account holder name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s\-'.]+$/)
    .withMessage("Account holder name contains invalid characters"),

  body("accountNumber")
    .optional()
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage("Account number must be between 4 and 30 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Account number can only contain letters and numbers"),

  body("routingNumber")
    .optional()
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Routing number must be between 4 and 20 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Routing number can only contain letters and numbers"),

  body("accountType")
    .optional()
    .isIn(["checking", "savings", "credit", "loan", "other"])
    .withMessage(
      "Account type must be one of: checking, savings, credit, loan, other"
    ),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code")
    .isUppercase()
    .withMessage("Currency must be uppercase")
    .isIn([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "INR",
      "AED",
      "SGD",
      "HKD",
      "NZD",
      "SEK",
      "NOK",
      "DKK",
      "PLN",
      "CZK",
      "HUF",
      "RUB",
      "BRL",
      "MXN",
      "ZAR",
      "KRW",
      "THB",
      "MYR",
      "IDR",
      "PHP",
      "VND",
      "TRY",
      "ILS",
    ])
    .withMessage("Invalid currency code"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage("Country must be a 2-letter ISO code")
    .isUppercase()
    .withMessage("Country must be uppercase"),

  body("balance")
    .optional()
    .isObject()
    .withMessage("Balance must be an object"),

  body("balance.current")
    .optional()
    .isNumeric()
    .withMessage("Current balance must be a number")
    .isFloat({ min: 0 })
    .withMessage("Current balance must be greater than or equal to 0"),

  body("balance.available")
    .optional()
    .isNumeric()
    .withMessage("Available balance must be a number")
    .isFloat({ min: 0 })
    .withMessage("Available balance must be greater than or equal to 0"),

  body("status")
    .optional()
    .isIn(["linked", "pending", "failed", "disabled", "unlinked"])
    .withMessage(
      "Status must be one of: linked, pending, failed, disabled, unlinked"
    ),
];

// @desc    Validation rules for updating bank balance
const validateUpdateBalance = [
  body("current")
    .optional()
    .isNumeric()
    .withMessage("Current balance must be a number")
    .isFloat({ min: 0 })
    .withMessage("Current balance must be greater than or equal to 0"),

  body("available")
    .optional()
    .isNumeric()
    .withMessage("Available balance must be a number")
    .isFloat({ min: 0 })
    .withMessage("Available balance must be greater than or equal to 0"),

  body().custom((value) => {
    if (value.current === undefined && value.available === undefined) {
      throw new Error(
        "At least one balance field (current or available) is required"
      );
    }
    return true;
  }),
];

// @desc    Validation rules for query parameters
const validateBankQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["linked", "pending", "failed", "disabled", "unlinked"])
    .withMessage(
      "Status must be one of: linked, pending, failed, disabled, unlinked"
    ),

  query("accountType")
    .optional()
    .isIn(["checking", "savings", "credit", "loan", "other"])
    .withMessage(
      "Account type must be one of: checking, savings, credit, loan, other"
    ),

  query("currency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code")
    .isUppercase()
    .withMessage("Currency must be uppercase"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,]+$/)
    .withMessage("Search term contains invalid characters"),
];

export {
  validateCreateBank,
  validateUpdateBank,
  validateUpdateBalance,
  validateBankQuery,
};
