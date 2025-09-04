const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// GET /api/students/profile - Get current student's profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOne({ googleId: req.user.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/students/profile - Create or update student profile
router.post('/profile', isAuthenticated, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      location,
      currentEducation,
      institution,
      fieldOfStudy,
      graduationYear,
      gpa,
      technicalSkills,
      softSkills,
      interests,
      languages,
      careerInterests,
      preferredIndustries,
      salaryExpectation,
      workPreferences,
      aboutMe,
      linkedinProfile,
      githubProfile,
      portfolio
    } = req.body;

    // Check if student profile already exists
    let student = await Student.findOne({ googleId: req.user.id });
    
    if (student) {
      // Update existing profile
      student.firstName = firstName;
      student.lastName = lastName;
      student.phone = phone;
      student.dateOfBirth = dateOfBirth;
      student.location = location;
      student.currentEducation = currentEducation;
      student.institution = institution;
      student.fieldOfStudy = fieldOfStudy;
      student.graduationYear = graduationYear;
      student.gpa = gpa;
      student.technicalSkills = technicalSkills;
      student.softSkills = softSkills;
      student.interests = interests;
      student.languages = languages;
      student.careerInterests = careerInterests;
      student.preferredIndustries = preferredIndustries;
      student.salaryExpectation = salaryExpectation;
      student.workPreferences = workPreferences;
      student.aboutMe = aboutMe;
      student.linkedinProfile = linkedinProfile;
      student.githubProfile = githubProfile;
      student.portfolio = portfolio;
      student.profileCompleted = true;
    } else {
      // Create new profile
      student = new Student({
        googleId: req.user.id,
        email: req.user.emails[0].value,
        displayName: req.user.displayName,
        firstName,
        lastName,
        phone,
        dateOfBirth,
        location,
        currentEducation,
        institution,
        fieldOfStudy,
        graduationYear,
        gpa,
        technicalSkills,
        softSkills,
        interests,
        languages,
        careerInterests,
        preferredIndustries,
        salaryExpectation,
        workPreferences,
        aboutMe,
        linkedinProfile,
        githubProfile,
        portfolio,
        profileCompleted: true
      });
    }

    await student.save();
    
    res.status(201).json({
      message: 'Profile saved successfully',
      student,
      profileCompletion: student.profileCompletion
    });
    
  } catch (error) {
    console.error('Error saving student profile:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/students/profile - Update specific fields
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOne({ googleId: req.user.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Update only the fields that are provided
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        student[key] = req.body[key];
      }
    });
    
    student.updatedAt = Date.now();
    await student.save();
    
    res.json({
      message: 'Profile updated successfully',
      student,
      profileCompletion: student.profileCompletion
    });
    
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/students/profile - Delete student profile
router.delete('/profile', isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ googleId: req.user.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.json({ message: 'Profile deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/students/search - Search students (for mentors/recruiters)
router.get('/search', isAuthenticated, async (req, res) => {
  try {
    const { 
      skills, 
      interests, 
      education, 
      location,
      limit = 20,
      page = 1
    } = req.query;
    
    let query = { profileCompleted: true };
    
    // Build search query
    if (skills) {
      query.technicalSkills = { $in: skills.split(',').map(s => s.trim()) };
    }
    
    if (interests) {
      query.interests = { $in: interests.split(',').map(i => i.trim()) };
    }
    
    if (education) {
      query.currentEducation = education;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    const students = await Student.find(query)
      .select('firstName lastName technicalSkills interests currentEducation institution location aboutMe')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Student.countDocuments(query);
    
    res.json({
      students,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: parseInt(page) * parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/students/:id - Get public student profile (for mentors/recruiters)
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-googleId -email -phone -dateOfBirth');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
    
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
