import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../error-handler/applicationError";
import {
  productSchema,
  multipleProductSchema,
} from "../validation/productValidation";

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = await productSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    req.body = validated;
    next();
  } catch (error: any) {
    // Handle Joi validation errors
    if (error.isJoi) {
      console.log('Validation error details:', error.details); // Debug log
      const errors = error.details.reduce((acc: Record<string, string[]>, detail: any) => {
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
};

const multipleValidateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = multipleProductSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.context?.key || "unknown",
        message: detail.message.replace(/['"]/g, ""),
      }));
      return next(
        new ApplicationError("Validation failed", 400, formattedErrors)
      );
    }
    next();
  } catch (err) {
    next(new ApplicationError("Validation error", 400));
  }
};

export {multipleValidateRequest};
