const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Mentor = require("../models/Mentor");

/**
 * Authentication middleware to verify JWT tokens
 * Adds userId to req object if token is valid
 */
const authenticateToken = async (req, res, next) => {
  try {
    // If using Passport session, trust req.isAuthenticated()
    if (typeof req.isAuthenticated === 'function' && req.isAuthenticated() && req.user) {
      req.userId = req.user._id;
      return next();
    }

    // Otherwise expect a JWT in Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (process.env.DEBUG_AUTH === "true") {
      console.log(
        "[auth] Incoming",
        req.method,
        req.path,
        "authHeader=",
        authHeader
      );
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-super-secret-jwt-key"
    );

    if (process.env.DEBUG_AUTH === "true") {
      console.log("[auth] decoded token userId=", decoded.userId);
    }

    // Try to find user in User model first (email/password auth)
    let user = await User.findById(decoded.userId);
    
    // If not found in User model, try Student model (OAuth)
    if (!user) {
      const student = await Student.findById(decoded.userId);
      if (student) {
        // Create a user-like object for compatibility
        user = {
          _id: student._id,
          email: student.email,
          name: student.displayName,
          role: "student",
          isActive: true,
          isVerified: true,
          studentProfile: student,
        };
      }
    }
    
    // If still not found, try Mentor model (OAuth)
    if (!user) {
      const mentor = await Mentor.findById(decoded.userId);
      if (mentor) {
        // Create a user-like object for compatibility
        user = {
          _id: mentor._id,
          email: mentor.email,
          name: mentor.name,
          role: "mentor",
          isActive: mentor.status === "active",
          isVerified: true,
          mentorProfile: mentor,
        };
      }
    }
    
    // If still not found, try User model with recruiter role
    if (!user) {
      const recruiter = await User.findById(decoded.userId).where('role').equals('recruiter');
      if (recruiter) {
        user = recruiter;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email address",
      });
    }

    // Add user info to request object
    req.userId = user._id;
    req.user = user;

    if (process.env.DEBUG_AUTH === "true") {
      console.log("[auth] Authenticated user", {
        id: user._id.toString(),
        role: user.role,
      });
    }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    if (process.env.DEBUG_AUTH === "true") {
      console.error("Auth middleware error:", error.message);
    }
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

/**
 * Authorization middleware to check user roles
 * @param {string[]} roles - Array of allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Insufficient permissions.",
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Adds user info if token is provided and valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-super-secret-jwt-key"
    );
    const user = await User.findById(decoded.userId);

    if (user && user.isActive && user.isVerified) {
      req.userId = user._id;
      req.user = user;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth,
};
