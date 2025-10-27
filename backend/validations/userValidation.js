import { body } from "express-validator";

// @desc    Validation rules for user registration
const validateRegister = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("phoneNumber")
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Please provide a valid phone number"),
];

// @desc    Validation rules for user login
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// @desc    Validation rules for updating user profile
const validateUpdateProfile = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("phoneNumber")
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Please provide a valid phone number"),

  body("address.street")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Street address cannot exceed 100 characters"),

  body("address.city")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("City name cannot exceed 50 characters"),

  body("address.state")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("State name cannot exceed 50 characters"),

  body("address.zipCode")
    .optional()
    .trim()
    .matches(/^[\d\w\s\-]+$/)
    .withMessage("Please provide a valid zip code"),

  body("address.country")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Country name cannot exceed 50 characters"),

  body("preferences.theme")
    .optional()
    .isIn(["light", "dark"])
    .withMessage("Theme must be either light or dark"),

  body("preferences.notifications.email")
    .optional()
    .isBoolean()
    .withMessage("Email notification preference must be a boolean"),

  body("preferences.notifications.push")
    .optional()
    .isBoolean()
    .withMessage("Push notification preference must be a boolean"),

  // Finance preferences validation
  body("preferences.finance.currency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR"])
    .withMessage("Invalid currency selection"),

  body("preferences.finance.dateFormat")
    .optional()
    .isIn(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"])
    .withMessage("Invalid date format selection"),

  body("preferences.finance.numberFormat")
    .optional()
    .isIn(["US", "EU", "IN"])
    .withMessage("Invalid number format selection"),

  body("preferences.finance.budgetAlerts")
    .optional()
    .isBoolean()
    .withMessage("Budget alerts preference must be a boolean"),

  body("preferences.finance.defaultBudgetPeriod")
    .optional()
    .isIn(["weekly", "monthly", "yearly"])
    .withMessage("Invalid budget period selection"),

  body("preferences.finance.investmentRiskTolerance")
    .optional()
    .isIn(["conservative", "moderate", "aggressive"])
    .withMessage("Invalid risk tolerance selection"),

  body("preferences.finance.taxYear")
    .optional()
    .isNumeric()
    .withMessage("Tax year must be a number")
    .isLength({ min: 4, max: 4 })
    .withMessage("Tax year must be 4 digits"),

  body("preferences.finance.expenseCategories")
    .optional()
    .isArray()
    .withMessage("Expense categories must be an array"),

  body("preferences.finance.expenseCategories.*.name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Expense category name must be between 1 and 50 characters"),

  body("preferences.finance.expenseCategories.*.color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Expense category color must be a valid hex color"),

  body("preferences.finance.expenseCategories.*.icon")
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Expense category icon must be between 1 and 20 characters"),

  body("preferences.finance.financialGoals")
    .optional()
    .isArray()
    .withMessage("Financial goals must be an array"),

  body("preferences.finance.financialGoals.*.name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Financial goal name must be between 1 and 100 characters"),

  body("preferences.finance.financialGoals.*.targetAmount")
    .optional()
    .isNumeric()
    .withMessage("Target amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Target amount must be positive"),

  body("preferences.finance.financialGoals.*.currentAmount")
    .optional()
    .isNumeric()
    .withMessage("Current amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Current amount must be positive"),

  body("preferences.finance.financialGoals.*.targetDate")
    .optional()
    .isISO8601()
    .withMessage("Target date must be a valid date"),

  body("preferences.finance.financialGoals.*.category")
    .optional()
    .isIn(["emergency", "retirement", "education", "home", "vacation", "other"])
    .withMessage("Invalid financial goal category"),
];

// @desc    Validation rules for changing password
const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
];

// @desc    Validation rules for admin updating user
const validateUpdateUser = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["user", "admin", "moderator"])
    .withMessage("Role must be user, admin, or moderator"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

// @desc    Validation rules for forgot password
const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

// @desc    Validation rules for reset password
const validateResetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
];

export {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateUpdateUser,
  validateForgotPassword,
  validateResetPassword,
};
