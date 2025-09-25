const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

// Helper middleware: promote to mentor automatically in dev if enabled
async function ensureMentor(req, res, next) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }
    if (
      req.user.role !== "mentor" &&
      process.env.AUTO_PROMOTE_MENTOR === "true"
    ) {
      if (process.env.DEBUG_AUTH === "true") {
        console.log(
          "[mentors] Auto-promoting user",
          req.user._id.toString(),
          "-> mentor"
        );
      }
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
    console.error("ensureMentor error", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Utility to build mentor response
function buildMentorResponse(user) {
  const profile = user.mentorProfile || {};
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: profile.title || "Mentor",
    yearsExperience: profile.yearsExperience || 0,
    expertise: profile.expertise || [],
    bio: profile.bio || "",
    rating: profile.rating || 0,
    avatar: profile.avatar || profile.photoUrl || "",
    domains: profile.domains || [],
    availability: profile.availability || [],
    profileCompleted: Boolean(profile.profileCompleted),
  };
}

// GET /api/mentors/profile
router.get(
  "/profile",
  authenticateToken,
  (req, res, next) => {
    if (process.env.DEBUG_AUTH === "true") {
      console.log(
        "[mentors/profile] user?",
        req.user && { id: req.user._id.toString(), role: req.user.role }
      );
    }
    next();
  },
  ensureMentor,
  async (req, res) => {
    try {
      return res.json(buildMentorResponse(req.user));
    } catch (err) {
      console.error("Error fetching mentor profile:", err);
      res
        .status(500)
        .json({ message: "Error fetching mentor profile", error: err.message });
    }
  }
);

// PUT /api/mentors/profile
router.put("/profile", authenticateToken, ensureMentor, async (req, res) => {
  try {
    const user = req.user;
    user.mentorProfile = {
      ...user.mentorProfile,
      ...req.body,
      profileCompleted: true,
    };
    await user.save();
    return res.json({
      success: true,
      message: "Profile updated successfully",
      mentor: buildMentorResponse(user),
    });
  } catch (err) {
    console.error("Error updating mentor profile:", err);
    res
      .status(500)
      .json({ message: "Error updating mentor profile", error: err.message });
  }
});

// GET /api/mentors/students (placeholder)
router.get("/students", authenticateToken, ensureMentor, async (req, res) => {
  try {
    res.json([]); // placeholder
  } catch (err) {
    console.error("Error fetching mentor students:", err);
    res
      .status(500)
      .json({ message: "Error fetching students", error: err.message });
  }
});

// GET /api/mentors/stats (placeholder)
router.get("/stats", authenticateToken, ensureMentor, async (req, res) => {
  try {
    const stats = {
      totalStudents: 0,
      rating: 0,
      yearsExperience: 0,
      domains: [],
      stats: [
        { label: "Total Students", value: 0, change: "+0 this month" },
        { label: "Sessions Completed", value: 0, change: "+0 this month" },
        { label: "Average Rating", value: "0.0", change: "0.0 this month" },
        { label: "Response Time", value: "0h", change: "0h improvement" },
      ],
    };
    res.json(stats);
  } catch (err) {
    console.error("Error fetching mentor stats:", err);
    res
      .status(500)
      .json({ message: "Error fetching mentor stats", error: err.message });
  }
});

// PUT /api/mentors/availability
router.put(
  "/availability",
  authenticateToken,
  ensureMentor,
  async (req, res) => {
    try {
      const user = req.user;
      user.mentorProfile = {
        ...user.mentorProfile,
        available: req.body.available,
      };
      await user.save();
      res.json({
        success: true,
        message: "Availability updated successfully",
        available: user.mentorProfile.available,
      });
    } catch (err) {
      console.error("Error updating availability:", err);
      res
        .status(500)
        .json({ message: "Error updating availability", error: err.message });
    }
  }
);

module.exports = router;
