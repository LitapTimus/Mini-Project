import React from 'react';

export default function AssessmentResults({ results, onRetake, onBack }) {
  const getDomainDisplayName = (domain) => {
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
  };

  const getScoreColor = (score) => {
    if (score >= 24) return 'text-green-600';
    if (score >= 18) return 'text-blue-600';
    if (score >= 12) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 24) return 'Excellent';
    if (score >= 18) return 'Good';
    if (score >= 12) return 'Average';
    return 'Needs Improvement';
  };

  const getDomainIcon = (domain) => {
    const icons = {
      'logical-mathematical': '🧮',
      'linguistic-verbal': '📝',
      'visual-spatial': '🎨',
      'musical-rhythmic': '🎵',
      'bodily-kinesthetic': '🏃‍♂️',
      'interpersonal': '🤝',
      'intrapersonal': '🧠',
      'naturalistic': '🌿',
      'emotional-intelligence': '❤️',
      'creative-innovative': '💡',
      'analytical': '📊',
      'practical': '⚙️'
    };
    return icons[domain] || '❓';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Assessment Results 🎯
            </h1>
            <p className="text-xl text-gray-600">
              Your Career Guidance Assessment Results
            </p>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              {results.percentage}%
            </div>
            <div className="text-xl mb-2">
              Total Score: {results.totalScore} / {results.maxPossibleScore}
            </div>
            <div className="text-lg opacity-90">
              {results.percentage >= 80 ? 'Outstanding Performance!' :
               results.percentage >= 60 ? 'Good Performance!' :
               'Keep Working on Your Skills!'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={onRetake}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retake Assessment
            </button>
            <button
              onClick={onBack}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Domain Scores */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Domain Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(results.domainScores).map(([domain, score]) => (
              <div key={domain} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{getDomainIcon(domain)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {getDomainDisplayName(domain)}
                    </h3>
                    <p className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}/30
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {getScoreLabel(score)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(score / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Domains */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Top Strengths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.topDomains.map((domain, index) => (
              <div key={domain} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{getDomainIcon(domain)}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      #{index + 1} - {getDomainDisplayName(domain)}
                    </h3>
                    <p className="text-green-600 font-semibold">
                      Score: {results.domainScores[domain]}/30
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  This is one of your strongest areas. Consider exploring careers that leverage these skills.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalized Recommendations</h2>
          <div className="space-y-4">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-lg">💡</span>
                <p className="text-gray-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Path Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.careerSuggestions.map((career, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center">
                  <span className="text-purple-600 text-lg mr-2">🎯</span>
                  <span className="font-medium text-gray-900">{career}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold mb-2">Research Careers</h3>
              <p className="text-sm opacity-90">Explore the suggested career paths in detail</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-semibold mb-2">Skill Development</h3>
              <p className="text-sm opacity-90">Focus on improving your weaker domains</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-sm opacity-90">Network with professionals in your areas of interest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

