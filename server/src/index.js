require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/index");
const studentRoutes = require("./routes/students");
const mentorRoutes = require("./routes/mentors");
const assessmentRoutes = require("./routes/assessments");
const authRoutes = require("./routes/auth");
const Message = require("./models/Message");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

// Make io available to routes
app.set("io", io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { content, senderId, receiverId } = data;

      // Save message to database
      const message = new Message({
        content,
        sender: senderId,
        receiver: receiverId,
        timestamp: new Date(),
      });
      await message.save();

      // Emit to both sender and receiver
      io.to(receiverId).to(senderId).emit("message", {
        _id: message._id,
        content,
        senderId,
        receiverId,
        timestamp: message.timestamp,
      });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/career-compass",
    {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true
    }
  )
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Import Mentor model
    const Mentor = require("./models/Mentor");

    try {
      // Check if test mentor exists
      const testMentor = await Mentor.findOne({ email: "test@example.com" });

      if (!testMentor) {
        // Create a test mentor
        const newMentor = new Mentor({
          name: "Test Mentor",
          email: "test@example.com",
          googleId: "test123",
          title: "Senior Software Engineer",
          avatar: "https://ui-avatars.com/api/?name=Test+Mentor",
          yearsExperience: 5,
          expertise: ["JavaScript", "React", "Node.js"],
          company: "Tech Corp",
          position: "Senior Developer",
          bio: "Test mentor bio",
          status: "active",
          domains: [
            {
              domain: "Web Development",
              students: 5,
              avgScore: 4.5,
            },
          ],
        });

        await newMentor.save();
        console.log("✅ Test mentor created successfully");
      }
    } catch (err) {
      console.error("❌ Error creating test mentor:", err);
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// CORS middleware (must come before routes)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? undefined : "dev_secret_key"),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
      httpOnly: true
    },
  })
);

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
const Mentor = require("./models/Mentor");
const Student = require("./models/Student");
const User = require("./models/User");

// Google OAuth Strategy for Mentors
passport.use(
  'google-mentor',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/mentor/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if mentor exists
        let mentor = await Mentor.findOne({ googleId: profile.id });

        if (!mentor) {
          // Create new mentor
          mentor = new Mentor({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            title: "New Mentor",
            yearsExperience: 0,
            expertise: ["General Mentoring"],
            status: "active",
          });
          await mentor.save();
        }

        // Return simplified user object
        return done(null, {
          _id: mentor._id,
          role: "mentor",
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          mentorData: mentor,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Google OAuth Strategy for Students
passport.use(
  'google-student',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if student exists
        let student = await Student.findOne({ googleId: profile.id });

        if (!student) {
          // Create new student
          student = new Student({
            googleId: profile.id,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            displayName: profile.displayName,
            firstName: profile.name?.givenName || profile.displayName.split(' ')[0],
            lastName: profile.name?.familyName || profile.displayName.split(' ').slice(1).join(' '),
            currentEducation: 'other', // Default value, student can update later
          });
          await student.save();
        }

        // Return simplified user object
        return done(null, {
          _id: student._id,
          role: "student",
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          studentData: student,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Google OAuth Strategy for Recruiters
passport.use(
  'google-recruiter',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/recruiter/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if recruiter exists
        let recruiter = await User.findOne({ googleId: profile.id, role: "recruiter" });

        if (!recruiter) {
          // Create new recruiter
          recruiter = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            role: "recruiter",
            recruiterProfile: {},
          });
          await recruiter.save();
        }

        // Return simplified user object
        return done(null, {
          _id: recruiter._id,
          role: "recruiter",
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          recruiterData: recruiter,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Store the Google ID and role
  done(null, {
    googleId: user.googleId || user.id,
    role: user.role || "mentor",
  });
});

passport.deserializeUser(async (serialized, done) => {
  try {
    let userData;
    if (serialized.role === "recruiter") {
      // Fetch recruiter data from User model
      userData = await User.findOne({ googleId: serialized.googleId, role: "recruiter" });
      if (!userData) {
        return done(null, false);
      }
      // Create full user object with recruiter role
      const user = {
        id: userData._id,
        googleId: userData.googleId,
        role: serialized.role,
        email: userData.email,
        name: userData.name,
        recruiterData: userData,
      };
      done(null, user);
    } else if (serialized.role === "student") {
      // Fetch student data using Google ID
      const student = await Student.findOne({ googleId: serialized.googleId });
      if (!student) {
        return done(null, false);
      }

      // Create full user object with student role
      const user = {
        id: student._id,
        googleId: student.googleId,
        role: serialized.role,
        email: student.email,
        name: student.displayName,
        studentData: student,
      };

      done(null, user);
    } else {
      // Fetch mentor data using Google ID
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
        mentorData: mentor,
      };

      done(null, user);
    }
  } catch (err) {
    done(err, null);
  }
});

// Home route
app.get("/", (req, res) => {
  res.send(
    '<h2>Welcome to Career Compass</h2><a href="/auth/google">Login with Google</a>'
  );
});

// Google OAuth routes for Mentors
app.get(
  "/auth/google/mentor",
  passport.authenticate("google-mentor", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/mentor/callback",
  passport.authenticate("google-mentor", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      // Check if user exists as a mentor
      const existingMentor = await Mentor.findById(req.user._id);

      if (existingMentor) {
        // Update user role
        req.user.role = "mentor";
        req.user.mentorData = existingMentor;
        
        // Generate JWT token for the user
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET || "your-super-secret-jwt-key",
          { expiresIn: "7d" }
        );
        
        // Prepare user data for client
        const userData = {
          id: existingMentor._id,
          email: existingMentor.email,
          name: existingMentor.name,
          role: "mentor"
        };
        
        // Redirect with token and user data as URL parameters
        const params = new URLSearchParams({
          token: token,
          user: JSON.stringify(userData)
        });
        
        res.redirect(`${CLIENT_URL}/mentor-dashboard?${params.toString()}`);
      } else {
        res.redirect(`${CLIENT_URL}/error`);
      }
    } catch (error) {
      console.error("Error in mentor auth callback:", error);
      res.redirect(`${CLIENT_URL}/error`);
    }
  }
);

app.get(
  "/auth/google/callback",
  (req, res, next) => {
    // Get the intended role from session
    const intendedRole = req.session.intendedRole || "student";
    
    // Use the appropriate strategy based on role
    const strategy = intendedRole === "recruiter" 
      ? "google-recruiter" 
      : (intendedRole === "mentor" ? "google-mentor" : "google-student");
    
    passport.authenticate(strategy, { failureRedirect: "/" })(req, res, next);
  },
  async (req, res) => {
    try {
      // Get the intended role from session
      const intendedRole = req.session.intendedRole || "student";
      let redirectPath = "/";
      let userData = null;
      
      // Handle user based on role
      if (intendedRole === "student") {
        // Check if user exists as a student
        const existingStudent = await Student.findById(req.user._id);
        if (existingStudent) {
          // Update user role
          req.user.role = "student";
          req.user.studentData = existingStudent;
          
          // Prepare user data for client
          userData = {
            id: existingStudent._id,
            email: existingStudent.email,
            displayName: existingStudent.displayName,
            name: existingStudent.displayName,
            role: "student"
          };
          
          // Always redirect to dashboard (onboarding page doesn't exist)
          redirectPath = "/student-dashboard";
        }
      } else if (intendedRole === "mentor") {
        // Check if user exists as a mentor
        const existingMentor = await Mentor.findById(req.user._id);
        if (existingMentor) {
          // Update user role
          req.user.role = "mentor";
          req.user.mentorData = existingMentor;
          
          // Prepare user data for client
          userData = {
            id: existingMentor._id,
            email: existingMentor.email,
            name: existingMentor.name,
            role: "mentor"
          };
          
          redirectPath = "/mentor-dashboard";
        }
      } else if (intendedRole === "recruiter") {
        // Check if user exists as a recruiter
        const existingRecruiter = await User.findById(req.user._id);
        if (existingRecruiter && existingRecruiter.role === "recruiter") {
          // Update user role
          req.user.role = "recruiter";
          req.user.recruiterData = existingRecruiter;
          
          // Prepare user data for client
          userData = {
            id: existingRecruiter._id,
            email: existingRecruiter.email,
            name: existingRecruiter.name,
            role: "recruiter"
          };
          
          redirectPath = "/recruiter-dashboard";
        }
      }
      
      // Clear the intended role from session
      delete req.session.intendedRole;
      
      // Generate JWT token for the user
      const jwt = require("jsonwebtoken");
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET || "your-super-secret-jwt-key",
        { expiresIn: "7d" }
      );
      
      // Redirect with token and user data as URL parameters (will be stored in localStorage by client)
      const params = new URLSearchParams({
        token: token,
        user: JSON.stringify(userData)
      });
      
      res.redirect(`${CLIENT_URL}${redirectPath}?${params.toString()}`);
    } catch (error) {
      console.error("Error in auth callback:", error);
      res.redirect(`${CLIENT_URL}/error`);
    }
  }
);

// Google OAuth routes for Students
app.get(
  "/auth/google/student",
  passport.authenticate("google-student", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/student/callback",
  passport.authenticate("google-student", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      // Check if user exists as a student
      const existingStudent = await Student.findById(req.user._id);

      if (existingStudent) {
        // Update user role
        req.user.role = "student";
        req.user.studentData = existingStudent;
        
        // Generate JWT token for the user
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET || "your-super-secret-jwt-key",
          { expiresIn: "7d" }
        );
        
        // Prepare user data for client
        const userData = {
          id: existingStudent._id,
          email: existingStudent.email,
          displayName: existingStudent.displayName,
          name: existingStudent.displayName,
          role: "student"
        };
        
        // Redirect with token and user data as URL parameters
        const params = new URLSearchParams({
          token: token,
          user: JSON.stringify(userData)
        });
        
        res.redirect(`${CLIENT_URL}/student-dashboard?${params.toString()}`);
      } else {
        res.redirect(`${CLIENT_URL}/error`);
      }
    } catch (error) {
      console.error("Error in student auth callback:", error);
      res.redirect(`${CLIENT_URL}/error`);
    }
  }
);

// Default Google OAuth route - redirects to student login
app.get("/auth/google", (req, res) => {
  // Store the intended role in the session
  req.session.intendedRole = req.query.role || "student";
  
  // Determine which strategy to use based on role
  const strategy = req.session.intendedRole === "recruiter" 
    ? "google-recruiter" 
    : (req.session.intendedRole === "mentor" ? "google-mentor" : "google-student");
  
  passport.authenticate(strategy, {
    scope: ["profile", "email"],
  })(req, res);
});

// Google OAuth routes for Recruiters
app.get(
  "/auth/google/recruiter",
  passport.authenticate("google-recruiter", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/recruiter/callback",
  passport.authenticate("google-recruiter", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      // Check if user exists as a recruiter
      const existingRecruiter = await User.findById(req.user._id);

      if (existingRecruiter) {
        // Update user role
        req.user.role = "recruiter";
        req.user.recruiterData = existingRecruiter;
        
        // Generate JWT token for the user
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET || "your-super-secret-jwt-key",
          { expiresIn: "7d" }
        );
        
        // Prepare user data for client
        const userData = {
          id: existingRecruiter._id,
          email: existingRecruiter.email,
          name: existingRecruiter.name,
          role: "recruiter"
        };
        
        // Redirect with token and user data as URL parameters
        const params = new URLSearchParams({
          token: token,
          user: JSON.stringify(userData)
        });
        
        res.redirect(`${CLIENT_URL}/recruiter-dashboard?${params.toString()}`);
      } else {
        res.redirect(`${CLIENT_URL}/error`);
      }
    } catch (error) {
      console.error("Error in recruiter auth callback:", error);
      res.redirect(`${CLIENT_URL}/error`);
    }
  }
);

// Protected profile route
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`
        <h1>Hello, ${req.user.name}</h1>
        <p>Email: ${req.user.email}</p>
        <a href="/logout">Logout</a>
    `);
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(CLIENT_URL);
  });
});

app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Allow client to switch role in session (mentor/student/recruiter)
app.post("/auth/role", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { role } = req.body || {};
  if (!role || !["mentor", "student", "recruiter"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  // Update role on user object and in session
  req.user.role = role;
  if (req.session && req.session.passport && req.session.passport.user) {
    req.session.passport.user.role = role;
  }
  return res.json({ success: true, role });
});

// NOTE: Legacy session debug logging removed. Using JWT now; to debug JWT add logs in auth middleware instead.

// Auth middleware for protected routes
const authCheck = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.role !== "mentor") {
    return res.status(403).json({ message: "Not authorized as mentor" });
  }
  next();
};

// API routes
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/students", studentRoutes);
// Mentor routes now use JWT-based middleware internally; remove legacy session authCheck
app.use("/api/mentors", mentorRoutes);
app.use("/api/assessments", assessmentRoutes);
// Sessions and messages should be available to both mentors and students;
// each route file performs its own fine-grained role checks.
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/messages", require("./routes/messages"));

// Start server
http.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("📡 Socket.IO server is running");
});
