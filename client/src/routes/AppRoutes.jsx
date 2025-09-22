import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import RoleSelection from "../pages/RoleSelection";
import Dashboard from "../pages/Dashboard";
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
      const res = await fetch("http://localhost:3000/auth/user", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
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
        <Route path="/interview/session/:sessionId/question" element={<InterviewWorkspace />} />
        <Route path="/interview/session/:sessionId/summary" element={<InterviewSummary />} />

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
