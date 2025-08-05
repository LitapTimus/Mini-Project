export default function LoginOptions() {
  const handleLoginOption = (userType) => {
    localStorage.setItem("selectedUserType", userType);
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/30 backdrop-blur-lg border border-white/60 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Choose Your Profile
          </h1>
          <p className="text-gray-700">
            Select how you'd like to use Career Compass
          </p>
        </div>

        <div className="space-y-4">
          {/* Student Option */}
          <button
            onClick={() => handleLoginOption("student")}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-green-100">
              <FiBookOpen className="w-6 h-6 text-blue-600 group-hover:text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Student</h3>
              <p className="text-sm text-gray-600">
                Explore career paths, find job opportunities and get guidance
                from expert Mentors
              </p>
            </div>
          </button>

          {/* Professional Option */}
          <button
            onClick={() => handleLoginOption("professional")}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-green-100">
              <FiBriefcase className="w-6 h-6 text-purple-600 group-hover:text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Recruiters</h3>
              <p className="text-sm text-gray-600">
                Find and connect with top talent
              </p>
            </div>
          </button>

          {/* Career Counselor Option */}
          <button
            onClick={() => handleLoginOption("counselor")}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="bg-orange-100 p-3 rounded-full group-hover:bg-green-100">
              <FiUser className="w-6 h-6 text-orange-600 group-hover:text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Career Counselor</h3>
              <p className="text-sm text-gray-600">
                Help others navigate their career journey
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
import { FiBookOpen, FiBriefcase, FiUser } from "react-icons/fi";   