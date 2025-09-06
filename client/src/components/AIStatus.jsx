import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiSettings } from 'react-icons/fi';

export default function AIStatus() {
  const [aiStatus, setAiStatus] = useState({
    openai: false,
    gemini: false,
    claude: false,
    overall: false
  });

  useEffect(() => {
    // This would typically check with the backend for AI status
    // For now, we'll simulate the status based on environment
    const checkAIStatus = () => {
      // In a real implementation, this would be an API call
      const status = {
        openai: !!process.env.REACT_APP_OPENAI_API_KEY,
        gemini: !!process.env.REACT_APP_GEMINI_API_KEY,
        claude: !!process.env.REACT_APP_CLAUDE_API_KEY,
        overall: false
      };
      status.overall = status.openai || status.gemini || status.claude;
      setAiStatus(status);
    };

    checkAIStatus();
  }, []);

  const getStatusIcon = (status) => {
    if (status) return <FiCheckCircle className="w-5 h-5 text-green-500" />;
    return <FiXCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (status) => {
    return status ? 'Configured' : 'Not Configured';
  };

  const getStatusColor = (status) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FiSettings className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI Integration Status</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">OpenAI (ChatGPT)</span>
            {getStatusIcon(aiStatus.openai)}
          </div>
          <span className={`text-sm ${getStatusColor(aiStatus.openai)}`}>
            {getStatusText(aiStatus.openai)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Google Gemini</span>
            {getStatusIcon(aiStatus.gemini)}
          </div>
          <span className={`text-sm ${getStatusColor(aiStatus.gemini)}`}>
            {getStatusText(aiStatus.gemini)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Anthropic Claude</span>
            {getStatusIcon(aiStatus.claude)}
          </div>
          <span className={`text-sm ${getStatusColor(aiStatus.claude)}`}>
            {getStatusText(aiStatus.claude)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Overall Status</span>
            {aiStatus.overall ? (
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <FiAlertCircle className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          <span className={`text-sm ${aiStatus.overall ? 'text-green-600' : 'text-yellow-600'}`}>
            {aiStatus.overall ? 'AI Analysis Available' : 'Traditional Analysis Only'}
          </span>
        </div>
      </div>

      {!aiStatus.overall && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> No AI API keys configured. The system will use traditional career recommendations. 
            To enable AI analysis, add API keys to your environment configuration.
          </p>
        </div>
      )}
    </div>
  );
}
