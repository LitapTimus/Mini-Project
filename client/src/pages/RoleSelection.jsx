import React from "react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiUsers, FiBriefcase } from "react-icons/fi";

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = async (role) => {
    try {
      // Store selected role in localStorage
      localStorage.setItem("selectedRole", role);
      // Navigate to the specific auth page for the selected role
      navigate(`/auth/${role}`);
    } catch (error) {
      console.error("Error in role selection:", error);
    }
  };

  const roles = [
    {
      id: "student",
      title: "Student",
      description:
        "Explore career paths, find opportunities, and get guidance from mentors",
      icon: FiBookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "mentor",
      title: "Mentor",
      description: "Share your expertise, guide others, and help shape careers",
      icon: FiUsers,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: "recruiter",
      title: "Recruiter",
      description: "Find top talent, post opportunities, and build your team",
      icon: FiBriefcase,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-green-600">Role</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select how you'd like to use Career Compass. This helps us
            personalize your experience.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`${role.bgColor} rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gray-200`}
              >
                <div className="text-center">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${role.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {role.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Select Button */}
                  <button
                    className={`bg-gradient-to-r ${role.color} text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}
                  >
                    Select {role.title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-gray-500 hover:text-gray-700 text-lg font-medium hover:underline transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
