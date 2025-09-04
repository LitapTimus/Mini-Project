import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

import LoginOptions from "../pages/LoginOptions";
import AboutPage from "../pages/AboutPage";
import StudentLanding from "../pages/StudentLanding";

import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useState, useEffect, useCallback } from "react";
import LoadingScreen from "../components/LoadingScreen";

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


        {/* Login options page */}
        <Route path="/login-options" element={<LoginOptions />} />

        {/* About page */}
        <Route path="/about" element={<AboutPage />} />

        {/* Student dashboard */}
        <Route path="/student-dashboard" element={<StudentLanding />} />

        {/* Protected dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} loading={loading}>
              {loading ? <LoadingScreen /> : <Dashboard key="dashboard" />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
