import aiConfig from "../config/aiConfig.js";
import AICache from "../models/aiCache.model.js";
import crypto from "crypto";

class OpenAIService {
  constructor() {
    this.apiKey = aiConfig.openai.apiKey;
    this.model = aiConfig.openai.model;
    this.baseURL = "https://api.openai.com/v1";
  }

  /**
   * Generate cache key from input
   */
  generateCacheKey(operationType, input) {
    const inputStr = JSON.stringify(input);
    return crypto
      .createHash("sha256")
      .update(`${operationType}-${inputStr}`)
      .digest("hex");
  }

  /**
   * Check if response is cached
   */
  async getCachedResponse(operationType, input) {
    if (!aiConfig.cache.enabled) return null;

    const cacheKey = this.generateCacheKey(operationType, input);

    try {
      const cached = await AICache.findOne({
        cacheKey,
        operationType,
        expiresAt: { $gt: new Date() },
      });

      if (cached) {
        await cached.recordHit();
        return cached.response;
      }
    } catch (error) {
      console.error("Cache retrieval error:", error);
    }

    return null;
  }

  /**
   * Cache AI response
   */
  async cacheResponse(operationType, input, response, metadata = {}) {
    if (!aiConfig.cache.enabled) return;

    const cacheKey = this.generateCacheKey(operationType, input);
    const expiresAt = new Date(Date.now() + aiConfig.cache.ttl * 1000);

    try {
      await AICache.findOneAndUpdate(
        { cacheKey },
        {
          cacheKey,
          operationType,
          input,
          response,
          provider: "openai",
          metadata,
          expiresAt,
          lastAccessed: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Cache storage error:", error);
    }
  }

  /**
   * Make API call to OpenAI
   */
  async makeAPICall(messages, options = {}) {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages,
          temperature: options.temperature || aiConfig.openai.temperature,
          max_tokens: options.maxTokens || aiConfig.openai.maxTokens,
          response_format:
            options.responseFormat || { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OpenAI API Error: ${error.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      return {
        content: data.choices[0].message.content,
        metadata: {
          model: data.model,
          tokensUsed: data.usage.total_tokens,
          responseTime,
          cost: this.estimateCost(data.usage, data.model),
        },
      };
    } catch (error) {
      console.error("OpenAI API call failed:", error);

      // Try fallback model if available
      if (
        options.useFallback !== false &&
        aiConfig.openai.fallbackModel &&
        options.model !== aiConfig.openai.fallbackModel
      ) {
        console.log("Trying fallback model...");
        return this.makeAPICall(messages, {
          ...options,
          model: aiConfig.openai.fallbackModel,
          useFallback: false,
        });
      }

      throw error;
    }
  }

  /**
   * Estimate cost of API call
   */
  estimateCost(usage, model) {
    // OpenAI pricing (as of Nov 2024 - update as needed)
    const pricing = {
      "gpt-4-turbo-preview": {
        input: 0.01 / 1000, // $0.01 per 1K tokens
        output: 0.03 / 1000,
      },
      "gpt-4": {
        input: 0.03 / 1000,
        output: 0.06 / 1000,
      },
      "gpt-3.5-turbo": {
        input: 0.0005 / 1000,
        output: 0.0015 / 1000,
      },
    };

    const modelPricing =
      pricing[model] || pricing["gpt-3.5-turbo"];

    const inputCost = usage.prompt_tokens * modelPricing.input;
    const outputCost = usage.completion_tokens * modelPricing.output;

    return inputCost + outputCost;
  }

  /**
   * Generate completion with caching
   */
  async generateCompletion(operationType, systemPrompt, userPrompt, options = {}) {
    // Check cache first
    const cachedResponse = await this.getCachedResponse(operationType, {
      systemPrompt,
      userPrompt,
    });

    if (cachedResponse) {
      return {
        ...cachedResponse,
        cached: true,
      };
    }

    // Make API call
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const result = await this.makeAPICall(messages, options);

    // Parse JSON response
    let parsedContent;
    try {
      parsedContent = JSON.parse(result.content);
    } catch (error) {
      console.error("Failed to parse JSON response:", result.content);
      parsedContent = { raw: result.content };
    }

    // Cache the response
    await this.cacheResponse(
      operationType,
      { systemPrompt, userPrompt },
      parsedContent,
      result.metadata
    );

    return {
      ...parsedContent,
      cached: false,
      metadata: result.metadata,
    };
  }

  /**
   * Generate chat completion (for chatbot)
   */
  async generateChatCompletion(messages, options = {}) {
    const result = await this.makeAPICall(messages, {
      ...options,
      responseFormat: { type: "text" }, // Text for chat
    });

    return {
      content: result.content,
      metadata: result.metadata,
    };
  }

  /**
   * Check if service is configured
   */
  isConfigured() {
    return Boolean(this.apiKey);
  }
}

// Singleton instance
const openaiService = new OpenAIService();

export default openaiService;

