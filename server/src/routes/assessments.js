const express = require('express');
const { Assessment, StudentTestResult } = require('../models/Assessment');
const aiService = require('../services/aiService');
const aiConfig = require('../config/aiConfig');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get the career guidance assessment
router.get('/', isAuthenticated, async (req, res) => {
  try {
    let assessment = await Assessment.findOne({ isActive: true });
    
    // If no assessment exists, create the default one with all 72 questions
    if (!assessment) {
      assessment = await createDefaultAssessment();
    }
    
    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// Submit assessment answers
router.post('/submit', isAuthenticated, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const studentId = req.user.id;

    // Get the assessment
    const assessment = await Assessment.findOne({ isActive: true });
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Validate answer length
    if (!answers || answers.length !== assessment.questions.length) {
      return res.status(400).json({ 
        error: 'Invalid answer count',
        expected: assessment.questions.length,
        received: answers?.length || 0
      });
    }

    // Calculate domain scores
    const domainScores = calculateDomainScores(answers, assessment.questions);
    const totalScore = Object.values(domainScores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = assessment.questions.length * 5; // Dynamic calculation
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);

    // Get top domains
    const topDomains = getTopDomains(domainScores);
    
    // Generate traditional recommendations and career suggestions
    const recommendations = generateRecommendations(domainScores, topDomains);
    const careerSuggestions = generateCareerSuggestions(topDomains);

    // AI Analysis
    let aiAnalysis = null;
    let aiError = null;
    
    try {
      console.log('Starting AI analysis...');
      aiAnalysis = await aiService.analyzeAssessmentAnswers(assessment, answers, domainScores, topDomains);
      console.log('AI analysis completed successfully');
    } catch (error) {
      console.error('AI analysis failed:', error.message);
      aiError = error.message;
      
      // Continue with traditional recommendations if AI fails
      if (!aiConfig.fallback.enabled) {
        throw error;
      }
    }

    // Prepare enhanced recommendations
    const enhancedRecommendations = aiAnalysis ? 
      aiAnalysis.career_recommendations.primary_careers.map(career => career.title) :
      recommendations;
    
    const enhancedCareerSuggestions = aiAnalysis ?
      aiAnalysis.career_recommendations.primary_careers.concat(
        aiAnalysis.career_recommendations.secondary_careers || []
      ).map(career => career.title) :
      careerSuggestions;

    // Save test result
    const testResult = new StudentTestResult({
      studentId,
      assessmentId: assessment._id,
      answers: answers.map((answer, index) => ({
        questionNumber: index + 1,
        domain: assessment.questions[index].domain,
        selectedAnswer: answer,
        score: getScoreForAnswer(answer)
      })),
      domainScores,
      totalScore,
      percentage,
      timeTaken,
      topDomains,
      recommendations: enhancedRecommendations,
      careerSuggestions: enhancedCareerSuggestions,
      aiAnalysis: aiAnalysis,
      aiError: aiError
    });

    await testResult.save();

    res.json({
      success: true,
      result: {
        totalScore,
        maxPossibleScore: maxPossibleScore,
        percentage,
        domainScores,
        topDomains,
        recommendations: enhancedRecommendations,
        careerSuggestions: enhancedCareerSuggestions,
        aiAnalysis: aiAnalysis,
        aiError: aiError,
        hasAIAnalysis: !!aiAnalysis
      }
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      studentId: req.user?.id,
      answersLength: req.body?.answers?.length || 0,
      assessmentQuestionsLength: assessment?.questions?.length || 0
    });
    res.status(500).json({ 
      error: 'Failed to submit assessment',
      details: error.message 
    });
  }
});

// Get student's test results
router.get('/results', isAuthenticated, async (req, res) => {
  try {
    const results = await StudentTestResult.find({ studentId: req.user.id })
      .populate('assessmentId', 'title description')
      .sort({ completedAt: -1 });
     
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get specific test result
router.get('/results/:resultId', isAuthenticated, async (req, res) => {
  try {
    const result = await StudentTestResult.findById(req.params.resultId)
      .populate('assessmentId', 'title description');
     
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
     
    res.json(result);
  } catch (error) {
    console.error('Error fetching specific result:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// Reset/Update assessment (Admin function)
router.post('/reset', isAuthenticated, async (req, res) => {
  try {
    // Delete existing active assessments
    await Assessment.deleteMany({ isActive: true });
    
    // Create new assessment with all 72 questions
    const assessment = await createDefaultAssessment();
    
    res.json({ 
      success: true, 
      message: 'Assessment reset successfully',
      questionCount: assessment.questions.length 
    });
  } catch (error) {
    console.error('Error resetting assessment:', error);
    res.status(500).json({ error: 'Failed to reset assessment' });
  }
});

// Helper functions
function getScoreForAnswer(answer) {
  const scoreMap = {
    'A': 5, // Strongly Agree
    'B': 4, // Agree
    'C': 3, // Neutral
    'D': 2, // Disagree
    'E': 1  // Strongly Disagree
  };
  return scoreMap[answer] || 0;
}

function calculateDomainScores(answers, questions) {
  const domainScores = {
    'logical-mathematical': 0,
    'linguistic-verbal': 0,
    'visual-spatial': 0,
    'musical-rhythmic': 0,
    'bodily-kinesthetic': 0,
    'interpersonal': 0,
    'intrapersonal': 0,
    'naturalistic': 0,
    'emotional-intelligence': 0,
    'creative-innovative': 0,
    'analytical': 0,
    'practical': 0
  };

  answers.forEach((answer, index) => {
    const question = questions[index];
    const score = getScoreForAnswer(answer);
    domainScores[question.domain] += score;
  });

  return domainScores;
}

function getTopDomains(domainScores) {
  return Object.entries(domainScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)
    .map(([domain]) => domain);
}

function generateRecommendations(domainScores, topDomains) {
  const recommendations = [];
  
  // Add domain-specific recommendations
  topDomains.forEach(domain => {
    switch(domain) {
      case 'logical-mathematical':
        recommendations.push("Consider careers in data science, engineering, or research");
        break;
      case 'linguistic-verbal':
        recommendations.push("Explore opportunities in writing, communication, or education");
        break;
      case 'visual-spatial':
        recommendations.push("Look into design, architecture, or creative arts fields");
        break;
      case 'musical-rhythmic':
        recommendations.push("Consider music production, sound engineering, or performing arts");
        break;
      case 'bodily-kinesthetic':
        recommendations.push("Explore sports, dance, or hands-on technical work");
        break;
      case 'interpersonal':
        recommendations.push("Consider careers in teaching, counseling, or sales");
        break;
      case 'intrapersonal':
        recommendations.push("Look into research, writing, or independent consulting");
        break;
      case 'naturalistic':
        recommendations.push("Explore environmental science, biology, or outdoor education");
        break;
      case 'emotional-intelligence':
        recommendations.push("Consider leadership, human resources, or conflict resolution roles");
        break;
      case 'creative-innovative':
        recommendations.push("Look into entrepreneurship, product design, or creative industries");
        break;
      case 'analytical':
        recommendations.push("Consider research, data analysis, or quality assurance roles");
        break;
      case 'practical':
        recommendations.push("Explore management, operations, or event planning careers");
        break;
    }
  });

  return recommendations;
}

function generateCareerSuggestions(topDomains) {
  const careerMap = {
    'logical-mathematical': ['Data Scientist', 'Software Engineer', 'Research Analyst', 'Mathematician', 'Financial Analyst'],
    'linguistic-verbal': ['Content Writer', 'Teacher', 'Journalist', 'Public Relations', 'Translator'],
    'visual-spatial': ['Graphic Designer', 'Architect', 'Interior Designer', 'Animator', 'Urban Planner'],
    'musical-rhythmic': ['Music Producer', 'Sound Engineer', 'Composer', 'Music Teacher', 'Audio Technician'],
    'bodily-kinesthetic': ['Physical Therapist', 'Dance Instructor', 'Sports Coach', 'Craftsman', 'Surgeon'],
    'interpersonal': ['Counselor', 'Sales Manager', 'Human Resources', 'Teacher', 'Social Worker'],
    'intrapersonal': ['Researcher', 'Writer', 'Consultant', 'Psychologist', 'Entrepreneur'],
    'naturalistic': ['Environmental Scientist', 'Biologist', 'Park Ranger', 'Veterinarian', 'Botanist'],
    'emotional-intelligence': ['Leadership Coach', 'HR Manager', 'Mediator', 'Customer Success', 'Team Lead'],
    'creative-innovative': ['Product Designer', 'Entrepreneur', 'Artist', 'Innovation Consultant', 'Creative Director'],
    'analytical': ['Data Analyst', 'Research Scientist', 'Quality Assurance', 'Auditor', 'Business Analyst'],
    'practical': ['Project Manager', 'Operations Manager', 'Event Planner', 'Logistics Coordinator', 'Business Owner']
  };

  const suggestions = [];
  topDomains.forEach(domain => {
    if (careerMap[domain]) {
      suggestions.push(...careerMap[domain]);
    }
  });

  return suggestions.slice(0, 10); // Return top 10 career suggestions
}

async function createDefaultAssessment() {
  const questions = [
    // Logical-Mathematical Intelligence (Questions 1-6)
    {
      domain: 'logical-mathematical',
      questionNumber: 1,
      question: "I enjoy solving puzzles, riddles, or brain teasers.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'logical-mathematical',
      questionNumber: 2,
      question: "When faced with a complex problem, I naturally break it into smaller parts.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'logical-mathematical',
      questionNumber: 3,
      question: "Mathematics and logical reasoning come easily to me.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'logical-mathematical',
      questionNumber: 4,
      question: "I can interpret data, charts, or statistical reports with ease.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'logical-mathematical',
      questionNumber: 5,
      question: "I enjoy coding or working on algorithmic challenges.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'logical-mathematical',
      questionNumber: 6,
      question: "I prefer jobs involving research or problem-solving over purely creative work.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Linguistic-Verbal Intelligence (Questions 7-12)
    {
      domain: 'linguistic-verbal',
      questionNumber: 7,
      question: "I enjoy writing stories, essays, or reports.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'linguistic-verbal',
      questionNumber: 8,
      question: "I can express my ideas clearly in speech and writing.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'linguistic-verbal',
      questionNumber: 9,
      question: "People often compliment my communication skills.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'linguistic-verbal',
      questionNumber: 10,
      question: "I enjoy learning new languages or playing with words.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'linguistic-verbal',
      questionNumber: 11,
      question: "I read books, articles, or poetry for pleasure.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'linguistic-verbal',
      questionNumber: 12,
      question: "I feel confident delivering a speech to a large audience.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Visual-Spatial Intelligence (Questions 13-18)
    {
      domain: 'visual-spatial',
      questionNumber: 13,
      question: "I enjoy drawing, designing, or visualizing ideas.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'visual-spatial',
      questionNumber: 14,
      question: "I can interpret maps, floor plans, or blueprints easily.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'visual-spatial',
      questionNumber: 15,
      question: "I often think in pictures rather than words.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'visual-spatial',
      questionNumber: 16,
      question: "I am skilled at recognizing patterns and visual details.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'visual-spatial',
      questionNumber: 17,
      question: "I enjoy building models, crafting, or arranging spaces.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'visual-spatial',
      questionNumber: 18,
      question: "I would enjoy a career involving architecture, animation, or design.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Musical-Rhythmic Intelligence (Questions 19-24)
    {
      domain: 'musical-rhythmic',
      questionNumber: 19,
      question: "I can easily recognize different musical notes or rhythms.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'musical-rhythmic',
      questionNumber: 20,
      question: "I play a musical instrument or sing.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'musical-rhythmic',
      questionNumber: 21,
      question: "I remember songs easily after hearing them once or twice.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'musical-rhythmic',
      questionNumber: 22,
      question: "I enjoy composing or mixing music.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'musical-rhythmic',
      questionNumber: 23,
      question: "Music helps me focus or think better.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'musical-rhythmic',
      questionNumber: 24,
      question: "I would enjoy working in music production or sound engineering.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Bodily-Kinesthetic Intelligence (Questions 25-30)
    {
      domain: 'bodily-kinesthetic',
      questionNumber: 25,
      question: "I enjoy sports, dance, or other physical activities.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'bodily-kinesthetic',
      questionNumber: 26,
      question: "I learn new physical skills quickly.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'bodily-kinesthetic',
      questionNumber: 27,
      question: "I prefer hands-on work over purely theoretical tasks.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'bodily-kinesthetic',
      questionNumber: 28,
      question: "I have good coordination and balance.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'bodily-kinesthetic',
      questionNumber: 29,
      question: "I enjoy creating things with my hands.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'bodily-kinesthetic',
      questionNumber: 30,
      question: "I would consider a career in performing arts, sports, or physical therapy.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Interpersonal Intelligence (Questions 31-36)
    {
      domain: 'interpersonal',
      questionNumber: 31,
      question: "I find it easy to connect with new people.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'interpersonal',
      questionNumber: 32,
      question: "People often seek my advice for personal or emotional matters.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'interpersonal',
      questionNumber: 33,
      question: "I feel comfortable leading a team or group project.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'interpersonal',
      questionNumber: 34,
      question: "I work well in collaborative environments.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'interpersonal',
      questionNumber: 35,
      question: "I enjoy helping others succeed.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'interpersonal',
      questionNumber: 36,
      question: "I would enjoy a career in teaching, counseling, or public relations.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Intrapersonal Intelligence (Questions 37-42)
    {
      domain: 'intrapersonal',
      questionNumber: 37,
      question: "I have a clear sense of my own strengths and weaknesses.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'intrapersonal',
      questionNumber: 38,
      question: "I set personal goals and work consistently to achieve them.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'intrapersonal',
      questionNumber: 39,
      question: "I am comfortable spending time alone to think and reflect.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'intrapersonal',
      questionNumber: 40,
      question: "I analyze my emotions and motivations often.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'intrapersonal',
      questionNumber: 41,
      question: "I prefer working independently over in groups.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'intrapersonal',
      questionNumber: 42,
      question: "I would enjoy a career involving deep reflection or personal development.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Naturalistic Intelligence (Questions 43-48)
    {
      domain: 'naturalistic',
      questionNumber: 43,
      question: "I enjoy spending time in nature.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'naturalistic',
      questionNumber: 44,
      question: "I can identify plants, animals, or natural patterns easily.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'naturalistic',
      questionNumber: 45,
      question: "I care deeply about environmental issues.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'naturalistic',
      questionNumber: 46,
      question: "I enjoy outdoor activities like hiking or gardening.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'naturalistic',
      questionNumber: 47,
      question: "I prefer real-world nature experiences over digital entertainment.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'naturalistic',
      questionNumber: 48,
      question: "I would enjoy a career in biology, environmental science, or agriculture.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Emotional Intelligence (Questions 49-54)
    {
      domain: 'emotional-intelligence',
      questionNumber: 49,
      question: "I can easily recognize emotions in others from expressions or tone.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'emotional-intelligence',
      questionNumber: 50,
      question: "I stay calm under pressure and manage my emotions well.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'emotional-intelligence',
      questionNumber: 51,
      question: "I can resolve conflicts between people effectively.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'emotional-intelligence',
      questionNumber: 52,
      question: "I adapt my communication style depending on who I speak to.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'emotional-intelligence',
      questionNumber: 53,
      question: "I understand how my mood impacts my decisions.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'emotional-intelligence',
      questionNumber: 54,
      question: "I would enjoy a career in leadership, negotiation, or customer relations.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Creative/Innovative Intelligence (Questions 55-60)
    {
      domain: 'creative-innovative',
      questionNumber: 55,
      question: "I enjoy brainstorming new ideas or projects.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'creative-innovative',
      questionNumber: 56,
      question: "People say I \"think outside the box.\"",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'creative-innovative',
      questionNumber: 57,
      question: "I enjoy designing or inventing new solutions.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'creative-innovative',
      questionNumber: 58,
      question: "I adapt easily when plans change suddenly.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'creative-innovative',
      questionNumber: 59,
      question: "I like combining ideas from different fields to make something unique.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'creative-innovative',
      questionNumber: 60,
      question: "I would enjoy a career in entrepreneurship, product design, or arts.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Analytical Intelligence (Questions 61-66)
    {
      domain: 'analytical',
      questionNumber: 61,
      question: "I prefer structured, fact-based problem solving.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'analytical',
      questionNumber: 62,
      question: "I analyze pros and cons before making decisions.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'analytical',
      questionNumber: 63,
      question: "I enjoy academic research and technical reading.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'analytical',
      questionNumber: 64,
      question: "I often spot errors or inconsistencies others miss.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'analytical',
      questionNumber: 65,
      question: "I enjoy comparing multiple solutions to find the best one.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'analytical',
      questionNumber: 66,
      question: "I would enjoy a career as a researcher, data scientist, or auditor.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    // Practical Intelligence (Questions 67-72)
    {
      domain: 'practical',
      questionNumber: 67,
      question: "I quickly figure out how to apply theory to real-life problems.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'practical',
      questionNumber: 68,
      question: "I am good at organizing events or managing logistics.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'practical',
      questionNumber: 69,
      question: "I can fix or troubleshoot things without formal training.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'practical',
      questionNumber: 70,
      question: "I adapt easily to changing situations.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'practical',
      questionNumber: 71,
      question: "I am comfortable making quick decisions under pressure.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    },
    {
      domain: 'practical',
      questionNumber: 72,
      question: "I would enjoy a career in management, operations, or event planning.",
      options: [
        { text: "Strongly Agree", value: "A", score: 5 },
        { text: "Agree", value: "B", score: 4 },
        { text: "Neutral", value: "C", score: 3 },
        { text: "Disagree", value: "D", score: 2 },
        { text: "Strongly Disagree", value: "E", score: 1 }
      ]
    }
  ];

  const assessment = new Assessment({
    questions: questions
  });

  return await assessment.save();
}

module.exports = router;
