# Environment Variables Template

Copy these variables to your `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/finance-minister

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:4200

# AI Configuration
# Choose your AI provider: 'openai', 'claude', or 'gemini'
AI_PROVIDER=openai

# OpenAI Configuration
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Claude Configuration (Alternative to OpenAI)
# Get your API key from: https://console.anthropic.com/
CLAUDE_API_KEY=your-claude-api-key-here
CLAUDE_MODEL=claude-3-sonnet-20240229

# Gemini Configuration (Alternative to OpenAI)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-pro

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## How to Use

1. Create a new file named `.env` in the backend directory
2. Copy the content above
3. Replace placeholder values with your actual configuration
4. **Important**: Never commit the `.env` file to version control!

## Getting API Keys

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy and paste into your `.env` file

### Claude (Alternative)
1. Visit https://console.anthropic.com/
2. Sign up for API access
3. Get your API key

### Gemini (Alternative)
1. Visit https://makersuite.google.com/app/apikey
2. Get your API key

