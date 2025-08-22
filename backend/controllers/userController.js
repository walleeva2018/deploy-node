const User = require("../models/User");

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
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
  },

  // Create user (legacy)
  createUser: async (req, res) => {
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
  },

  // Sign up
  signup: async (req, res) => {
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
  },

  // Sign in
  signin: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Basic validation
      if (!username || !password) {
        return res.status(400).json({
          message: "Missing required fields",
          error: "Username and password are required",
        });
      }

      // Find user by username or email
      const user = await User.findOne({
        $or: [
          { username: username.trim() },
          { email: username.trim().toLowerCase() }
        ]
      });

      if (!user) {
        return res.status(401).json({
          message: "Authentication failed",
          error: "Invalid username or password",
        });
      }

      // Verify password (in production, you would compare hashed passwords)
      if (user.password !== password) {
        return res.status(401).json({
          message: "Authentication failed",
          error: "Invalid username or password",
        });
      }

      // Return user data without password
      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };

      res.json({
        message: "Sign in successful",
        user: userResponse,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error during sign in",
        error: error.message,
      });
    }
  },

  // Home page
  getHome: async (req, res) => {
    try {
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
  },

  // Welcome message
  getWelcome: async (req, res) => {
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
            "POST /signin - Sign in user",
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
  }
};

module.exports = { userController };