const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Simple schema for demonstration
const User = mongoose.model('User', {
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

// Routes
app.get('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({
      message: 'Welcome to the Node.js API!',
      status: 'Server is running',
      database: 'Connected to MongoDB',
      totalUsers: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Welcome to the Node.js API!',
      status: 'Server is running',
      database: 'Error connecting to MongoDB',
      error: error.message
    });
  }
});

app.get('/home', async (req, res) => {
  try {
    // Get recent users from database
    const recentUsers = await User.find().limit(5).sort({ createdAt: -1 });
    
    res.json({
      message: 'Home Page',
      description: 'This is the home route of your Node.js application',
      recentUsers: recentUsers,
      features: [
        'MongoDB Integration',
        'Express.js Framework',
        'RESTful API',
        'Vercel Deployment Ready'
      ]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Home Page',
      error: 'Database error',
      details: error.message
    });
  }
});

// Bonus route to add a user (for testing)
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      user: user
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating user',
      error: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Export the app for Vercel
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}