# AI Layer Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required AI packages including:

- `openai` - OpenAI API client
- `@anthropic-ai/sdk` - Claude API client (alternative)
- `uuid` - For session ID generation
- `tesseract.js` - OCR for receipt scanning (future)
- `pdf-parse` - PDF processing (future)
- `sharp` - Image processing (future)
- `brain.js` - Local neural networks (future)

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your AI API key:

```env
# Choose your AI provider
AI_PROVIDER=openai

# Add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

### 3. Get Your API Keys

#### Option 1: OpenAI (Recommended)

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file
5. Add credits to your account (minimum $5)

**Pricing:**

- GPT-4 Turbo: $0.01 per 1K input tokens, $0.03 per 1K output tokens
- GPT-3.5 Turbo: $0.0005 per 1K input tokens, $0.0015 per 1K output tokens

#### Option 2: Claude (Alternative)

1. Go to https://console.anthropic.com/
2. Sign up for API access
3. Get your API key
4. Set `AI_PROVIDER=claude` in `.env`

#### Option 3: Gemini (Alternative)

1. Go to https://makersuite.google.com/app/apikey
2. Get your API key
3. Set `AI_PROVIDER=gemini` in `.env`

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

You should see:

```
✅ AI features are enabled
Server is running on port 3000
```

---

## 📡 API Endpoints

### Authentication Required

All AI endpoints require authentication. Include JWT token in header:

```
Authorization: Bearer your-jwt-token
```

### Categorization Endpoints

#### 1. Categorize Transaction

```http
POST /api/ai/categorize
Content-Type: application/json

{
  "description": "Swiggy order #12345",
  "amount": 450.50,
  "type": "debit",
  "date": "2024-11-04",
  "accountName": "HDFC Bank"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "category": "Food & Dining",
    "subcategory": "Food Delivery",
    "merchant": "Swiggy",
    "tags": ["essential", "food-delivery"],
    "isRecurring": false,
    "confidence": 0.95,
    "reasoning": "AI categorization",
    "method": "ai"
  }
}
```

#### 2. Auto-Categorize Existing Transaction

```http
POST /api/ai/categorize/:transactionId
```

#### 3. Get Category Suggestions

```http
GET /api/ai/categorize/suggestions?description=Netflix&amount=199&type=debit
```

#### 4. Learn from Correction

```http
POST /api/ai/categorize/learn/:transactionId
Content-Type: application/json

{
  "correctedCategory": "Entertainment"
}
```

---

### Insights Endpoints

#### 1. Generate Insights

```http
POST /api/ai/insights/generate?period=30days
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "type": "spending_pattern",
      "priority": "medium",
      "title": "Your top spending category is Food & Dining",
      "description": "You spent ₹15,450 on Food & Dining...",
      "recommendations": [
        {
          "action": "Review your Food & Dining expenses",
          "impact": "Identify potential savings",
          "difficulty": "easy"
        }
      ]
    }
  ]
}
```

#### 2. Get Active Insights

```http
GET /api/ai/insights?limit=10
```

#### 3. Acknowledge Insight

```http
PUT /api/ai/insights/:insightId/acknowledge
```

#### 4. Dismiss Insight

```http
PUT /api/ai/insights/:insightId/dismiss
```

---

### Financial Health Endpoint

#### Get Financial Health Score

```http
GET /api/ai/health-score
```

**Response:**

```json
{
  "success": true,
  "data": {
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
    ]
  }
}
```

---

### Chatbot Endpoints

#### 1. Send Chat Message

```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "Why did I spend more this month?",
  "sessionId": "optional-session-id"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-v4",
    "message": "Based on your recent transactions, you spent ₹2,500 more this month compared to last month. The increase was mainly in the Food & Dining category...",
    "metadata": {
      "tokensUsed": 234,
      "model": "gpt-4-turbo-preview",
      "responseTime": 1234
    }
  }
}
```

#### 2. Get Chat History

```http
GET /api/ai/chat/history?limit=10
```

#### 3. Get Conversation

```http
GET /api/ai/chat/:sessionId
```

#### 4. Delete Conversation

```http
DELETE /api/ai/chat/:sessionId
```

#### 5. Archive Conversation

```http
PUT /api/ai/chat/:sessionId/archive
```

#### 6. Rate Conversation

```http
POST /api/ai/chat/:sessionId/rate
Content-Type: application/json

{
  "helpful": true,
  "accuracy": 5,
  "comment": "Very helpful advice!"
}
```

---

## 🧪 Testing the AI Layer

### 1. Test Categorization

```bash
# Using curl
curl -X POST http://localhost:3000/api/ai/categorize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Amazon purchase",
    "amount": 2499,
    "type": "debit"
  }'
```

### 2. Test Chatbot

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "How much did I spend on food this month?"
  }'
```

### 3. Test Insights

```bash
curl -X POST http://localhost:3000/api/ai/insights/generate?period=30days \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 💰 Cost Optimization

The AI layer is designed with cost optimization in mind:

### 1. Caching

Responses are automatically cached for 24 hours:

- Same request = Instant response (no API call)
- Saves money and improves speed

### 2. Rule-Based Fallback

For simple categorization, the system uses keyword matching before calling the API:

- Free and instant
- Falls back to AI only when confidence is low

### 3. Batch Processing

Process multiple transactions together to save API calls.

### 4. Cost Per User (Estimated)

- **Free tier**: $0.00 (rule-based only)
- **Light usage**: $0.05 - $0.20/month
- **Active user**: $0.50 - $2.00/month
- **Power user**: $2.00 - $5.00/month

### 5. Monthly Budget Protection

Set max daily API calls in `ai/config/aiConfig.js`:

```javascript
costOptimization: {
  maxDailyApiCalls: 10000,
}
```

---

## 🔧 Configuration

### AI Configuration File

Edit `ai/config/aiConfig.js` to customize:

```javascript
export const aiConfig = {
  // Change AI provider
  provider: "openai", // 'openai', 'claude', 'gemini'

  // Adjust confidence threshold
  categorization: {
    confidenceThreshold: 0.7, // 0.0 - 1.0
  },

  // Enable/disable features
  features: {
    categorization: true,
    insights: true,
    chatbot: true,
    predictions: true,
  },

  // Cache settings
  cache: {
    enabled: true,
    ttl: 86400, // 24 hours
  },
};
```

---

## 🐛 Troubleshooting

### Issue: "AI features are disabled"

**Solution:** Check your `.env` file has a valid API key:

```env
OPENAI_API_KEY=sk-proj-xxxxx
```

### Issue: "Rate limit exceeded"

**Solution:** You've hit the OpenAI rate limit. Options:

1. Wait a few minutes
2. Upgrade your OpenAI account tier
3. Implement queue system for requests

### Issue: "Insufficient credits"

**Solution:** Add credits to your OpenAI account:
https://platform.openai.com/account/billing

### Issue: "AI responses are slow"

**Solutions:**

1. Use GPT-3.5-turbo instead of GPT-4 (faster, cheaper)
2. Enable caching (already enabled by default)
3. Use rule-based categorization more aggressively

---

## 📊 Monitoring

### Check AI Usage

```bash
# View cached responses
db.aicaches.find().limit(10)

# Count total AI requests
db.aicaches.countDocuments()

# Check cache hit rate
db.aicaches.aggregate([
  {
    $group: {
      _id: null,
      totalHits: { $sum: "$hitCount" },
      totalEntries: { $sum: 1 }
    }
  }
])
```

### Monitor Costs

Check your OpenAI usage dashboard:
https://platform.openai.com/usage

---

## 🔐 Security Best Practices

1. **Never commit API keys** - Use `.env` file (already in `.gitignore`)
2. **Rotate keys regularly** - Change API keys every 3-6 months
3. **Set spending limits** - Configure budget alerts in OpenAI dashboard
4. **Monitor usage** - Check for unusual spikes in API calls
5. **Sanitize inputs** - Never send sensitive personal data to AI

---

## 🚀 Next Steps

1. **Test all endpoints** - Use the examples above
2. **Integrate with frontend** - Connect Angular app to AI endpoints
3. **Monitor performance** - Check response times and accuracy
4. **Collect feedback** - Ask users to rate AI suggestions
5. **Fine-tune** - Adjust confidence thresholds based on accuracy

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/production-best-practices)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

---

## 💬 Support

For issues or questions:

1. Check this guide
2. Review logs in `backend/logs/`
3. Check OpenAI status: https://status.openai.com/

---

**Ready to transform your finance app with AI! 🎉**
