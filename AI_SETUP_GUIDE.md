# AI Assessment Setup Guide

## Overview
The Career Guidance Assessment includes AI-powered analysis using Google's Gemini API to provide personalized career recommendations based on student responses.

## Features
- **Traditional Analysis**: Rule-based career recommendations based on domain scores
- **AI Analysis**: Advanced AI-powered insights including:
  - Personality type analysis
  - Learning style preferences
  - Work environment recommendations
  - Detailed career paths with salary ranges
  - Development plans and next steps

## Setup Instructions

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variable
1. Open `server/.env` file
2. Add the following line:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your actual Gemini API key

### 3. Restart the Server
After adding the API key, restart your server to load the new environment variable:
```bash
cd server
npm start
```

## How It Works

### Assessment Flow
1. Student completes the 72-question multiple intelligence assessment
2. System calculates domain scores (12 intelligence domains)
3. Traditional recommendations are generated
4. AI analysis is attempted:
   - If successful: Enhanced recommendations with AI insights
   - If failed: Falls back to traditional recommendations

### AI Analysis Process
1. Student's answers and domain scores are sent to Gemini API
2. AI generates:
   - Overall strengths analysis
   - Personality and learning style assessment
   - Primary and secondary career recommendations
   - Skills development plan
   - Actionable next steps

## Error Handling

### If AI Analysis Fails
- System automatically falls back to traditional recommendations
- Error is logged for debugging
- Student still receives valuable career guidance
- UI shows "Using Traditional Analysis" indicator

### Common Issues

#### 1. API Key Not Found
**Error**: `GEMINI_API_KEY not found in environment variables`
**Solution**: Add `GEMINI_API_KEY` to your `.env` file

#### 2. Invalid API Key
**Error**: `401 Unauthorized` or `403 Forbidden`
**Solution**: Verify your API key is correct and active

#### 3. Rate Limit Exceeded
**Error**: `429 Too Many Requests`
**Solution**: Wait a few minutes and try again, or upgrade your API plan

#### 4. Network Issues
**Error**: `ECONNREFUSED` or timeout
**Solution**: Check your internet connection and firewall settings

## Testing the AI Functionality

### 1. Check API Key is Loaded
```bash
# In server directory
node -e "require('dotenv').config(); console.log(process.env.GEMINI_API_KEY ? 'API Key found' : 'API Key missing')"
```

### 2. Take the Assessment
1. Log in as a student
2. Navigate to "Career Guidance Assessment"
3. Complete all 72 questions
4. Submit the assessment
5. Check the results page for AI analysis section

### 3. Verify AI Analysis
Look for:
- 🤖 "AI-Powered Career Analysis" section in results
- Green indicator: "AI-Powered Analysis Available"
- Yellow indicator: "Using Traditional Analysis" (if AI failed)

## API Configuration

Current settings in `server/src/services/aiService.js`:
- **Model**: `gemini-1.5-flash`
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 2000 (comprehensive responses)

## Fallback Mechanism

The system includes a robust fallback mechanism:
1. **Primary**: AI-powered recommendations (if API key is available)
2. **Fallback**: Traditional rule-based recommendations (always available)
3. **Error Display**: Clear indicators to users about analysis type used

## Monitoring & Debugging

### Server Logs
Check server logs for AI-related messages:
```
Starting AI analysis...
Gemini API key found, calling API...
Gemini API response received
AI analysis completed successfully
```

### Error Logs
If AI fails, you'll see:
```
AI analysis failed: [error message]
Gemini AI Analysis Error: [detailed error]
```

### Client-Side Indicators
- ✅ Green: "AI-Powered Analysis Available"
- ⚠️ Yellow: "Using Traditional Analysis"

## Cost Considerations

- **Gemini API Free Tier**: 60 requests per minute
- **Cost per Request**: Free tier available, paid plans vary
- **Typical Assessment**: 1 API call per student submission

## Security Best Practices

1. ✅ Never commit `.env` file to version control
2. ✅ Use different API keys for development and production
3. ✅ Regularly rotate API keys
4. ✅ Monitor API usage for unusual activity
5. ✅ Set up usage alerts in Google Cloud Console

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify API key is correctly set in `.env`
3. Ensure server has been restarted after adding API key
4. Test API key directly at [Google AI Studio](https://aistudio.google.com/)

## File Locations

- **AI Service**: `server/src/services/aiService.js`
- **AI Config**: `server/src/config/aiConfig.js`
- **Assessment Route**: `server/src/routes/assessments.js`
- **Environment Variables**: `server/.env`
- **Environment Template**: `server/.env.example`
