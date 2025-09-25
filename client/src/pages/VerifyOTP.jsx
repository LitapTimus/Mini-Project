import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Shield, ArrowLeft } from "lucide-react";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { email, name, role } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/role-selection");
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpValue,
            type: "email_verification",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        const dashboardRoute = `/${role}-dashboard`;
        navigate(dashboardRoute);
      } else {
        alert(data.message || "OTP verification failed");
        setOtp(new Array(6).fill(""));
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resending || countdown > 0) return;

    setResending(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            type: "email_verification",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCountdown(60); // Start 60 second countdown
        alert("OTP sent successfully!");
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "student":
        return "from-blue-500 to-green-500";
      case "mentor":
        return "from-purple-500 to-blue-500";
      case "recruiter":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  const getRoleColorText = () => {
    switch (role) {
      case "student":
        return "from-blue-600 to-green-600";
      case "mentor":
        return "from-purple-600 to-blue-600";
      case "recruiter":
        return "from-orange-600 to-red-600";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-bl from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 bg-gradient-to-r ${getRoleColor()} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
            >
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your{" "}
              <span
                className={`bg-gradient-to-r ${getRoleColorText()} bg-clip-text text-transparent capitalize`}
              >
                {role}
              </span>{" "}
              Account
            </h1>
            <p className="text-gray-600 mb-4">
              We've sent a 6-digit verification code to
            </p>
            <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">{email}</span>
            </div>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg text-center text-xl font-bold focus:border-blue-500 focus:outline-none transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className={`w-full bg-gradient-to-r ${getRoleColor()} text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Verify Account
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resending || countdown > 0}
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending
                ? "Sending..."
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend Code"}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Verification
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your spam/junk folder if you don't see the email</li>
              <li>• The code expires in 10 minutes for security</li>
              <li>• You can request a new code if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
