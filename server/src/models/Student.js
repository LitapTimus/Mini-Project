const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // User authentication info (from OAuth)
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  
  // Personal Information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: String,
  dateOfBirth: Date,
  location: String,
  
  // Education
  currentEducation: {
    type: String,
    required: true,
    enum: ['high-school', 'bachelors', 'masters', 'phd', 'diploma', 'certification', 'other']
  },
  institution: String,
  fieldOfStudy: String,
  graduationYear: Number,
  gpa: {
    type: Number,
    min: 0,
    max: 4
  },
  
  // Skills & Interests
  technicalSkills: [String],
  softSkills: [String],
  interests: [String],
  languages: [String],
  
  // Career Goals
  careerInterests: [String],
  preferredIndustries: [String],
  salaryExpectation: {
    type: String,
    enum: ['30k-50k', '50k-70k', '70k-90k', '90k-110k', '110k+']
  },
  workPreferences: [String],
  
  // Experience
  internships: [{
    title: String,
    company: String,
    duration: String,
    description: String,
    startDate: Date,
    endDate: Date
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    startDate: Date,
    endDate: Date
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialUrl: String
  }],
  
  // Additional Info
  aboutMe: String,
  linkedinProfile: String,
  githubProfile: String,
  portfolio: String,
  
  // Profile completion status
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for profile completion percentage
studentSchema.virtual('profileCompletion').get(function() {
  const requiredFields = ['firstName', 'lastName', 'email', 'currentEducation'];
  const optionalFields = ['institution', 'fieldOfStudy', 'technicalSkills', 'careerInterests', 'aboutMe'];
  
  let completed = 0;
  let total = requiredFields.length + optionalFields.length;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (this[field]) completed++;
  });
  
  // Check optional fields
  optionalFields.forEach(field => {
    if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : true)) {
      completed++;
    }
  });
  
  return Math.round((completed / total) * 100);
});

module.exports = mongoose.model('Student', studentSchema);
