import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { API_ERROR_CODES } from "../../../constants/api-error-codes";
import { API_ERROR_MESSAGES } from "../../../constants/api-error-messages";
import { APIError } from "../../../errors/api-error";

export function mongooseValidationHandler(err: any, _req: Request, res: Response, next: NextFunction): void {
    if (err instanceof mongoose.Error.ValidationError) {
        const validationKeys = Object.keys(err.errors)
        const validationErrors =  validationKeys.map(vk => new APIError(API_ERROR_CODES.MODEL_VALIDATION_ERROR_ON_FIELD(vk), API_ERROR_MESSAGES.MODEL_VALIDATION_ERROR_ON_FIELD(vk, err.errors[vk].message)))
        res.status(400)
           .json(validationErrors);
        return;
    }

    next(err);
}