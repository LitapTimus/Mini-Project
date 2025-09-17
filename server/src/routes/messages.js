const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!req.user || !req.user.role || req.user.role !== 'mentor') {
        return res.status(403).json({ message: 'Access denied. Mentor only.' });
    }
    next();
};

// Send a new message
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const message = new Message({
            sender: req.user.id,
            senderModel: req.user.role === 'mentor' ? 'Mentor' : 'Student',
            receiver: req.body.receiverId,
            receiverModel: req.user.role === 'mentor' ? 'Student' : 'Mentor',
            content: req.body.content,
            timestamp: new Date()
        });

        await message.save();
        await message.populate('sender', 'name avatar email');
        await message.populate('receiver', 'name avatar email');

        // Emit the message through Socket.IO
        req.app.get('io').to(req.body.receiverId).emit('message', message);
        
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
});

// Get conversation between mentor and student
router.get('/conversation/:userId', isAuthenticated, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        })
        .sort({ createdAt: -1 })
        .limit(50);

        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
});

// Get unread messages count
router.get('/unread', isAuthenticated, async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user.id,
            read: false
        });

        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Error counting unread messages', error: error.message });
    }
});

// Mark message as read
router.put('/:id/read', isAuthenticated, async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { $set: { read: true } },
            { new: true }
        );

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error marking message as read', error: error.message });
    }
});

// Get recent messages
router.get('/recent', isAuthenticated, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent messages', error: error.message });
    }
});

module.exports = router;