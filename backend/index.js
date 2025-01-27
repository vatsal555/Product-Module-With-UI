"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes")); // Import product routes
const applicationError_1 = require("./error-handler/applicationError");
const logger_1 = __importDefault(require("./utils/logger"));
const rateLimiter_1 = __importDefault(require("./middleware/rateLimiter"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express_1.default.json());
app.use(rateLimiter_1.default);
// Connect to Database
(0, db_1.default)();
// Middleware to log all incoming requests
app.use((req, res, next) => {
    logger_1.default.info(`[${req.method}] ${req.originalUrl}`);
    next();
});
// Basic Route
app.get("/", (req, res) => {
    res.send("API is running...");
});
// Product Routes
app.use("/api/products", productRoutes_1.default);
// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
// Default 404 route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API not found. Please check our documentation for more information at https://documenter.getpostman.com/view/40407315/2sAYQcGWgc",
    });
});
// Application-level error handling middleware
app.use((err, req, res, next) => {
    logger_1.default.error(`Error: ${err.message}`);
    next(err);
});
app.use(applicationError_1.errorHandler);
