const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["email_verification", "password_reset"],
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5, // Maximum 5 attempts
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic cleanup of expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for better query performance
otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ email: 1, otp: 1, type: 1 });

// Generate a 6-digit OTP
otpSchema.statics.generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create new OTP and remove old ones
otpSchema.statics.createOTP = async function (email, type) {
  // Remove any existing OTPs for this email and type
  await this.deleteMany({ email: email.toLowerCase(), type });

  // Generate new OTP
  const otp = this.generateOTP();

  // Create new OTP document
  const otpDoc = new this({
    email: email.toLowerCase(),
    otp,
    type,
  });

  await otpDoc.save();
  return otp;
};

// Verify OTP
otpSchema.statics.verifyOTP = async function (email, otp, type) {
  const otpDoc = await this.findOne({
    email: email.toLowerCase(),
    type,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    return { success: false, message: "OTP not found or expired" };
  }

  // Check if too many attempts
  if (otpDoc.attempts >= 5) {
    return {
      success: false,
      message: "Too many failed attempts. Please request a new OTP.",
    };
  }

  // Increment attempts
  otpDoc.attempts += 1;
  await otpDoc.save();

  // Verify OTP
  if (otpDoc.otp !== otp) {
    return { success: false, message: "Invalid OTP" };
  }

  // Mark as verified and save
  otpDoc.verified = true;
  await otpDoc.save();

  return { success: true, message: "OTP verified successfully" };
};

// Check if OTP exists and is still valid
otpSchema.statics.isValidOTP = async function (email, type) {
  const otpDoc = await this.findOne({
    email: email.toLowerCase(),
    type,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  return !!otpDoc;
};

// Clean up expired OTPs (manual cleanup method)
otpSchema.statics.cleanupExpired = async function () {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount;
};

module.exports = mongoose.model("OTP", otpSchema);
