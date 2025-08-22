const express = require("express");
require("dotenv").config();

// Import configuration and middleware
const connectDB = require("./config/database");
const corsMiddleware = require("./middleware/cors");

// Import routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Import utilities
const { logRoutes } = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Connect to database
connectDB();

// Routes
app.use("/", userRoutes);
app.use("/", taskRoutes);

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
    logRoutes();
  });
}