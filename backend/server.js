import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import logger from "./config/logger.js";
import { apiLogger, errorLogger } from "./middlewares/logger.js";

import userRoutes from "./routes/userRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import aiRoutes from "./ai/routes/aiRoutes.js";
import chatbotRoutes from "./ai/routes/chatbotRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";

// Import and validate AI config
import { validateAIConfig } from "./ai/config/aiConfig.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
  })
);

// TODO: Add IP whitelist
// app.use(ipWhitelist());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("combined", { stream: logger.stream }));
app.use(apiLogger);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/users", userRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", chatbotRoutes);

app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/finance-minister",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    logger.info("Connected to MongoDB");

    // Validate AI configuration
    const aiConfigured = validateAIConfig();
    if (aiConfigured) {
      logger.info("✅ AI features are enabled");
    } else {
      logger.warn("⚠️  AI features are disabled (no API key configured)");
    }
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Documentation: http://localhost:${PORT}/api`);
});

export default app;
