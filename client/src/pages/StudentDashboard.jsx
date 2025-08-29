import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentProfileForm from "../components/StudentProfileForm";
import AssessmentTest from "../components/AssessmentTest";
import AssessmentResults from "../components/AssessmentResults";
import { studentService } from "../services/studentService";
import { assessmentService } from "../services/assessmentService";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const profile = await studentService.getProfile();
      setStudentProfile(profile);
    } catch (error) {
      console.log("No profile found yet");
      setStudentProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData) => {
    try {
      console.log('Submitting profile data:', profileData);
      const result = await studentService.saveProfile(profileData);
      setStudentProfile(result.student);
      setShowProfileForm(false);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error('Profile submission error:', error);
      let errorMessage = error.message;
      
      // If it's a validation error, show more details
      if (error.message.includes('Validation error') && error.response) {
        try {
          const errorData = await error.response.json();
          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = `Validation errors:\n${errorData.errors.join('\n')}`;
          }
        } catch (e) {
          // If we can't parse the error response, use the original message
        }
      }
      
      alert("Error saving profile: " + errorMessage);
    }
  };

  const handleAssessmentComplete = (results) => {
    setAssessmentResults(results);
    setShowAssessment(false);
    setShowResults(true);
  };

  const handleAssessmentCancel = () => {
    setShowAssessment(false);
  };

  const handleRetakeAssessment = () => {
    setShowResults(false);
    setShowAssessment(true);
  };

  const handleBackToDashboard = () => {
    setShowResults(false);
    setAssessmentResults(null);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("selectedRole");
    // Redirect to home
    navigate("/");
  };

  // Show assessment test if requested
  if (showAssessment) {
    return (
      <AssessmentTest
        onComplete={handleAssessmentComplete}
        onCancel={handleAssessmentCancel}
      />
    );
  }

  // Show assessment results if requested
  if (showResults && assessmentResults) {
    return (
      <AssessmentResults
        results={assessmentResults}
        onRetake={handleRetakeAssessment}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Show profile form if requested
  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setShowProfileForm(false)}
            className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </button>
          <StudentProfileForm
            onSubmit={handleProfileSubmit}
            onCancel={() => setShowProfileForm(false)}
            initialData={studentProfile}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome to your learning journey</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hello <span className="text-blue-600">Student</span>! 👋
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to your personalized career development dashboard. 
            Let's explore opportunities and build your future together.
          </p>
        </div>

        {/* Profile Status */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        ) : studentProfile ? (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Profile Status</h3>
              <button
                onClick={() => setShowProfileForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{studentProfile.firstName} {studentProfile.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Education</p>
                <p className="font-medium">{studentProfile.currentEducation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Institution</p>
                <p className="font-medium">{studentProfile.institution || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Completion</p>
                <p className="font-medium text-green-600">100% Complete</p>
              </div>
            </div>
          </div>
        ) : (
                     <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
             <div className="text-center">
               <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
               <p className="text-gray-600 mb-4">Get started by creating your student profile</p>
               <button
                 onClick={() => setShowProfileForm(true)}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
               >
                 Create Profile
               </button>
             </div>
           </div>
         )}

                  {/* Assessment Section */}
         <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
           <div className="text-center">
             <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Assessment Test</h3>
             <p className="text-gray-600 mb-4">Take our comprehensive assessment to discover your career strengths</p>
             <button
               onClick={() => setShowAssessment(true)}
               className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
             >
               Start Assessment
             </button>
           </div>
         </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Careers</h3>
            <p className="text-gray-600 text-sm">Discover different career paths and requirements</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Goals</h3>
            <p className="text-gray-600 text-sm">Define and track your career objectives</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">🤝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Mentors</h3>
            <p className="text-gray-600 text-sm">Connect with experienced professionals</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Welcome to Career Compass!</span>
              <span className="text-gray-400 text-sm ml-auto">Just now</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Profile setup completed</span>
              <span className="text-gray-400 text-sm ml-auto">Just now</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
