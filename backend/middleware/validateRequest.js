"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleValidateRequest = exports.validateRequest = void 0;
const applicationError_1 = require("../error-handler/applicationError");
const productValidation_1 = require("../validation/productValidation");
const validateRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = yield productValidation_1.productSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        req.body = validated;
        next();
    }
    catch (error) {
        // Handle Joi validation errors
        if (error.isJoi) {
            console.log('Validation error details:', error.details); // Debug log
            const errors = error.details.reduce((acc, detail) => {
                const key = detail.path.join('.');
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(detail.message);
                return acc;
            }, {});
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }
        // Log non-Joi errors
        console.error('Non-Joi validation error:', error);
        return res.status(400).json({
            success: false,
            message: error.message || "Validation error",
            errors: { general: [error.message || "Unknown validation error"] }
        });
    }
});
exports.validateRequest = validateRequest;
const multipleValidateRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = productValidation_1.multipleProductSchema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
        });
        if (error) {
            const formattedErrors = error.details.map((detail) => {
                var _a;
                return ({
                    field: ((_a = detail.context) === null || _a === void 0 ? void 0 : _a.key) || "unknown",
                    message: detail.message.replace(/['"]/g, ""),
                });
            });
            return next(new applicationError_1.ApplicationError("Validation failed", 400, formattedErrors));
        }
        next();
    }
    catch (err) {
        next(new applicationError_1.ApplicationError("Validation error", 400));
    }
});
exports.multipleValidateRequest = multipleValidateRequest;
