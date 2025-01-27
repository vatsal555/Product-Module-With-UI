"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApplicationError = void 0;
// Custom Error Class
class ApplicationError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.ApplicationError = ApplicationError;
// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message,
            details: err.details || null,
            statusCode: statusCode,
        },
    });
};
exports.errorHandler = errorHandler;
