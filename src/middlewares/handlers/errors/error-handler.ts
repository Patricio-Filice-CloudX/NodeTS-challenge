import { NextFunction, Request, Response } from "express";
import { API_ERROR_CODES } from "../../../constants/api-error-codes";
import { API_ERROR_MESSAGES } from "../../../constants/api-error-messages";
import { APIError } from "../../../errors/api-error";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
    console.log(`Unhandled error: ${err}`);
    res.status(500)
       .json([new APIError(API_ERROR_CODES.UNHANDLED_ERROR, API_ERROR_MESSAGES.UNHANDLED_ERROR)]);
}