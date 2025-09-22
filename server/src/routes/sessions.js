const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};

// Specific role checks
const requireMentor = (req, res, next) => {
    if (!req.user || req.user.role !== 'mentor') {
        return res.status(403).json({ message: 'Access denied. Mentor only.' });
    }
    next();
};

const requireStudent = (req, res, next) => {
    if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Student only.' });
    }
    next();
};

// Create a new session
// Mentor creates a new session with a student
router.post('/', isAuthenticated, requireMentor, async (req, res) => {
    try {
        const scheduledTime = new Date(req.body.scheduledTime);
        const endTime = new Date(scheduledTime.getTime() + (req.body.duration * 60000));

        // Check for schedule conflicts
        const conflictingSession = await Session.findOne({
            mentor: req.user.id,
            status: 'scheduled',
            $or: [
                {
                    scheduledTime: {
                        $gte: scheduledTime,
                        $lt: endTime
                    }
                },
                {
                    endTime: {
                        $gt: scheduledTime,
                        $lte: endTime
                    }
                }
            ]
        });

        if (conflictingSession) {
            return res.status(409).json({ 
                message: 'Schedule conflict with another session',
                conflictingSession
            });
        }

        // Load student doc for snapshot
        const Student = require('../models/Student');
        const studentDoc = await Student.findById(req.body.studentId).select('firstName lastName email');
        const mentorDoc = await Mentor.findById(req.user.id).select('name email title avatar');

        const session = new Session({
            mentor: req.user.id,
            student: req.body.studentId,
            scheduledTime,
            endTime,
            duration: req.body.duration,
            topic: req.body.topic,
            type: req.body.type,
            description: req.body.description,
            status: 'scheduled',
            mentorSnapshot: mentorDoc ? {
                id: mentorDoc._id,
                name: mentorDoc.name,
                email: mentorDoc.email,
                title: mentorDoc.title,
                avatar: mentorDoc.avatar
            } : undefined,
            studentSnapshot: studentDoc ? {
                id: studentDoc._id,
                name: `${studentDoc.firstName || ''} ${studentDoc.lastName || ''}`.trim(),
                email: studentDoc.email
            } : undefined
        });

        await session.save();

        // Update mentor's sessions
        await Mentor.findByIdAndUpdate(req.user.id, {
            $push: { sessions: session._id }
        });

        await session.populate('student', 'name avatar email');
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
});

// Get upcoming sessions for a mentor
router.get('/mentor', isAuthenticated, requireMentor, async (req, res) => {
    try {
        const sessions = await Session.find({
            mentor: req.user.id,
            scheduledTime: { $gt: new Date() },
            status: 'scheduled'
        })
        .populate('student', 'name avatar')
        .sort({ scheduledTime: 1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error: error.message });
    }
});

// Pending sessions for a mentor
router.get('/pending', isAuthenticated, requireMentor, async (req, res) => {
    try {
        const sessions = await Session.find({
            mentor: req.user.id,
            status: 'pending'
        })
        .populate('student', 'name avatar')
        .sort({ scheduledTime: 1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending sessions', error: error.message });
    }
});

// Get session by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('mentor', 'name avatar')
            .populate('student', 'name avatar');

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching session', error: error.message });
    }
});

// Update session status
router.put('/:id/status', isAuthenticated, requireMentor, async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { $set: { status: req.body.status } },
            { new: true }
        );

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error updating session', error: error.message });
    }
});

// Add feedback to session
router.post('/:id/feedback', isAuthenticated, requireMentor, async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    feedback: {
                        rating: req.body.rating,
                        comment: req.body.comment
                    }
                }
            },
            { new: true }
        );

        // Update mentor's average rating
        const mentorSessions = await Session.find({ mentor: session.mentor });
        const totalRating = mentorSessions.reduce((sum, s) => {
            return sum + (s.feedback ? s.feedback.rating : 0);
        }, 0);
        const avgRating = totalRating / mentorSessions.length;

        await Mentor.findByIdAndUpdate(session.mentor, {
            $set: { rating: avgRating }
        });

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error adding feedback', error: error.message });
    }
});

module.exports = router;

// Student: list own sessions
router.get('/student/me', isAuthenticated, requireStudent, async (req, res) => {
    try {
        const sessions = await Session.find({ student: req.user.id })
            .populate('mentor', 'name avatar')
            .sort({ scheduledTime: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student sessions', error: error.message });
    }
});

// Student-initiated session creation
// POST /api/sessions/student
// Body: { mentorId, scheduledTime, duration, type, topic, description }
router.post('/student', isAuthenticated, requireStudent, async (req, res) => {
    try {
        const scheduledTime = new Date(req.body.scheduledTime);
        const endTime = new Date(scheduledTime.getTime() + (req.body.duration * 60000));

        // Check for mentor schedule conflicts
        const conflictingSession = await Session.findOne({
            mentor: req.body.mentorId,
            status: 'scheduled',
            $or: [
                { scheduledTime: { $gte: scheduledTime, $lt: endTime } },
                { endTime: { $gt: scheduledTime, $lte: endTime } }
            ]
        });

        if (conflictingSession) {
            return res.status(409).json({
                message: 'Mentor has a conflicting session',
                conflictingSession
            });
        }

        const Student = require('../models/Student');
        const MentorModel = require('../models/Mentor');
        const studentDoc = await Student.findById(req.user.id).select('firstName lastName email');
        const mentorDoc = await MentorModel.findById(req.body.mentorId).select('name email title avatar');

        const session = new Session({
            mentor: req.body.mentorId,
            student: req.user.id,
            scheduledTime,
            endTime,
            duration: req.body.duration,
            topic: req.body.topic,
            type: req.body.type,
            description: req.body.description,
            status: 'pending',
            mentorSnapshot: mentorDoc ? {
                id: mentorDoc._id,
                name: mentorDoc.name,
                email: mentorDoc.email,
                title: mentorDoc.title,
                avatar: mentorDoc.avatar
            } : undefined,
            studentSnapshot: studentDoc ? {
                id: studentDoc._id,
                name: `${studentDoc.firstName || ''} ${studentDoc.lastName || ''}`.trim(),
                email: studentDoc.email
            } : undefined
        });

        await session.save();

        await session.populate('mentor', 'name avatar');
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
});