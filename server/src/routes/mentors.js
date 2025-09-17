const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// Middleware to check if user is authenticated as a mentor
const isMentor = (req, res, next) => {
    console.log('Auth check - isAuthenticated:', req.isAuthenticated());
    console.log('Auth check - user:', req.user);
    
    if (!req.isAuthenticated()) {
        return res.status(401).json({ 
            message: 'Not authenticated',
            isAuthenticated: false
        });
    }

    if (!req.user || !req.user.role || req.user.role !== 'mentor') {
        return res.status(403).json({ 
            message: 'Access denied. Mentor only.',
            isAuthenticated: true,
            user: req.user ? { 
                role: req.user.role,
                id: req.user.id 
            } : null
        });
    }

    // User is authenticated and is a mentor
    next();
};

// Get mentor profile
router.get('/profile', isMentor, async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.user.id)
            .populate('students', 'name avatar email')
            .populate('sessions')
            .populate('messages');
        res.json(mentor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentor profile', error: error.message });
    }
});

// Update mentor profile
router.put('/profile', isMentor, async (req, res) => {
    try {
        const update = {
            title: req.body.title,
            expertise: req.body.expertise,
            yearsExperience: req.body.yearsExperience,
            company: req.body.company,
            position: req.body.position,
            bio: req.body.bio,
            available: req.body.available
        };

        if (req.body.name) {
            update.name = req.body.name;
        }

        // Map domains: ["Web Development","Data Science"] => [{ domain: "Web Development" }, ...]
        if (Array.isArray(req.body.domains)) {
            update.domains = req.body.domains
                .filter(Boolean)
                .map(d => ({ domain: d }));
        }

        // When mentor fills basic profile, mark as active
        if (update.title && update.yearsExperience !== undefined && Array.isArray(update.expertise) && update.expertise.length > 0) {
            update.status = 'active';
        }

        const updatedMentor = await Mentor.findByIdAndUpdate(
            req.user.id,
            { $set: update },
            { new: true }
        );
        res.json(updatedMentor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating mentor profile', error: error.message });
    }
});

// Get mentor's students
router.get('/students', isMentor, async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.user.id)
            .populate('students', 'name avatar email education skills interests location profileCompletion lastActive status');
        res.json(mentor.students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentor\'s students', error: error.message });
    }
});

// Get mentor stats
router.get('/stats', isMentor, async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.user.id)
            .populate('students')
            .populate('sessions');

        // Calculate domain statistics
        const domainStats = mentor.domains.map(domain => {
            const studentsInDomain = mentor.students.filter(student => 
                student.interests.includes(domain.domain)
            );
            
            const sessionsInDomain = mentor.sessions.filter(session => 
                session.topic.toLowerCase().includes(domain.domain.toLowerCase())
            );

            const completedSessions = sessionsInDomain.filter(s => s.status === 'completed');
            const avgRating = completedSessions.reduce((sum, s) => 
                sum + (s.feedback ? s.feedback.rating : 0), 0
            ) / (completedSessions.length || 1);

            return {
                name: domain.domain,
                studentCount: studentsInDomain.length,
                sessionCount: sessionsInDomain.length,
                averageScore: avgRating.toFixed(1)
            };
        });

        const stats = {
            totalStudents: mentor.students.length,
            rating: mentor.rating,
            yearsExperience: mentor.yearsExperience,
            domains: domainStats,
            stats: [
                {
                    label: "Total Students",
                    value: mentor.students.length,
                    change: "+0 this month"
                },
                {
                    label: "Active Sessions",
                    value: mentor.sessions.filter(s => s.status === 'scheduled').length,
                    change: "Upcoming"
                },
                {
                    label: "Overall Rating",
                    value: mentor.rating.toFixed(1),
                    change: "From all sessions"
                },
                {
                    label: "Session Hours",
                    value: mentor.sessions.reduce((sum, s) => sum + (s.duration || 60), 0) / 60,
                    change: "Total mentoring time"
                }
            ]
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentor stats', error: error.message });
    }
});

// Update mentor availability
router.put('/availability', isMentor, async (req, res) => {
    try {
        const mentor = await Mentor.findByIdAndUpdate(
            req.user.id,
            { $set: { available: req.body.available } },
            { new: true }
        );
        res.json({ available: mentor.available });
    } catch (error) {
        res.status(500).json({ message: 'Error updating availability', error: error.message });
    }
});

// Get all mentors (public route)
router.get('/', async (req, res) => {
    try {
        const { domain } = req.query;
        const query = { status: 'active' };
        if (domain) {
            query.$or = [
                { expertise: { $in: [domain] } },
                { 'domains.domain': domain }
            ];
        }
        const mentors = await Mentor.find(query)
            .select('name title expertise rating totalStudents yearsExperience avatar available domains');
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentors', error: error.message });
    }
});

// Get specific mentor by ID (public route)
router.get('/:id', async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.id)
            .select('-googleId -email');
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }
        res.json(mentor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentor', error: error.message });
    }
});

module.exports = router;