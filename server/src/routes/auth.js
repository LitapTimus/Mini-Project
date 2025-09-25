const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const OTP = require("../models/OTP");
const emailService = require("../services/emailService");
const router = express.Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 OTP requests per windowMs
  message: {
    error: "Too many OTP requests, please try again later.",
  },
});

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your-super-secret-jwt-key",
    { expiresIn: "7d" }
  );
};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user and send OTP
 * @access  Public
 */
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Input validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!["student", "mentor", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists",
        });
      } else {
        // User exists but not verified - resend OTP
        const otp = await OTP.createOTP(email, "email_verification");
        await emailService.sendVerificationOTP(email, otp, name);

        return res.status(200).json({
          success: true,
          message:
            "Account exists but not verified. New OTP sent to your email.",
          requiresVerification: true,
        });
      }
    }

    // Create new user (not verified initially)
    const newUser = User.createUserWithProfile({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      isVerified: false,
    });

    await newUser.save();

    // Generate and send OTP
    const otp = await OTP.createOTP(email, "email_verification");
    const emailResult = await emailService.sendVerificationOTP(
      email,
      otp,
      name
    );

    if (!emailResult.success) {
      // If email fails, delete the created user
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Account created successfully! Please check your email for verification code.",
      requiresVerification: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during registration",
    });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and activate user account
 * @access  Public
 */
router.post("/verify-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp, type = "email_verification" } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Verify OTP
    const verificationResult = await OTP.verifyOTP(email, otp, type);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
      });
    }

    // Find user and mark as verified
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name, user.role);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to CareerCompass!",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during verification",
    });
  }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP to user's email
 * @access  Public
 */
router.post("/resend-otp", otpLimiter, async (req, res) => {
  try {
    const { email, type = "email_verification" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    if (user.isVerified && type === "email_verification") {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    // Generate and send new OTP
    const otp = await OTP.createOTP(email, type);

    let emailResult;
    if (type === "email_verification") {
      emailResult = await emailService.sendVerificationOTP(
        email,
        otp,
        user.name
      );
    } else if (type === "password_reset") {
      emailResult = await emailService.sendPasswordResetOTP(
        email,
        otp,
        user.name
      );
    }

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email address",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while sending OTP",
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email and password
 * @access  Public
 */
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email address before logging in",
        requiresVerification: true,
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during login",
    });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset OTP to user's email
 * @access  Public
 */
router.post("/forgot-password", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message:
          "If an account with this email exists, you will receive a password reset code.",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email address first",
      });
    }

    // Generate and send password reset OTP
    const otp = await OTP.createOTP(email, "password_reset");
    const emailResult = await emailService.sendPasswordResetOTP(
      email,
      otp,
      user.name
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset code. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email address",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using OTP
 * @access  Public
 */
router.post("/reset-password", authLimiter, async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // Input validation
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Verify OTP
    const verificationResult = await OTP.verifyOTP(
      email,
      otp,
      "password_reset"
    );
    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
      });
    }

    // Find user and update password
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred during password reset",
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", async (req, res) => {
  try {
    // This route will be protected by auth middleware
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Public
 */
router.post("/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
