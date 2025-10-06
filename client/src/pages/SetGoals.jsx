import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTarget, FiCheck, FiX } from "react-icons/fi";

export default function SetGoals() {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState("");
  const [goals, setGoals] = useState([]);

  // Career options with associated goals
  const careerGoals = {
    "software-engineer": [
      { id: 1, text: "Learn a programming language (JavaScript, Python, etc.)", completed: false },
      { id: 2, text: "Build a personal project portfolio (at least 3 projects)", completed: false },
      { id: 3, text: "Master data structures and algorithms", completed: false },
      { id: 4, text: "Contribute to an open-source project", completed: false },
      { id: 5, text: "Prepare for technical interviews", completed: false },
      { id: 6, text: "Learn a framework (React, Angular, Vue, etc.)", completed: false },
      { id: 7, text: "Get familiar with version control systems (Git)", completed: false }
    ],
    "data-scientist": [
      { id: 1, text: "Master Python and R programming languages", completed: false },
      { id: 2, text: "Learn statistics and probability fundamentals", completed: false },
      { id: 3, text: "Complete a machine learning course", completed: false },
      { id: 4, text: "Build a data analysis portfolio (at least 3 projects)", completed: false },
      { id: 5, text: "Learn data visualization techniques", completed: false },
      { id: 6, text: "Practice with real-world datasets", completed: false },
      { id: 7, text: "Get familiar with SQL and database concepts", completed: false }
    ],
    "ux-designer": [
      { id: 1, text: "Create a design portfolio with at least 3 projects", completed: false },
      { id: 2, text: "Learn a design tool (Figma, Sketch, Adobe XD)", completed: false },
      { id: 3, text: "Study user research methodologies", completed: false },
      { id: 4, text: "Practice wireframing and prototyping", completed: false },
      { id: 5, text: "Learn about accessibility standards", completed: false },
      { id: 6, text: "Understand design systems and component libraries", completed: false },
      { id: 7, text: "Conduct user testing sessions", completed: false }
    ],
    "cybersecurity-analyst": [
      { id: 1, text: "Learn networking fundamentals", completed: false },
      { id: 2, text: "Study common security vulnerabilities and threats", completed: false },
      { id: 3, text: "Practice with security tools and frameworks", completed: false },
      { id: 4, text: "Get familiar with encryption concepts", completed: false },
      { id: 5, text: "Learn about security compliance and regulations", completed: false },
      { id: 6, text: "Practice penetration testing techniques", completed: false },
      { id: 7, text: "Prepare for security certifications (CompTIA Security+, etc.)", completed: false }
    ],
    "product-manager": [
      { id: 1, text: "Learn about product development lifecycle", completed: false },
      { id: 2, text: "Study market research techniques", completed: false },
      { id: 3, text: "Practice creating product roadmaps", completed: false },
      { id: 4, text: "Develop user story writing skills", completed: false },
      { id: 5, text: "Learn about agile methodologies", completed: false },
      { id: 6, text: "Practice data-driven decision making", completed: false },
      { id: 7, text: "Improve presentation and stakeholder management skills", completed: false }
    ]
  };

  const handleCareerChange = (e) => {
    const career = e.target.value;
    setSelectedCareer(career);
    if (career) {
      setGoals(careerGoals[career]);
    } else {
      setGoals([]);
    }
  };

  const toggleGoalCompletion = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const calculateProgress = () => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter(goal => goal.completed).length;
    return Math.round((completedGoals / goals.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <FiTarget className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Set Career Goals</h1>
          </div>
        </div>

        {/* Career Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-green-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Target Career Path</h2>
          <select
            value={selectedCareer}
            onChange={handleCareerChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm text-gray-800"
          >
            <option value="">-- Select a career --</option>
            <option value="software-engineer">Software Engineer</option>
            <option value="data-scientist">Data Scientist</option>
            <option value="ux-designer">UX Designer</option>
            <option value="cybersecurity-analyst">Cybersecurity Analyst</option>
            <option value="product-manager">Product Manager</option>
          </select>
        </div>

        {/* Goals Section */}
        {selectedCareer && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{calculateProgress()}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className={`flex items-center p-4 rounded-xl border transition-all ${
                    goal.completed 
                      ? "bg-green-50 border-green-200" 
                      : "bg-white border-gray-200 hover:border-green-200"
                  }`}
                  onClick={() => toggleGoalCompletion(goal.id)}
                >
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 cursor-pointer ${
                      goal.completed 
                        ? "bg-green-500 text-white" 
                        : "border-2 border-gray-300"
                    }`}
                  >
                    {goal.completed && <FiCheck className="w-4 h-4" />}
                  </div>
                  <p className={`flex-1 text-gray-800 ${goal.completed ? "line-through text-gray-500" : ""}`}>
                    {goal.text}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Motivational Message */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100">
              <p className="text-gray-700 text-center">
                {calculateProgress() === 100 
                  ? "Congratulations! You've completed all your goals for this career path! 🎉" 
                  : "Keep going! Each completed goal brings you closer to your dream career. 💪"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}