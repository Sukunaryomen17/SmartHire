require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Person 1 routes
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Person 2 routes
const testRoutes = require("./routes/test.routes");
const interviewRoutes = require("./routes/interview.routes");
const evaluationRoutes = require("./routes/evaluation.routes");

const app = express();

/*
 * Security
 */
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

/*
 * Rate limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

/*
 * Body parsing
 */
app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

/*
 * Static uploaded files
 */
app.use("/uploads", express.static("uploads"));

/*
 * Health check
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartHire backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    backend: "Node.js + Express",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

/*
 * Person 1 routes
 */
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/candidates", candidateRoutes);

/*
 * Person 2 routes
 */
app.use("/api/tests", testRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/evaluations", evaluationRoutes);

/*
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/*
 * Global error handler
 */
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;