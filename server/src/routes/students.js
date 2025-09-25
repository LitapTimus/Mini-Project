const express = require("express");
const User = require("../models/User");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// GET /api/students/profile - Get current student's profile
router.get(
  "/profile",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      // Get student profile using the user ID from JWT token
      const student = req.user.studentProfile;

      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      res.json(student);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// POST /api/students/profile - Create or update student profile
router.post(
  "/profile",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      // Get profile data from request body
      const profileData = req.body;

      // Update the user's student profile
      const user = req.user;

      user.studentProfile = {
        ...user.studentProfile,
        ...profileData,
        profileCompleted: true,
      };

      await user.save();

      res.json({
        success: true,
        message: "Profile saved successfully",
        student: user.studentProfile,
      });
    } catch (error) {
      console.error("Error saving student profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

// PUT /api/students/profile - Update specific fields
router.put(
  "/profile",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const user = req.user;

      // Update only the provided fields
      user.studentProfile = {
        ...user.studentProfile,
        ...req.body,
      };

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        student: user.studentProfile,
      });
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// DELETE /api/students/profile - Delete student profile
router.delete(
  "/profile",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const user = req.user;

      // Reset the student profile
      user.studentProfile = {
        profileCompleted: false,
      };

      await user.save();

      res.json({
        success: true,
        message: "Profile deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting student profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// GET /api/students/search - Search students (for mentors/recruiters)
router.get(
  "/search",
  authenticateToken,
  authorizeRoles("mentor", "recruiter"),
  async (req, res) => {
    try {
      const {
        skills,
        interests,
        education,
        location,
        limit = 20,
        page = 1,
      } = req.query;

      let query = {
        role: "student",
        "studentProfile.profileCompleted": true,
      };

      // Build search query
      if (skills) {
        query["studentProfile.technicalSkills"] = {
          $in: skills.split(",").map((s) => s.trim()),
        };
      }

      if (interests) {
        query["studentProfile.interests"] = {
          $in: interests.split(",").map((i) => i.trim()),
        };
      }

      if (education) {
        query["studentProfile.currentEducation"] = education;
      }

      if (location) {
        query["studentProfile.location"] = { $regex: location, $options: "i" };
      }

      const students = await User.find(query)
        .select(
          "name email studentProfile.firstName studentProfile.lastName studentProfile.technicalSkills studentProfile.interests studentProfile.currentEducation studentProfile.institution studentProfile.location studentProfile.aboutMe"
        )
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        students,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: parseInt(page) * parseInt(limit) < total,
          hasPrev: parseInt(page) > 1,
        },
      });
    } catch (error) {
      console.error("Error searching students:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// GET /api/students/:id - Get public student profile (for mentors/recruiters)
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("mentor", "recruiter"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("name studentProfile -_id")
        .where("role")
        .equals("student");

      if (!user || !user.studentProfile) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json({
        name: user.name,
        profile: user.studentProfile,
      });
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
