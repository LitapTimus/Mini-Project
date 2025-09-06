import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiBookOpen, FiTarget, FiUsers, FiTrendingUp, FiLogOut, FiEdit3, FiCheckCircle, FiArrowRight, FiActivity } from "react-icons/fi";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadStudentProfile();
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

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

  const handleResetAssessment = async () => {
    if (window.confirm("Are you sure you want to reset the assessment? This will update it to include all 72 questions across 12 domains.")) {
      try {
        setLoading(true);
        const result = await assessmentService.resetAssessment();
        alert(`Assessment reset successfully! Now includes ${result.questionCount} questions.`);
      } catch (error) {
        console.error('Error resetting assessment:', error);
        alert('Error resetting assessment: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
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
      <div className="min-h-screen bg-[#f9fafb] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setShowProfileForm(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <FiArrowRight className="w-4 h-4 rotate-180" />
                Back to Dashboard
              </button>
            </div>
            <StudentProfileForm
              onSubmit={handleProfileSubmit}
              onCancel={() => setShowProfileForm(false)}
              initialData={studentProfile}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-white via-gray-50 to-white shadow-lg border-b border-gray-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 via-transparent to-blue-50/30"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f9ff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-green-100">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {user?.displayName ? `${user.displayName}'s Dashboard` : 'Student Dashboard'}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-600 font-medium">Welcome to your career journey</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Stats */}
              <div className="hidden md:flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-gray-500">Profile</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-xs text-gray-500">Assessments</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-xs text-gray-500">Goals</div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="group flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FiLogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-200/20 to-green-200/20 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-6 py-2 mb-6 border border-green-200/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Career Development Platform</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Hello <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">{user?.displayName?.split(' ')[0] || 'Student'}</span>! 👋
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Welcome to your personalized career development dashboard. 
              Let's explore opportunities and build your future together.
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Profile Progress</span>
                <span>{studentProfile ? '100%' : '0%'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: studentProfile ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Card */}
          {loading ? (
            <div className="col-span-1 lg:col-span-2">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-6 text-gray-600 text-lg">Loading your profile...</p>
              </div>
            </div>
          ) : studentProfile ? (
            <div className="group relative bg-gradient-to-br from-white via-green-50/30 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-green-100/50 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiCheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Profile Complete</h3>
                      <p className="text-gray-600">Your profile is ready</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileForm(true)}
                    className="group/btn flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FiEdit3 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-bold text-gray-900 truncate">{studentProfile.firstName} {studentProfile.lastName}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                    <p className="text-sm text-gray-600 mb-1">Education</p>
                    <p className="font-bold text-gray-900 capitalize">{studentProfile.currentEducation}</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Profile Status</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">100%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="group relative bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100/50 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FiUser className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
                <p className="text-gray-600 mb-8 text-lg">Get started by creating your student profile to unlock personalized career insights</p>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="group/btn flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mx-auto"
                >
                  <FiUser className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300" />
                  Create Profile
                  <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* Assessment Card */}
          <div className="group relative bg-gradient-to-br from-white via-purple-50/30 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-100/50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FiTarget className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Assessment</h3>
              <p className="text-gray-600 mb-8 text-lg">Discover your strengths and get personalized career recommendations</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>15-20 minutes</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Personalized results</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Career insights</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setShowAssessment(true)}
                  className="group/btn flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FiTarget className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300" />
                  Start Assessment
                  <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
                
                <button
                  onClick={handleResetAssessment}
                  disabled={loading}
                  className="group/btn flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none"
                >
                  <FiActivity className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                  {loading ? 'Resetting...' : 'Reset Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Quick Actions</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Explore Your Options</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover tools and resources to accelerate your career growth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50 overflow-hidden cursor-pointer">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-100/20 to-transparent rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <FiBookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Careers</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Discover different career paths and requirements tailored to your interests and skills</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Industry insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Salary information</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Skill requirements</span>
                  </div>
                </div>
                
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  <span>Explore now</span>
                  <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-white via-green-50/30 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100/50 overflow-hidden cursor-pointer">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <FiTrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Set Goals</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Define and track your career objectives with our smart goal-setting tools</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>SMART goals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Milestone alerts</span>
                  </div>
                </div>
                
                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                  <span>Set goals</span>
                  <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-white via-purple-50/30 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100/50 overflow-hidden cursor-pointer">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-100/20 to-transparent rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <FiUsers className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Mentors</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Connect with experienced professionals in your field of interest</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Industry experts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>1-on-1 sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Career guidance</span>
                  </div>
                </div>
                
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                  <span>Find mentors</span>
                  <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FiActivity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-800 font-medium">Welcome to Career Compass!</span>
              <span className="text-blue-600 text-sm ml-auto font-medium">Just now</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-800 font-medium">Profile setup completed</span>
              <span className="text-green-600 text-sm ml-auto font-medium">Just now</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-800 font-medium">Ready to start your career assessment</span>
              <span className="text-purple-600 text-sm ml-auto font-medium">Ready</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
