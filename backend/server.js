const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/database");
const corsMiddleware = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");


const personRoutes = require("./routes/personRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(express.json());
app.use(corsMiddleware);

connectDB();

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
  });
}