const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Import task controller
const { taskController } = require("./task");

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

// =================== USER ROUTES ===================

app.get("/", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({
      message: "Welcome to the Node.js API!",
      status: "Server is running",
      database: "Connected to MongoDB",
      totalUsers: userCount,
      timestamp: new Date().toISOString(),
      endpoints: {
        users: [
          "GET /users - Get all users",
          "POST /signup - Create user",
          "POST /users - Create user (legacy)",
        ],
        tasks: [
          "GET /tasks - Get all tasks",
          "POST /tasks - Create task",
          "GET /tasks/:id - Get task by ID",
          "PUT /tasks/:id - Update task",
          "DELETE /tasks/:id - Delete task",
          "GET /tasks/stats/:userId - Get user task stats",
        ],
      },
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
        "Task Management CRUD",
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

// Signup route
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

// Get all users route
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

// =================== TASK ROUTES ===================

// CREATE - Add a new task
app.post("/tasks", taskController.createTask);

// READ - Get all tasks (with optional filtering)
app.get("/tasks", taskController.getTasks);

// READ - Get a single task by ID
app.get("/tasks/:id", taskController.getTaskById);

// UPDATE - Update a task by ID
app.put("/tasks/:id", taskController.updateTask);

// DELETE - Delete a task by ID
app.delete("/tasks/:id", taskController.deleteTask);

// UTILITY - Get user's task statistics
app.get("/tasks/stats/:userId", taskController.getTaskStats);

// =================== UTILITY ROUTES ===================

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
    console.log(`\n=== USER ROUTES ===`);
    console.log(`- GET  /              - Welcome message & API info`);
    console.log(`- GET  /home          - Home page with recent users`);
    console.log(`- POST /signup        - User signup`);
    console.log(`- GET  /users         - Get all users`);
    console.log(`- POST /users         - Create user (legacy)`);
    console.log(`\n=== TASK ROUTES ===`);
    console.log(`- POST   /tasks           - Create new task`);
    console.log(`- GET    /tasks           - Get all tasks`);
    console.log(`- GET    /tasks/:id       - Get task by ID`);
    console.log(`- PUT    /tasks/:id       - Update task`);
    console.log(`- DELETE /tasks/:id       - Delete task`);
    console.log(`- GET    /tasks/stats/:userId - Get user task statistics`);
    console.log(`\n=== UTILITY ROUTES ===`);
    console.log(`- GET  /health        - Health check`);
  });
}
