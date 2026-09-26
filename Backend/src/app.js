require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const jobRoutes =
  require("./routes/job.routes");

const resumeRoutes =
  require("./routes/resume.routes");

const candidateRoutes =
  require("./routes/candidate.routes");

const app = express();

/*
 * Connect MongoDB
 */
connectDB();

/*
 * Security
 */
app.use(helmet());

app.use(
  cors({
    origin: "*",
  })
);

/*
 * Rate limiting
 */
const limiter =
  rateLimit({
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
app.use(
  "/uploads",
  express.static("uploads")
);

/*
 * Health check
 */
app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "SmartHire backend is running",
    });
  }
);

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      backend:
        "Node.js + Express",
      status:
        "running",
      timestamp:
        new Date().toISOString(),
    });
  }
);

/*
 * Person 1 routes
 */
app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/resumes",
  resumeRoutes
);

app.use(
  "/api/candidates",
  candidateRoutes
);

/*
 * 404 handler
 */
app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `Route ${req.method} ${req.originalUrl} not found`,
    });
  }
);

/*
 * Global error handler
 */
app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);

/*
 * Start server
 */
const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `SmartHire backend running on port ${PORT}`
    );

    console.log(
      `FastAPI URL: ${process.env.FASTAPI_URL}`
    );
  }
);