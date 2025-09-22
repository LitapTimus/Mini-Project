require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const routes = require('./routes/index');
const studentRoutes = require('./routes/students');
const mentorRoutes = require('./routes/mentors');
const assessmentRoutes = require('./routes/assessments');
const Message = require('./models/Message');


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

// Make io available to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('sendMessage', async (data) => {
        try {
            const { content, senderId, receiverId } = data;
            
            // Save message to database
            const message = new Message({
                content,
                sender: senderId,
                receiver: receiverId,
                timestamp: new Date()
            });
            await message.save();

            // Emit to both sender and receiver
            io.to(receiverId).to(senderId).emit('message', {
                _id: message._id,
                content,
                senderId,
                receiverId,
                timestamp: message.timestamp
            });
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-compass')
.then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Import Mentor model
    const Mentor = require('./models/Mentor');
    
    try {
        // Check if test mentor exists
        const testMentor = await Mentor.findOne({ email: 'test@example.com' });
        
        if (!testMentor) {
            // Create a test mentor
            const newMentor = new Mentor({
                name: 'Test Mentor',
                email: 'test@example.com',
                googleId: 'test123',
                title: 'Senior Software Engineer',
                avatar: 'https://ui-avatars.com/api/?name=Test+Mentor',
                yearsExperience: 5,
                expertise: ['JavaScript', 'React', 'Node.js'],
                company: 'Tech Corp',
                position: 'Senior Developer',
                bio: 'Test mentor bio',
                status: 'active',
                domains: [
                    {
                        domain: 'Web Development',
                        students: 5,
                        avgScore: 4.5
                    }
                ]
            });
            
            await newMentor.save();
            console.log('✅ Test mentor created successfully');
        }
    } catch (err) {
        console.error('❌ Error creating test mentor:', err);
    }
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// CORS middleware (must come before routes)
const cors = require('cors');
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        secure: false // true in production with HTTPS
    }
}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
const Mentor = require('./models/Mentor');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if mentor exists
        let mentor = await Mentor.findOne({ googleId: profile.id });
        
        if (!mentor) {
            // Create new mentor
            mentor = new Mentor({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
                title: "New Mentor",
                yearsExperience: 0,
                expertise: ["General Mentoring"],
                status: 'active'
            });
            await mentor.save();
        }

        // Return simplified user object
        return done(null, {
            _id: mentor._id,
            role: 'mentor',
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            mentorData: mentor
        });
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    // Store the Google ID and role
    done(null, {
        googleId: user.googleId || user.id,
        role: user.role || 'mentor'
    });
});

passport.deserializeUser(async (serialized, done) => {
    try {
        // Fetch fresh mentor data using Google ID
        const mentor = await Mentor.findOne({ googleId: serialized.googleId });
        if (!mentor) {
            return done(null, false);
        }

        // Create full user object with mentor role
        const user = {
            id: mentor._id,
            googleId: mentor.googleId,
            role: serialized.role,
            email: mentor.email,
            name: mentor.name,
            mentorData: mentor
        };
        
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('<h2>Welcome to Career Compass</h2><a href="/auth/google">Login with Google</a>');
});

// Google OAuth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            // Check if user exists as a mentor
            const existingMentor = await Mentor.findById(req.user._id);
            
            if (existingMentor) {
                // Update user role
                req.user.role = 'mentor';
                req.user.mentorData = existingMentor;
            }

            res.redirect(`${CLIENT_URL}/dashboard`);
        } catch (error) {
            console.error('Error in auth callback:', error);
            res.redirect(`${CLIENT_URL}/error`);
        }
    }
);

// Protected profile route
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`
        <h1>Hello, ${req.user.name}</h1>
        <p>Email: ${req.user.email}</p>
        <a href="/logout">Logout</a>
    `);
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(CLIENT_URL);
    });
});

app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

// Allow client to switch role in session (mentor/student)
app.post('/auth/role', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { role } = req.body || {};
    if (!role || !['mentor', 'student'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    // Update role on user object and in session
    req.user.role = role;
    if (req.session && req.session.passport && req.session.passport.user) {
        req.session.passport.user.role = role;
    }
    return res.json({ success: true, role });
});

// Auth debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - isAuthenticated: ${req.isAuthenticated()}`);
    if (req.isAuthenticated()) {
        console.log('User:', {
            id: req.user.id,
            role: req.user.role,
            googleId: req.user.googleId
        });
    }
    next();
});

// Auth middleware for protected routes
const authCheck = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    if (req.user.role !== 'mentor') {
        return res.status(403).json({ message: 'Not authorized as mentor' });
    }
    next();
};

// API routes
app.use('/api', routes);
app.use('/api/recruiter', require('./routes/recruiter'));
app.use('/api/students', studentRoutes);
app.use('/api/mentors', authCheck, mentorRoutes);
app.use('/api/assessments', assessmentRoutes);
// Sessions and messages should be available to both mentors and students;
// each route file performs its own fine-grained role checks.
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/messages', require('./routes/messages'));


// Start server
http.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('📡 Socket.IO server is running');
});
