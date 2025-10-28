const axios = require('axios');

class AIService {
  constructor() {
    this.providers = {
      gemini: {
        name: 'Google Gemini',
        baseURL: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
        model: 'gemini-pro'
      }
    };
  }

  async analyzeAssessmentAnswers(assessmentData, answers, domainScores, topDomains) {
    try {
      console.log('Starting Gemini AI analysis...');
      const prompt = this.createCareerAnalysisPrompt(assessmentData, answers, domainScores, topDomains);
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY not found in environment variables');
      }

      console.log('Gemini API key found, calling API...');
      const result = await this.callGemini(prompt, apiKey, this.providers.gemini);
      console.log('Gemini API response received');
      
      return this.parseAIResponse(result, 'gemini');
    } catch (error) {
      console.error('Gemini AI Analysis Error:', error);
      throw error;
    }
  }

  createCareerAnalysisPrompt(assessmentData, answers, domainScores, topDomains) {
    const domainAnalysis = Object.entries(domainScores).map(([domain, score]) => {
      const domainName = this.getDomainDisplayName(domain);
      const strength = this.getStrengthLevel(score);
      return `${domainName}: ${score}/30 (${strength})`;
    }).join('\n');

    const topDomainsAnalysis = topDomains.map((domain, index) => {
      const domainName = this.getDomainDisplayName(domain);
      const score = domainScores[domain];
      return `${index + 1}. ${domainName}: ${score}/30`;
    }).join('\n');

    const answerAnalysis = answers.map((answer, index) => {
      const question = assessmentData.questions[index];
      const answerText = this.getAnswerText(answer);
      return `Q${index + 1} (${question.domain}): ${question.question} - ${answerText}`;
    }).slice(0, 10).join('\n'); // Show first 10 answers for context

    return `You are a career guidance expert analyzing a student's multiple intelligence assessment results. Please provide detailed career recommendations based on their responses.

ASSESSMENT CONTEXT:
- Total Questions: ${assessmentData.questions.length}
- Assessment Type: Multiple Intelligence Test
- Domains Tested: 12 intelligence domains

STUDENT'S DOMAIN SCORES:
${domainAnalysis}

TOP STRENGTHS (Top 4 Domains):
${topDomainsAnalysis}

SAMPLE ANSWERS (First 10):
${answerAnalysis}

Please provide a comprehensive career analysis in the following JSON format:

{
  "analysis": {
    "overall_strengths": "Brief summary of the student's main strengths",
    "personality_type": "Brief description of their personality/work style",
    "learning_style": "How they prefer to learn and work",
    "work_environment_preference": "Ideal work environment for this student"
  },
  "career_recommendations": {
    "primary_careers": [
      {
        "title": "Career Title",
        "description": "Brief description of the career",
        "why_suitable": "Why this career matches their profile",
        "required_skills": ["skill1", "skill2", "skill3"],
        "education_path": "Suggested education/training path",
        "salary_range": "Typical salary range",
        "job_market_outlook": "Current job market outlook"
      }
    ],
    "secondary_careers": [
      {
        "title": "Career Title",
        "description": "Brief description",
        "why_suitable": "Why suitable",
        "required_skills": ["skill1", "skill2"],
        "education_path": "Education path",
        "salary_range": "Salary range",
        "job_market_outlook": "Market outlook"
      }
    ]
  },
  "development_plan": {
    "strengths_to_leverage": ["strength1", "strength2", "strength3"],
    "skills_to_develop": ["skill1", "skill2", "skill3"],
    "recommended_courses": ["course1", "course2", "course3"],
    "practical_experience": ["experience1", "experience2", "experience3"]
  },
  "next_steps": [
    "Immediate action item 1",
    "Immediate action item 2",
    "Immediate action item 3"
  ]
}

Please ensure the response is valid JSON and focuses on practical, actionable career guidance.`;
  }

  async callGemini(prompt, apiKey, config) {
    try {
      console.log('Calling Gemini API...');
      console.log('API URL:', `${config.baseURL}?key=${apiKey.substring(0, 10)}...`);
      
      const response = await axios.post(`${config.baseURL}?key=${apiKey}`, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Gemini API call successful');
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error Details:');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Full URL:', `${config.baseURL}`);
      throw error;
    }
  }


  parseAIResponse(response, provider) {
    try {
      // Try to extract JSON from the response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, create a structured response from the text
      return this.createFallbackResponse(response, provider);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.createFallbackResponse(response, provider);
    }
  }

  createFallbackResponse(response, provider) {
    return {
      analysis: {
        overall_strengths: "AI analysis completed successfully",
        personality_type: "Based on assessment results",
        learning_style: "Personalized learning approach recommended",
        work_environment_preference: "Environment matching your strengths"
      },
      career_recommendations: {
        primary_careers: [
          {
            title: "Career Specialist",
            description: "AI-generated career recommendation",
            why_suitable: "Matches your assessment profile",
            required_skills: ["Core competencies", "Domain expertise"],
            education_path: "Relevant education and training",
            salary_range: "Competitive market rate",
            job_market_outlook: "Positive growth outlook"
          }
        ],
        secondary_careers: []
      },
      development_plan: {
        strengths_to_leverage: ["Your top strengths"],
        skills_to_develop: ["Areas for improvement"],
        recommended_courses: ["Relevant courses"],
        practical_experience: ["Hands-on experience"]
      },
      next_steps: [
        "Review AI recommendations",
        "Research suggested careers",
        "Plan skill development"
      ],
      raw_response: response,
      provider: provider
    };
  }

  getDomainDisplayName(domain) {
    const domainNames = {
      'logical-mathematical': 'Logical-Mathematical Intelligence',
      'linguistic-verbal': 'Linguistic-Verbal Intelligence',
      'visual-spatial': 'Visual-Spatial Intelligence',
      'musical-rhythmic': 'Musical-Rhythmic Intelligence',
      'bodily-kinesthetic': 'Bodily-Kinesthetic Intelligence',
      'interpersonal': 'Interpersonal Intelligence',
      'intrapersonal': 'Intrapersonal Intelligence',
      'naturalistic': 'Naturalistic Intelligence',
      'emotional-intelligence': 'Emotional Intelligence',
      'creative-innovative': 'Creative-Innovative Intelligence',
      'analytical': 'Analytical Intelligence',
      'practical': 'Practical Intelligence'
    };
    return domainNames[domain] || domain;
  }

  getStrengthLevel(score) {
    if (score >= 24) return 'Excellent';
    if (score >= 18) return 'Good';
    if (score >= 12) return 'Average';
    return 'Needs Improvement';
  }

  getAnswerText(answer) {
    const answerMap = {
      'A': 'Strongly Agree',
      'B': 'Agree',
      'C': 'Neutral',
      'D': 'Disagree',
      'E': 'Strongly Disagree'
    };
    return answerMap[answer] || answer;
  }
}

module.exports = new AIService();
