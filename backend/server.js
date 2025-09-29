const express = require("express");
require("dotenv").config();

const connectDB = require("./config/database");
const corsMiddleware = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");


const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const personRoutes = require("./routes/personRoutes");

const { logRoutes } = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(corsMiddleware);

connectDB();

app.use("/", userRoutes);
app.use("/", taskRoutes);
app.use("/", personRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logRoutes();
  });
}