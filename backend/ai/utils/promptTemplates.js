// Prompt templates for various AI operations

export const categorizationPrompt = (transaction) => {
  return `Analyze this financial transaction and categorize it:

Transaction Details:
- Description: ${transaction.description || "N/A"}
- Amount: ${transaction.currency || "INR"} ${transaction.amount}
- Type: ${transaction.type || "N/A"} (credit/debit)
- Account: ${transaction.accountName || "N/A"}
- Date: ${transaction.date || "N/A"}

Task: Categorize this transaction into one of these categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Personal Care
- Groceries
- Investments
- Income
- Transfers
- Other

Also provide:
1. Subcategory (if applicable)
2. Merchant name (extracted from description)
3. Relevant tags (e.g., recurring, essential, discretionary)
4. Whether this is likely a recurring transaction
5. Confidence score (0-1)

Respond in JSON format:
{
  "category": "category name",
  "subcategory": "subcategory name",
  "merchant": "merchant name",
  "tags": ["tag1", "tag2"],
  "isRecurring": true/false,
  "confidence": 0.95,
  "reasoning": "brief explanation"
}`;
};

export const insightGenerationPrompt = (userData, transactions, period) => {
  return `Analyze the financial data and generate personalized insights:

User Profile:
- Income: ${userData.income || "Not specified"}
- Financial Goals: ${JSON.stringify(userData.goals || [])}
- Risk Tolerance: ${userData.riskTolerance || "Not specified"}

Transaction Summary (${period}):
- Total Transactions: ${transactions.length}
- Total Spent: ${calculateTotalSpent(transactions)}
- Categories: ${getCategories(transactions)}

Recent Transactions:
${transactions
  .slice(0, 10)
  .map((t) => `- ${t.description}: ${t.amount}`)
  .join("\n")}

Generate 3-5 actionable insights including:
1. Spending patterns or trends
2. Potential savings opportunities
3. Budget alerts or warnings
4. Goal progress updates
5. Personalized recommendations

Respond in JSON format:
[
  {
    "type": "spending_pattern|savings_opportunity|budget_alert|goal_progress|recommendation",
    "priority": "low|medium|high|urgent",
    "title": "Short insight title",
    "description": "Detailed explanation",
    "recommendations": [
      {
        "action": "What to do",
        "impact": "Expected result",
        "difficulty": "easy|medium|hard"
      }
    ],
    "metrics": {
      "currentValue": 0,
      "previousValue": 0,
      "change": 0,
      "changePercentage": 0
    }
  }
]`;
};

export const chatbotSystemPrompt = (userContext) => {
  return `You are a professional financial advisor AI assistant for Finance Minister app.

User Context:
- Name: ${userContext.name || "User"}
- Financial Profile: ${userContext.financialProfile || "Not available"}
- Recent Activity: ${userContext.recentActivity || "None"}

Your role:
1. Answer financial questions clearly and concisely
2. Provide personalized advice based on user's financial data
3. Explain spending patterns and transactions
4. Suggest ways to save money and achieve financial goals
5. Be supportive, non-judgmental, and encouraging

Guidelines:
- Keep responses under 200 words unless more detail is needed
- Use simple, clear language (avoid jargon)
- Provide actionable advice when possible
- Reference specific data from user's transactions when relevant
- Be empathetic and encouraging about financial challenges
- Always prioritize user's financial wellbeing
- If you don't have enough data, ask clarifying questions

Tone: Professional yet friendly, supportive, and educational`;
};

export const chatbotUserPrompt = (question, context = {}) => {
  let prompt = `User Question: ${question}\n\n`;

  if (context.transactions && context.transactions.length > 0) {
    prompt += `Recent Transactions:\n`;
    context.transactions.slice(0, 5).forEach((t) => {
      prompt += `- ${t.date}: ${t.description} - ${t.amount}\n`;
    });
    prompt += "\n";
  }

  if (context.insights && context.insights.length > 0) {
    prompt += `Current Insights:\n`;
    context.insights.forEach((i) => {
      prompt += `- ${i.title}: ${i.description}\n`;
    });
    prompt += "\n";
  }

  if (context.goals && context.goals.length > 0) {
    prompt += `Financial Goals:\n`;
    context.goals.forEach((g) => {
      prompt += `- ${g.name}: ${g.currentAmount}/${g.targetAmount}\n`;
    });
    prompt += "\n";
  }

  prompt += `Please provide a helpful, personalized response.`;

  return prompt;
};

export const financialHealthPrompt = (userData) => {
  return `Calculate a comprehensive financial health score (0-100) for this user:

Financial Data:
- Monthly Income: ${userData.monthlyIncome || 0}
- Monthly Expenses: ${userData.monthlyExpenses || 0}
- Savings Rate: ${userData.savingsRate || 0}%
- Total Debt: ${userData.totalDebt || 0}
- Total Assets: ${userData.totalAssets || 0}
- Net Worth: ${userData.netWorth || 0}
- Emergency Fund: ${userData.emergencyFund || 0} months
- Credit Score: ${userData.creditScore || "Not available"}
- Investment Portfolio: ${userData.investmentValue || 0}

Calculate:
1. Overall Financial Health Score (0-100)
2. Breakdown by category:
   - Income Stability (0-100)
   - Debt Management (0-100)
   - Savings Rate (0-100)
   - Emergency Preparedness (0-100)
   - Investment Health (0-100)
3. Strengths and weaknesses
4. Top 3 recommendations for improvement

Respond in JSON format:
{
  "overallScore": 75,
  "categoryScores": {
    "incomeStability": 80,
    "debtManagement": 70,
    "savingsRate": 75,
    "emergencyPreparedness": 60,
    "investmentHealth": 85
  },
  "strengths": ["High savings rate", "Good investment portfolio"],
  "weaknesses": ["Low emergency fund", "High debt-to-income ratio"],
  "recommendations": [
    {
      "priority": 1,
      "action": "Build emergency fund",
      "impact": "Improve financial resilience",
      "timeframe": "3-6 months"
    }
  ],
  "summary": "Brief overall assessment"
}`;
};

export const predictionPrompt = (historicalData, predictionType) => {
  return `Predict future financial trends based on historical data:

Prediction Type: ${predictionType}
Historical Data: ${JSON.stringify(historicalData, null, 2)}

Generate predictions for the next 3 months including:
1. Expected spending by category
2. Projected savings
3. Cash flow forecast
4. Risk factors and uncertainties
5. Confidence level for predictions

Respond in JSON format with month-by-month predictions.`;
};

// Helper functions
const calculateTotalSpent = (transactions) => {
  return transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
};

const getCategories = (transactions) => {
  const categories = [...new Set(transactions.map((t) => t.category))];
  return categories.join(", ");
};

export default {
  categorizationPrompt,
  insightGenerationPrompt,
  chatbotSystemPrompt,
  chatbotUserPrompt,
  financialHealthPrompt,
  predictionPrompt,
};
