// @desc    Application configuration
const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database configuration
  mongodb: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/finance-minister",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    },
  },

  // JWT configuration
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production",
    expiresIn: process.env.JWT_EXPIRE || "7d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  },

  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
    optionsSuccessStatus: 200,
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    authMax: 5, // limit auth routes to 5 requests per windowMs
    passwordResetMax: 3, // limit password reset to 3 requests per hour
  },

  // Security configuration
  security: {
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutTime: 2 * 60 * 60 * 1000, // 2 hours
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Email configuration (for future use)
  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || "noreply@finance-minister.com",
  },

  // File upload configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
    uploadPath: process.env.UPLOAD_PATH || "./uploads",
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
  },
};

// @desc    Validate required environment variables
const validateConfig = () => {
  const requiredVars = ["JWT_SECRET", "MONGODB_URI"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `Warning: Missing environment variables: ${missingVars.join(", ")}`
    );
    console.warn(
      "Using default values. This is not recommended for production."
    );
  }
};

// @desc    Get configuration for specific environment
const getConfig = (env = process.env.NODE_ENV || "development") => {
  const baseConfig = { ...config };

  if (env === "production") {
    // Production-specific configurations
    baseConfig.security.bcryptRounds = 14;
    baseConfig.rateLimit.max = 50;
    baseConfig.rateLimit.authMax = 3;
  } else if (env === "test") {
    // Test-specific configurations
    baseConfig.mongodb.uri =
      process.env.MONGODB_TEST_URI ||
      "mongodb://localhost:27017/finance-minister-test";
    baseConfig.jwt.expiresIn = "1h";
  }

  return baseConfig;
};

export { config, validateConfig, getConfig };
