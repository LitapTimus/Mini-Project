import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import MentorDashboard from "./MentorDashboard";
import RecruiterDashboard from "./RecruiterDashboard";

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get role from localStorage and set it once
    const role = localStorage.getItem("selectedRole");
    console.log("Dashboard mounted, role:", role);
    setSelectedRole(role);
  }, []); // Empty dependency array - only run once on mount

  // If no role is selected, show role selection prompt
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Welcome!</h1>
          <p className="text-gray-600 mb-6">
            Please select your role to continue to your personalized dashboard.
          </p>
          <button 
            onClick={() => navigate("/role-selection")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Select Role
          </button>
        </div>
      </div>
    );
  }

    // Render role-specific dashboard content
  if (selectedRole === "student") {
    console.log("Rendering StudentDashboard");
    return <StudentDashboard />;
  }

  if (selectedRole === "mentor") {
    console.log("Rendering MentorDashboard");
    return <MentorDashboard />;
  }

  if (selectedRole === "recruiter") {
    console.log("Rendering RecruiterDashboard");
    return <RecruiterDashboard />;
  }

  // For any other roles, show a placeholder
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          {selectedRole} dashboard is coming soon!
        </p>
        <button 
          onClick={() => navigate("/role-selection")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Change Role
        </button>
      </div>
    </div>
  );
}
