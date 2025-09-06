# AI Integration Setup Guide

## Overview
This CareerCompass application now includes AI-powered career recommendations using multiple AI providers. The system analyzes assessment answers and provides personalized career guidance.

## Supported AI Providers

### 1. OpenAI (ChatGPT)
- **Provider**: OpenAI
- **Model**: GPT-3.5-turbo
- **Setup**: Get API key from https://platform.openai.com/api-keys
- **Environment Variable**: `OPENAI_API_KEY`

### 2. Google Gemini
- **Provider**: Google AI
- **Model**: Gemini Pro
- **Setup**: Get API key from https://makersuite.google.com/app/apikey
- **Environment Variable**: `AIzaSyBp70f_7T6RW9Kntq2R30fgXWPxL3Nvdko`

### 3. Anthropic Claude
- **Provider**: Anthropic
- **Model**: Claude-3-Sonnet
- **Setup**: Get API key from https://console.anthropic.com/
- **Environment Variable**: `CLAUDE_API_KEY`

## Setup Instructions

### 1. Add API Keys to Environment
Add the following to your `.env` file in the server directory:

```bash
# AI API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=AIzaSyBp70f_7T6RW9Kntq2R30fgXWPxL3Nvdko
CLAUDE_API_KEY=your_claude_api_key_here

# AI Configuration
AI_ENABLED=true
AI_FALLBACK_ENABLED=true
```

### 2. Install Required Dependencies
The AI service uses axios for HTTP requests. Install it if not already present:

```bash
npm install axios
```

### 3. How It Works

1. **Assessment Completion**: Student completes the 72-question assessment
2. **AI Analysis**: System sends assessment data to AI provider
3. **Career Recommendations**: AI analyzes answers and provides detailed career guidance
4. **Enhanced Results**: Results page shows both AI analysis and traditional recommendations

### 4. AI Analysis Features

The AI provides:
- **Overall Analysis**: Strengths, personality type, learning style
- **Primary Careers**: Detailed career recommendations with descriptions
- **Development Plan**: Skills to develop, courses to take
- **Next Steps**: Actionable items for career development

### 5. Fallback System

If AI analysis fails:
- System continues with traditional recommendations
- Error is logged but doesn't break the assessment
- User still receives career guidance

### 6. Configuration Options

Edit `server/src/config/aiConfig.js` to customize:
- Provider priorities
- Rate limiting
- Response timeouts
- Caching settings

## Testing

1. Complete an assessment
2. Check server logs for AI analysis status
3. Verify AI analysis appears in results page
4. Test with different API keys to ensure fallback works

## Troubleshooting

### Common Issues:
1. **No AI Analysis**: Check API keys are set correctly
2. **Timeout Errors**: Increase timeout in aiConfig.js
3. **Rate Limiting**: Adjust rate limits in configuration
4. **Invalid JSON**: AI response parsing issues (has fallback)

### Debug Mode:
Enable detailed logging by setting `NODE_ENV=development`

## Cost Considerations

- **OpenAI**: ~$0.002 per 1K tokens
- **Gemini**: Free tier available, then pay-per-use
- **Claude**: Pay-per-use pricing

Monitor usage and set appropriate rate limits to control costs.
