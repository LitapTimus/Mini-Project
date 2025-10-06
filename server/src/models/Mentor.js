const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    yearsExperience: {
        type: Number,
        required: true
    },
    expertise: [{
        type: String,
        required: true
    }],
    company: {
        type: String
    },
    position: {
        type: String
    },
    bio: {
        type: String
    },
    availability: {
        schedule: [{
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            slots: [{
                startTime: String,
                endTime: String,
                isBooked: {
                    type: Boolean,
                    default: false
                }
            }]
        }],
        timezone: {
            type: String,
            default: 'UTC'
        }
    },
    available: {
        type: Boolean,
        default: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    domains: [{
        domain: {
            type: String,
            required: true
        },
        students: {
            type: Number,
            default: 0
        },
        avgScore: {
            type: Number,
            default: 0
        }
    }],
    profileCompleted: {
        type: Boolean,
        default: false
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
mentorSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;