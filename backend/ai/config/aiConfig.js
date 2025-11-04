export const aiConfig = {
  // AI Provider Configuration
  provider: process.env.AI_PROVIDER || "openai", // 'openai', 'claude', 'gemini'
  
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
    temperature: 0.3, // Lower for more consistent categorization
    maxTokens: 1000,
    fallbackModel: "gpt-3.5-turbo", // Cheaper fallback
  },

  // Claude Configuration
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL || "claude-3-sonnet-20240229",
    maxTokens: 1000,
  },

  // Gemini Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-pro",
  },

  // Feature Flags
  features: {
    categorization: true,
    insights: true,
    chatbot: true,
    predictions: true,
    documentProcessing: false, // Enable when OCR is ready
  },

  // Caching Configuration
  cache: {
    enabled: true,
    ttl: 86400, // 24 hours in seconds
    maxSize: 10000, // Maximum cache entries
  },

  // Cost Optimization
  costOptimization: {
    enabled: true,
    useLocalModelFirst: true, // Try local ML before API
    batchProcessing: true,
    maxDailyApiCalls: 10000,
  },

  // Transaction Categorization
  categorization: {
    confidenceThreshold: 0.7, // Minimum confidence to auto-categorize
    defaultCategories: [
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
      "Other"
    ],
  },

  // Insight Generation
  insights: {
    updateFrequency: "daily", // 'realtime', 'daily', 'weekly'
    minTransactionsForInsights: 10,
    lookbackPeriodDays: 90,
  },

  // Chatbot Configuration
  chatbot: {
    contextWindow: 10, // Number of previous messages to include
    maxResponseLength: 500,
    personality: "professional", // 'professional', 'friendly', 'casual'
  },

  // Rate Limiting
  rateLimits: {
    free: {
      requestsPerDay: 50,
      requestsPerHour: 10,
    },
    premium: {
      requestsPerDay: 1000,
      requestsPerHour: 100,
    },
    enterprise: {
      requestsPerDay: -1, // Unlimited
      requestsPerHour: -1,
    },
  },
};

// Validate required configuration
export const validateAIConfig = () => {
  const provider = aiConfig.provider;
  
  if (provider === "openai" && !aiConfig.openai.apiKey) {
    console.warn("⚠️  OpenAI API key not configured. AI features will be limited.");
    return false;
  }
  
  if (provider === "claude" && !aiConfig.claude.apiKey) {
    console.warn("⚠️  Claude API key not configured. AI features will be limited.");
    return false;
  }
  
  if (provider === "gemini" && !aiConfig.gemini.apiKey) {
    console.warn("⚠️  Gemini API key not configured. AI features will be limited.");
    return false;
  }
  
  return true;
};

export default aiConfig;

