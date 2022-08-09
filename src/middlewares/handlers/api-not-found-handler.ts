import { NextFunction, Request, Response } from "express";
import { API_ERROR_CODES } from "../../constants/api-error-codes";
import { API_ERROR_MESSAGES } from "../../constants/api-error-messages";
import { APIError } from "../../errors/api-error";

export function apiNotFoundHandler(req: Request, res: Response, _next: NextFunction) {
    res.status(404)
       .json(new APIError(API_ERROR_CODES.API_NOT_FOUND, API_ERROR_MESSAGES.API_NOT_FOUND(req)));
}