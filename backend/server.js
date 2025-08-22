const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS middleware to allow requests from anywhere
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/myapp",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Updated User schema with username and password
const User = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String, // Keep the old name field for backward compatibility
  createdAt: { type: Date, default: Date.now },
});

// Routes
app.get("/", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({
      message: "Welcome to the Node.js API!",
      status: "Server is running",
      database: "Connected to MongoDB",
      totalUsers: userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Welcome to the Node.js API!",
      status: "Server is running",
      database: "Error connecting to MongoDB",
      error: error.message,
    });
  }
});

app.get("/home", async (req, res) => {
  try {
    // Get recent users from database
    const recentUsers = await User.find()
      .limit(5)
      .sort({ createdAt: -1 })
      .select("-password");

    res.json({
      message: "Home Page",
      description: "This is the home route of your Node.js application",
      recentUsers: recentUsers,
      features: [
        "MongoDB Integration",
        "Express.js Framework",
        "RESTful API",
        "User Authentication",
        "Vercel Deployment Ready",
      ],
    });
  } catch (error) {
    res.status(500).json({
      message: "Home Page",
      error: "Database error",
      details: error.message,
    });
  }
});

// NEW: Signup route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "Username, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        error: "Username or email already taken",
      });
    }

    // Create new user
    const user = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password, // Note: In production, you should hash this password!
    });

    await user.save();

    // Return user data without password
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: "User already exists",
        error: `${field} already taken`,
      });
    }

    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

// NEW: Get all users route
app.get("/users", async (req, res) => {
  try {
    // Get all users but exclude passwords from the response
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      message: "Users retrieved successfully",
      count: users.length,
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users",
      error: error.message,
    });
  }
});

// Original route to add a user (for backward compatibility)
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Export the app for Vercel
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Available routes:`);
    console.log(`- GET  /          - Welcome message`);
    console.log(`- GET  /home      - Home page with recent users`);
    console.log(`- POST /signup    - User signup`);
    console.log(`- GET  /users     - Get all users`);
    console.log(`- POST /users     - Create user (legacy)`);
    console.log(`- GET  /health    - Health check`);
  });
}
