const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 60
    },
    topic: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'audio', 'chat'],
        default: 'video'
    },
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'completed', 'declined', 'cancelled'],
        default: 'scheduled'
    },
    notes: {
        type: String
    },
    // Snapshots at time of scheduling for easy reads
    mentorSnapshot: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
        name: String,
        email: String,
        title: String,
        avatar: String
    },
    studentSnapshot: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        name: String,
        email: String,
        avatar: String,
        education: String
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
sessionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;