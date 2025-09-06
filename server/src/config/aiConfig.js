module.exports = {
  // AI Provider Configuration
  providers: {
    openai: {
      enabled: process.env.OPENAI_API_KEY ? true : false,
      priority: 1,
      model: 'gpt-3.5-turbo',
      maxTokens: 2000,
      temperature: 0.7
    },
    gemini: {
      enabled: process.env.GEMINI_API_KEY ? true : false,
      priority: 2,
      model: 'gemini-1.5-flash',
      maxTokens: 2000,
      temperature: 0.7
    },
    claude: {
      enabled: process.env.CLAUDE_API_KEY ? true : false,
      priority: 3,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 2000,
      temperature: 0.7
    }
  },

  // Fallback settings
  fallback: {
    enabled: true,
    useOriginalRecommendations: true
  },

  // Rate limiting
  rateLimit: {
    requestsPerMinute: 10,
    requestsPerHour: 100
  },

  // Response settings
  response: {
    timeout: 30000, // 30 seconds
    retryAttempts: 2,
    cacheResults: true,
    cacheDuration: 3600 // 1 hour in seconds
  }
};
