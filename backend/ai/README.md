# AI Layer - Finance Minister

Intelligent financial analysis and advisory system powered by OpenAI GPT-4.

## 🎯 Features

### 1. Smart Transaction Categorization
Automatically categorizes transactions using AI and rule-based logic.

```javascript
import categorizationService from './services/categorizationService.js';

const result = await categorizationService.categorizeTransaction({
  description: "Swiggy order #12345",
  amount: 450,
  type: "debit"
});

// Result:
// {
//   category: "Food & Dining",
//   subcategory: "Food Delivery",
//   merchant: "Swiggy",
//   tags: ["essential", "food-delivery"],
//   confidence: 0.95
// }
```

### 2. Financial Insights Generator
Analyzes spending patterns and provides actionable insights.

```javascript
import insightService from './services/insightService.js';

const insights = await insightService.generateInsights(userId, {
  period: '30days'
});

// Returns personalized insights about spending, saving opportunities
```

### 3. AI Financial Advisor Chatbot
Natural language financial Q&A system.

```javascript
import chatbotService from './services/chatbotService.js';

const response = await chatbotService.chat(
  userId,
  "How can I save more money?"
);

// Returns personalized financial advice
```

### 4. Financial Health Scoring
Comprehensive financial health assessment.

```javascript
const healthScore = await insightService.calculateFinancialHealthScore(userId);

// Returns:
// {
//   overallScore: 75,
//   categoryScores: { ... },
//   strengths: [...],
//   weaknesses: [...],
//   recommendations: [...]
// }
```

## 📁 Structure

```
ai/
├── config/
│   └── aiConfig.js              # Configuration settings
├── models/
│   ├── aiCache.model.js         # Caching for cost optimization
│   ├── insight.model.js         # Financial insights
│   └── chatHistory.model.js     # Chat conversations
├── services/
│   ├── openaiService.js         # OpenAI API integration
│   ├── categorizationService.js # Transaction categorization
│   ├── insightService.js        # Insight generation
│   └── chatbotService.js        # Chatbot logic
├── controllers/
│   ├── aiController.js          # AI endpoints
│   └── chatbotController.js     # Chat endpoints
├── routes/
│   ├── aiRoutes.js              # AI routes
│   └── chatbotRoutes.js         # Chat routes
└── utils/
    ├── promptTemplates.js       # AI prompts
    └── categoryMapping.js       # Category rules
```

## 🔧 Configuration

Edit `config/aiConfig.js`:

```javascript
export const aiConfig = {
  provider: "openai",
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4-turbo-preview",
  },
  
  features: {
    categorization: true,
    insights: true,
    chatbot: true,
  },
  
  cache: {
    enabled: true,
    ttl: 86400, // 24 hours
  },
};
```

## 🚀 Usage

### Import Services

```javascript
import categorizationService from './ai/services/categorizationService.js';
import insightService from './ai/services/insightService.js';
import chatbotService from './ai/services/chatbotService.js';
```

### Categorize Transaction

```javascript
const result = await categorizationService.categorizeTransaction(transaction);
```

### Generate Insights

```javascript
const insights = await insightService.generateInsights(userId);
```

### Chat with AI

```javascript
const response = await chatbotService.chat(userId, "Your question here");
```

## 💡 Cost Optimization

### Three-Tier Intelligence System

1. **Rule-Based** (Free)
   - Keyword matching
   - ~75% accuracy
   - Instant response

2. **Cached AI** (Free after first call)
   - Stored responses
   - 24-hour cache
   - 70% cache hit rate

3. **Live AI** (Paid)
   - OpenAI API
   - ~95% accuracy
   - Only when needed

### Expected Costs

- Light user: $0.05-0.15/month
- Active user: $0.30-0.80/month
- Power user: $1.00-3.00/month

## 🔒 Security

- ✅ No PII sent to AI
- ✅ API keys secured in environment
- ✅ Rate limiting enabled
- ✅ Input validation
- ✅ Audit logging

## 📊 Monitoring

### Cache Performance

```javascript
const cacheStats = await AICache.aggregate([
  {
    $group: {
      _id: null,
      totalHits: { $sum: "$hitCount" },
      totalEntries: { $sum: 1 }
    }
  }
]);
```

### AI Usage

```javascript
const usage = await AICache.find({ operationType: "categorization" })
  .sort({ createdAt: -1 })
  .limit(100);
```

## 🧪 Testing

```bash
# Test categorization
npm test -- ai/services/categorizationService.test.js

# Test insights
npm test -- ai/services/insightService.test.js

# Test chatbot
npm test -- ai/services/chatbotService.test.js
```

## 📚 Documentation

- **AI_QUICK_START.md** - Quick start guide
- **AI_SETUP_GUIDE.md** - Detailed setup
- **AI_LAYER_PLAN.md** - Complete planning doc
- **AI_IMPLEMENTATION_SUMMARY.md** - What was built

## 🎯 Roadmap

- [x] Transaction categorization
- [x] Financial insights
- [x] AI chatbot
- [x] Financial health scoring
- [ ] Receipt scanning (OCR)
- [ ] Voice assistant
- [ ] Predictive analytics
- [ ] Investment recommendations

## 💬 Support

For issues or questions:
1. Check documentation files
2. Review logs in `backend/logs/`
3. Check OpenAI status: https://status.openai.com/

---

**Powered by OpenAI GPT-4 🚀**

