import React, { useState, useEffect } from 'react';
import { assessmentService } from '../services/assessmentService';

export default function AssessmentTest({ onComplete, onCancel }) {
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssessment();
    setStartTime(Date.now());
  }, []);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessment();
      setAssessment(data);
      // Initialize answers array with empty values
      setAnswers(new Array(data.questions.length).fill(''));
    } catch (error) {
      setError('Failed to load assessment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === '')) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const timeTaken = Math.round((Date.now() - startTime) / 60000); // Convert to minutes
      
      const result = await assessmentService.submitAssessment(answers, timeTaken);
      onComplete(result.result);
    } catch (error) {
      setError('Failed to submit assessment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    if (!assessment) return 0;
    return Math.round(((currentQuestion + 1) / assessment.questions.length) * 100);
  };

  const getDomainName = (domain) => {
    const domainNames = {
      'logical-mathematical': 'Logical-Mathematical',
      'linguistic-verbal': 'Linguistic-Verbal',
      'visual-spatial': 'Visual-Spatial',
      'musical-rhythmic': 'Musical-Rhythmic',
      'bodily-kinesthetic': 'Bodily-Kinesthetic',
      'interpersonal': 'Interpersonal',
      'intrapersonal': 'Intrapersonal',
      'naturalistic': 'Naturalistic',
      'emotional-intelligence': 'Emotional Intelligence',
      'creative-innovative': 'Creative-Innovative',
      'analytical': 'Analytical',
      'practical': 'Practical'
    };
    return domainNames[domain] || domain;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No assessment available.</p>
        </div>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];
  const isLastQuestion = currentQuestion === assessment.questions.length - 1;
  const hasAnswer = answers[currentQuestion] !== '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel Test
            </button>
          </div>
          <p className="text-gray-600 mb-4">{assessment.description}</p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {assessment.questions.length}
              </span>
              <span className="text-sm text-gray-500">{getProgressPercentage()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Domain Indicator */}
          <div className="bg-blue-50 rounded-lg p-3">
            <span className="text-sm font-medium text-blue-800">
              Domain: {getDomainName(question.domain)}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option.value}
                  checked={answers[currentQuestion] === option.value}
                  onChange={() => handleAnswerSelect(option.value)}
                  className="mr-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 font-medium">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {!isLastQuestion ? (
              <button
                onClick={nextQuestion}
                disabled={!hasAnswer}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  !hasAnswer
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswer || submitting}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  !hasAnswer || submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {assessment.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion
                    ? 'bg-blue-600'
                    : answers[index] !== ''
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
                title={`Question ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
