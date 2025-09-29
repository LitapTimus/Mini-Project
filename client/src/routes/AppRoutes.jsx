import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import RoleSelection from "../pages/RoleSelection";
import StudentAuth from "../pages/StudentAuth";
import MentorAuth from "../pages/MentorAuth";
import RecruiterAuth from "../pages/RecruiterAuth";
import VerifyOTP from "../pages/VerifyOTP";
import Dashboard from "../pages/Dashboard";
import StudentDashboard from "../pages/StudentDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useState, useEffect, useCallback } from "react";
import LoadingScreen from "../components/LoadingScreen";
import InterviewStart from "../pages/InterviewStart";
import InterviewWorkspace from "../pages/InterviewWorkspace";
import InterviewSummary from "../pages/InterviewSummary";
import Jobs from "../pages/Jobs";
import RecruiterJobs from "../pages/RecruiterJobs";
import RecruiterCompany from "../pages/RecruiterCompany";
import RecruiterApplicants from "../pages/RecruiterApplicants";

export default function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      // Check if we have a token and user in localStorage
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          setUser(user);
          // Don't override selectedRole if it's already set
          if (!localStorage.getItem("selectedRole") && user?.role) {
            localStorage.setItem("selectedRole", user.role);
          }
        } catch (e) {
          // Invalid JSON, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("selectedRole");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (_e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Role selection page */}
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Authentication pages for each role */}
        <Route path="/auth/student" element={<StudentAuth />} />
        <Route path="/auth/mentor" element={<MentorAuth />} />
        <Route path="/auth/recruiter" element={<RecruiterAuth />} />

        {/* OTP Verification page */}
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Role-specific dashboards */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />

        {/* Protected dashboard - handles all role-based routing internally */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} loading={loading}>
              {loading ? <LoadingScreen /> : <Dashboard key="dashboard" />}
            </ProtectedRoute>
          }
        />

        {/* AI Interview flow (public for now) */}
        <Route path="/interview" element={<InterviewStart />} />
        <Route
          path="/interview/session/:sessionId/question"
          element={<InterviewWorkspace />}
        />
        <Route
          path="/interview/session/:sessionId/summary"
          element={<InterviewSummary />}
        />

        {/* Jobs board visible to students */}
        <Route path="/jobs" element={<Jobs />} />

        {/* Recruiter tools */}
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/company" element={<RecruiterCompany />} />
        <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
      </Routes>
    </BrowserRouter>
  );
}
