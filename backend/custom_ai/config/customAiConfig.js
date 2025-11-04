/**
 * Custom AI Configuration
 * No external AI APIs - everything runs locally
 */

export const customAiConfig = {
  // Feature flags
  features: {
    mlCategorization: true,
    statisticalInsights: true,
    nlpChatbot: true,
    predictions: true,
    patternRecognition: true,
    behaviorAnalysis: true,
  },

  // Machine Learning Configuration
  ml: {
    // Neural network settings for categorization
    neuralNetwork: {
      hiddenLayers: [10, 8], // Layer sizes
      iterations: 20000, // Training iterations
      errorThresh: 0.005, // Error threshold
      learningRate: 0.3,
    },

    // Bayes classifier settings
    bayesClassifier: {
      tokenizer: "word", // or 'bigram'
      minFrequency: 1,
    },

    // Training settings
    training: {
      autoRetrain: true,
      minDataPoints: 50, // Minimum transactions before training
      retrainInterval: 7, // Days
    },

    // Confidence thresholds
    confidence: {
      categorization: 0.7, // Min confidence for auto-categorization
      intentRecognition: 0.6,
      merchantRecognition: 0.75,
    },
  },

  // NLP Configuration
  nlp: {
    // Intent recognition
    intents: [
      "QUERY_SPENDING",
      "QUERY_SAVINGS",
      "QUERY_BUDGET",
      "QUERY_GOALS",
      "REQUEST_ADVICE",
      "REQUEST_INSIGHTS",
      "COMPARE_PERIODS",
      "EXPLAIN_TRANSACTION",
      "GENERAL_QUESTION",
    ],

    // Entity types to extract
    entities: ["AMOUNT", "DATE", "CATEGORY", "MERCHANT", "PERIOD"],

    // Response generation
    responseGeneration: {
      maxLength: 500,
      useTemplates: true,
      personalize: true,
    },
  },

  // Statistical Analysis
  statistics: {
    // Trend analysis
    trends: {
      minDataPoints: 10,
      windowSize: 30, // Days
      smoothingFactor: 0.3, // For exponential smoothing
    },

    // Anomaly detection
    anomalyDetection: {
      enabled: true,
      method: "zscore", // or 'iqr', 'isolation_forest'
      threshold: 2.5, // Standard deviations
    },

    // Correlation analysis
    correlation: {
      minStrength: 0.5, // Min correlation coefficient
    },
  },

  // Prediction Configuration
  prediction: {
    // Spending forecast
    spending: {
      method: "exponential_smoothing", // or 'linear_regression', 'moving_average'
      lookbackPeriod: 90, // Days
      forecastPeriod: 30, // Days ahead
    },

    // Goal achievement
    goals: {
      updateFrequency: "daily",
      confidenceInterval: 0.95,
    },

    // Cash flow forecast
    cashFlow: {
      method: "time_series",
      includeRecurring: true,
    },
  },

  // Pattern Recognition
  patterns: {
    // Recurring transactions
    recurring: {
      minOccurrences: 3,
      amountTolerance: 0.05, // 5% variance allowed
      fuzzyMatchThreshold: 0.8,
    },

    // Spending patterns
    behavior: {
      timeOfDay: true,
      dayOfWeek: true,
      dayOfMonth: true,
      seasonality: true,
    },
  },

  // Financial Health Scoring
  healthScore: {
    weights: {
      incomeStability: 0.2,
      savingsRate: 0.25,
      debtManagement: 0.2,
      emergencyFund: 0.15,
      expenseControl: 0.2,
    },

    // Benchmarks
    benchmarks: {
      idealSavingsRate: 20, // %
      emergencyFundMonths: 6,
      debtToIncomeRatio: 0.36, // Max 36%
    },
  },

  // Budget Recommendations
  budget: {
    // Budget rules
    rules: {
      "50/30/20": {
        needs: 0.5,
        wants: 0.3,
        savings: 0.2,
      },
    },

    // Category limits (% of income)
    categoryLimits: {
      "Food & Dining": 15,
      Transportation: 10,
      Shopping: 10,
      Entertainment: 8,
      "Bills & Utilities": 20,
      Healthcare: 5,
      Education: 5,
      Other: 10,
    },
  },

  // Merchant Recognition
  merchant: {
    fuzzyMatchThreshold: 0.75,
    learnFromCorrections: true,
    buildDatabase: true,
  },

  // Performance Settings
  performance: {
    // Caching
    cache: {
      enabled: true,
      ttl: 3600, // 1 hour (faster refresh than API-based)
    },

    // Batch processing
    batchSize: 100,
    parallelProcessing: true,
  },

  // Learning & Improvement
  learning: {
    // Learn from user corrections
    userFeedback: {
      enabled: true,
      weight: 1.5, // Give more weight to user corrections
    },

    // Auto-learning
    autoLearn: {
      enabled: true,
      minConfidence: 0.8, // Only learn from high-confidence predictions
    },
  },

  // Categories
  categories: {
    primary: [
      "Food & Dining",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Bills & Utilities",
      "Healthcare",
      "Education",
      "Travel",
      "Personal Care",
      "Groceries",
      "Investments",
      "Income",
      "Transfers",
      "Other",
    ],

    subcategories: {
      "Food & Dining": [
        "Dining Out",
        "Food Delivery",
        "Fast Food",
        "Groceries",
        "Coffee Shops",
      ],
      Transportation: [
        "Ride Share",
        "Public Transport",
        "Fuel",
        "Vehicle Maintenance",
        "Parking",
      ],
      Shopping: [
        "Online Shopping",
        "Clothing",
        "Electronics",
        "Home & Garden",
        "Personal Items",
      ],
      Entertainment: [
        "Streaming Services",
        "Movies",
        "Music",
        "Gaming",
        "Events",
      ],
      "Bills & Utilities": [
        "Electricity",
        "Water",
        "Internet",
        "Phone",
        "Rent",
        "Insurance",
        "EMI",
      ],
    },
  },
};

export default customAiConfig;
