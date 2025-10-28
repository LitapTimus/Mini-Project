const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');

// Sample test route
router.get('/test', (req, res) => {
    res.json({ message: 'API route working!' });
});

// Public endpoint to get ALL jobs (for students to view)
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find({}).sort({ postedAt: -1 }).lean();
        return res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return res.status(500).json({ message: 'Failed to fetch jobs' });
    }
});

// Get company profile by recruiterId (public)
router.get('/companies/:recruiterId', async (req, res) => {
    try {
        const company = await Company.findOne({ recruiterId: req.params.recruiterId }).lean();
        return res.json(company || {});
    } catch (error) {
        console.error('Error fetching company:', error);
        return res.status(500).json({ message: 'Failed to fetch company' });
    }
});

module.exports = router;
