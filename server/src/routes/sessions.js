const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

// Dev helper to mirror mentors.js auto-promotion if desired
async function ensureMentor(req, res, next) {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    if (
      req.user.role !== "mentor" &&
      process.env.AUTO_PROMOTE_MENTOR === "true"
    ) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.role = "mentor";
        user.mentorProfile = user.mentorProfile || {};
        await user.save();
        req.user = user;
      }
    }
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access forbidden. Insufficient permissions.",
        });
    }
    next();
  } catch (err) {
    console.error("ensureMentor (sessions) error", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// GET /api/sessions/mentor (placeholder)
router.get("/mentor", authenticateToken, ensureMentor, async (req, res) => {
  try {
    res.json([]); // placeholder list
  } catch (err) {
    console.error("Error fetching mentor sessions:", err);
    res
      .status(500)
      .json({ message: "Error fetching sessions", error: err.message });
  }
});

// GET /api/sessions/pending (placeholder)
router.get("/pending", authenticateToken, ensureMentor, async (req, res) => {
  try {
    res.json([]); // placeholder
  } catch (err) {
    console.error("Error fetching pending sessions:", err);
    res
      .status(500)
      .json({ message: "Error fetching pending sessions", error: err.message });
  }
});

// POST /api/sessions (skeleton - not fully implemented)
router.post("/", authenticateToken, ensureMentor, async (req, res) => {
  try {
    // Intentionally minimal until real scheduling is implemented
    return res
      .status(501)
      .json({
        success: false,
        message: "Session creation not implemented yet",
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating session", error: err.message });
  }
});

module.exports = router;
