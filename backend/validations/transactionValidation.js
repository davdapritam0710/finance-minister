import { body } from "express-validator";

// @desc    Validation rules for creating a transaction
const validateCreateTransaction = [
  body("type")
    .notEmpty()
    .withMessage("Transaction type is required")
    .isIn(["credit", "debit"])
    .withMessage("Transaction type must be either credit or debit"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-_&]+$/)
    .withMessage(
      "Category can only contain letters, numbers, spaces, hyphens, underscores, and ampersands"
    ),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

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
      "CLP",
      "COP",
      "PEN",
      "UYU",
      "ARS",
      "BOB",
      "PYG",
      "VES",
      "GTQ",
      "HNL",
      "NIO",
      "CRC",
      "PAB",
      "DOP",
      "JMD",
      "TTD",
      "BBD",
      "BZD",
      "XCD",
      "AWG",
      "ANG",
      "SRD",
      "GYD",
      "BMD",
      "KYD",
      "FKP",
      "SHP",
      "SBD",
      "VUV",
      "WST",
      "TOP",
      "FJD",
      "PGK",
      "NPR",
      "LKR",
      "BDT",
      "PKR",
      "AFN",
      "TJS",
      "KGS",
      "UZS",
      "KZT",
      "TMT",
      "AZN",
      "AMD",
      "GEL",
      "MDL",
      "BGN",
      "RON",
      "HRK",
      "RSD",
      "MKD",
      "ALL",
      "BAM",
      "MNT",
      "LAK",
      "KHR",
      "MMK",
      "BTN",
      "MVR",
      "SCR",
      "MUR",
      "MGA",
      "KMF",
      "DJF",
      "ETB",
      "ERN",
      "SOS",
      "TZS",
      "UGX",
      "RWF",
      "BIF",
      "CDF",
      "AOA",
      "ZMW",
      "BWP",
      "SZL",
      "LSL",
      "NAD",
      "MZN",
      "MWK",
      "ZWL",
      "GMD",
      "GNF",
      "LRD",
      "SLL",
      "CVE",
      "STN",
      "XOF",
      "XAF",
      "XPF",
      "KMF",
      "DJF",
      "ETB",
      "ERN",
      "SOS",
      "TZS",
      "UGX",
      "RWF",
      "BIF",
      "CDF",
      "AOA",
      "ZMW",
      "BWP",
      "SZL",
      "LSL",
      "NAD",
      "MZN",
      "MWK",
      "ZWL",
      "GMD",
      "GNF",
      "LRD",
      "SLL",
      "CVE",
      "STN",
    ])
    .withMessage("Invalid currency code"),

  body("accountName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Account name must be between 1 and 100 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,]+$/)
    .withMessage("Account name contains invalid characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,!'@#$%^&*()_+=\[\]{}|;':",./<>?`~]*$/)
    .withMessage("Description contains invalid characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date")
    .custom((value) => {
      const inputDate = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      const oneYearFromNow = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate()
      );

      if (inputDate < oneYearAgo || inputDate > oneYearFromNow) {
        throw new Error(
          "Date must be within the last year and not more than one year in the future"
        );
      }
      return true;
    }),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error("Maximum 10 tags allowed");
      }
      return true;
    }),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage(
      "Tags can only contain letters, numbers, spaces, hyphens, and underscores"
    ),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean value"),

  body("source")
    .optional()
    .trim()
    .isIn(["manual", "plaid", "yodlee", "bank_api", "csv_import", "mobile_app"])
    .withMessage("Invalid source type"),
];

// @desc    Validation rules for updating a transaction
const validateUpdateTransaction = [
  body("type")
    .optional()
    .isIn(["credit", "debit"])
    .withMessage("Transaction type must be either credit or debit"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-_&]+$/)
    .withMessage(
      "Category can only contain letters, numbers, spaces, hyphens, underscores, and ampersands"
    ),

  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

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
      "CLP",
      "COP",
      "PEN",
      "UYU",
      "ARS",
      "BOB",
      "PYG",
      "VES",
      "GTQ",
      "HNL",
      "NIO",
      "CRC",
      "PAB",
      "DOP",
      "JMD",
      "TTD",
      "BBD",
      "BZD",
      "XCD",
      "AWG",
      "ANG",
      "SRD",
      "GYD",
      "BMD",
      "KYD",
      "FKP",
      "SHP",
      "SBD",
      "VUV",
      "WST",
      "TOP",
      "FJD",
      "PGK",
      "NPR",
      "LKR",
      "BDT",
      "PKR",
      "AFN",
      "TJS",
      "KGS",
      "UZS",
      "KZT",
      "TMT",
      "AZN",
      "AMD",
      "GEL",
      "MDL",
      "BGN",
      "RON",
      "HRK",
      "RSD",
      "MKD",
      "ALL",
      "BAM",
      "MNT",
      "LAK",
      "KHR",
      "MMK",
      "BTN",
      "MVR",
      "SCR",
      "MUR",
      "MGA",
      "KMF",
      "DJF",
      "ETB",
      "ERN",
      "SOS",
      "TZS",
      "UGX",
      "RWF",
      "BIF",
      "CDF",
      "AOA",
      "ZMW",
      "BWP",
      "SZL",
      "LSL",
      "NAD",
      "MZN",
      "MWK",
      "ZWL",
      "GMD",
      "GNF",
      "LRD",
      "SLL",
      "CVE",
      "STN",
      "XOF",
      "XAF",
      "XPF",
      "KMF",
      "DJF",
      "ETB",
      "ERN",
      "SOS",
      "TZS",
      "UGX",
      "RWF",
      "BIF",
      "CDF",
      "AOA",
      "ZMW",
      "BWP",
      "SZL",
      "LSL",
      "NAD",
      "MZN",
      "MWK",
      "ZWL",
      "GMD",
      "GNF",
      "LRD",
      "SLL",
      "CVE",
      "STN",
    ])
    .withMessage("Invalid currency code"),

  body("accountName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Account name must be between 1 and 100 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,]+$/)
    .withMessage("Account name contains invalid characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,!'@#$%^&*()_+=\[\]{}|;':",./<>?`~]*$/)
    .withMessage("Description contains invalid characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date")
    .custom((value) => {
      const inputDate = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      const oneYearFromNow = new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate()
      );

      if (inputDate < oneYearAgo || inputDate > oneYearFromNow) {
        throw new Error(
          "Date must be within the last year and not more than one year in the future"
        );
      }
      return true;
    }),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error("Maximum 10 tags allowed");
      }
      return true;
    }),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage(
      "Tags can only contain letters, numbers, spaces, hyphens, and underscores"
    ),

  body("isRecurring")
    .optional()
    .isBoolean()
    .withMessage("isRecurring must be a boolean value"),

  body("source")
    .optional()
    .trim()
    .isIn(["manual", "plaid", "yodlee", "bank_api", "csv_import", "mobile_app"])
    .withMessage("Invalid source type"),

  body("externalId")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("External ID must be between 1 and 100 characters")
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage(
      "External ID can only contain letters, numbers, hyphens, and underscores"
    ),
];

// @desc    Validation rules for query parameters
const validateTransactionQuery = [
  body("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  body("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  body("type")
    .optional()
    .isIn(["credit", "debit"])
    .withMessage("Type must be either credit or debit"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .custom((value, { req }) => {
      if (req.body.startDate && value) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        if (endDate < startDate) {
          throw new Error("End date must be after start date");
        }
      }
      return true;
    }),

  body("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters")
    .matches(/^[a-zA-Z0-9\s\-_&().,!'@#$%^&*()_+=\[\]{}|;':",./<>?`~]*$/)
    .withMessage("Search term contains invalid characters"),

  body("period")
    .optional()
    .isIn(["week", "month", "year"])
    .withMessage("Period must be week, month, or year"),
];

export {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateTransactionQuery,
};
