const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password required only if not Google OAuth user
      },
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "mentor", "recruiter"],
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values while keeping unique constraint
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: function () {
        return !!this.googleId; // Auto-verify Google OAuth users
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    // Role-specific fields
    studentProfile: {
      // Personal Information
      firstName: String,
      lastName: String,
      phone: String,
      dateOfBirth: Date,
      location: String,

      // Education
      currentEducation: String,
      institution: String,
      fieldOfStudy: String,
      graduationYear: Number,
      gpa: String,

      // Skills & Interests
      technicalSkills: [String],
      softSkills: [String],
      interests: [String],
      languages: [String],

      // Career Goals
      careerInterests: [String],
      preferredIndustries: [String],
      salaryExpectation: String,
      workPreferences: [String],

      // Experience
      internships: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          link: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: Date,
          link: String,
        },
      ],

      // Additional Info
      aboutMe: String,
      linkedinProfile: String,
      githubProfile: String,
      portfolio: String,
      profileCompleted: {
        type: Boolean,
        default: false,
      },
    },
    mentorProfile: {
      // Professional Information
      firstName: String,
      lastName: String,
      phone: String,
      location: String,
      title: String,
      company: String,
      position: String,
      yearsOfExperience: Number,

      // Expertise & Skills
      expertise: [String],
      technicalSkills: [String],
      industries: [String],

      // Mentoring Info
      bio: String,
      mentoringSince: Date,
      totalStudents: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      hourlyRate: Number,
      availability: String, // e.g., "weekends", "evenings", "flexible"

      // Social Links
      linkedinProfile: String,
      portfolioWebsite: String,

      // Settings
      isAvailable: { type: Boolean, default: true },
      profileCompleted: { type: Boolean, default: false },
    },
    recruiterProfile: {
      company: String,
      position: String,
      companySize: String,
      industry: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance

userSchema.index({ role: 1 });


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate user profile based on role
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    isVerified: user.isVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    ...(user.role === "student" && { studentProfile: user.studentProfile }),
    ...(user.role === "mentor" && { mentorProfile: user.mentorProfile }),
    ...(user.role === "recruiter" && {
      recruiterProfile: user.recruiterProfile,
    }),
  };
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to create user with role-specific profile
userSchema.statics.createUserWithProfile = function (userData) {
  const user = new this(userData);

  // Initialize role-specific profile
  switch (userData.role) {
    case "student":
      user.studentProfile = userData.studentProfile || {};
      break;
    case "mentor":
      user.mentorProfile = userData.mentorProfile || {};
      break;
    case "recruiter":
      user.recruiterProfile = userData.recruiterProfile || {};
      break;
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
