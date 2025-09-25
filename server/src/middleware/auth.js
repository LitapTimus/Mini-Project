const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication middleware to verify JWT tokens
 * Adds userId to req object if token is valid
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

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

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
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

    console.error("Auth middleware error:", error);
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
