import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes"; // Import product routes
import { errorHandler } from "./error-handler/applicationError";
import logger from "./utils/logger";
import apiLimiter from "./middleware/rateLimiter";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(apiLimiter);

// Connect to Database
connectDB();

// Middleware to log all incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Basic Route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Product Routes
app.use("/api/products", productRoutes);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Default 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "API not found. Please check our documentation for more information at https://documenter.getpostman.com/view/40407315/2sAYQcGWgc",
  });
});

// Application-level error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  next(err);
});

app.use(errorHandler);
