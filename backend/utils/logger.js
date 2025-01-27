"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, errors, colorize } = winston_1.format;
// format for logs
const customFormat = printf(({ level, message, timestamp, stack, module }) => {
    return `${timestamp} [${level.toUpperCase()}] [${module || "General"}]: ${stack || message}`;
});
// Create Winston logger
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), customFormat),
    transports: [
        // Console log transport with colors
        new winston_1.transports.Console({
            format: combine(colorize(), customFormat),
        }),
        // Dynamic log file path (optional)
        new winston_1.transports.File({
            filename: process.env.NODE_ENV === "production"
                ? "logs/application.log"
                : "logs/dev-application.log",
            level: "info",
        }),
        // Error-specific file logging
        new winston_1.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});
exports.default = logger;
