const API_BASE_URL = 'http://localhost:3000/api';

export const assessmentService = {
  // Get the career guidance assessment
  async getAssessment() {
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch assessment');
    }
    
    return response.json();
  },

  // Submit assessment answers
  async submitAssessment(answers, timeTaken) {
    const response = await fetch(`${API_BASE_URL}/assessments/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ answers, timeTaken })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit assessment');
    }
    
    return response.json();
  },

  // Get student's test results
  async getTestResults() {
    const response = await fetch(`${API_BASE_URL}/assessments/results`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch test results');
    }
    
    return response.json();
  },

  // Get specific test result
  async getTestResult(resultId) {
    const response = await fetch(`${API_BASE_URL}/assessments/results/${resultId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch test result');
    }
    
    return response.json();
  },

  // Reset assessment (Admin function)
  async resetAssessment() {
    const response = await fetch(`${API_BASE_URL}/assessments/reset`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset assessment');
    }
    
    return response.json();
  }
};

