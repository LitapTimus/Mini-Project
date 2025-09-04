const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    enum: [
      'logical-mathematical',
      'linguistic-verbal', 
      'visual-spatial',
      'musical-rhythmic',
      'bodily-kinesthetic',
      'interpersonal',
      'intrapersonal',
      'naturalistic',
      'emotional-intelligence',
      'creative-innovative',
      'analytical',
      'practical'
    ]
  },
  questionNumber: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }]
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Career Guidance Assessment - Multiple Intelligence Test"
  },
  description: {
    type: String,
    default: "This assessment evaluates your strengths across 12 different intelligence domains to help guide your career choices."
  },
  questions: [questionSchema],
  totalQuestions: {
    type: Number,
    default: 72
  },
  domains: {
    type: Number,
    default: 12
  },
  questionsPerDomain: {
    type: Number,
    default: 6
  },
  maxScorePerDomain: {
    type: Number,
    default: 30
  },
  minScorePerDomain: {
    type: Number,
    default: 6
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const studentTestResultSchema = new mongoose.Schema({
  studentId: {
    type: String, // Changed from ObjectId to String for Google OAuth IDs
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [{
    questionNumber: Number,
    domain: String,
    selectedAnswer: String,
    score: Number
  }],
  domainScores: {
    'logical-mathematical': { type: Number, default: 0 },
    'linguistic-verbal': { type: Number, default: 0 },
    'visual-spatial': { type: Number, default: 0 },
    'musical-rhythmic': { type: Number, default: 0 },
    'bodily-kinesthetic': { type: Number, default: 0 },
    'interpersonal': { type: Number, default: 0 },
    'intrapersonal': { type: Number, default: 0 },
    'naturalistic': { type: Number, default: 0 },
    'emotional-intelligence': { type: Number, default: 0 },
    'creative-innovative': { type: Number, default: 0 },
    'analytical': { type: Number, default: 0 },
    'practical': { type: Number, default: 0 }
  },
  totalScore: {
    type: Number,
    required: true
  },
  maxPossibleScore: {
    type: Number,
    default: 360 // 72 questions × 5 points
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: Number, // in minutes
  completedAt: {
    type: Date,
    default: Date.now
  },
  topDomains: [String], // Top 3-4 strongest domains
  recommendations: [String],
  careerSuggestions: [String]
});

module.exports = {
  Assessment: mongoose.model('Assessment', assessmentSchema),
  StudentTestResult: mongoose.model('StudentTestResult', studentTestResultSchema)
};
