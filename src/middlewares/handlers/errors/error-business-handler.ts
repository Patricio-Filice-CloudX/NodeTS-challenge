import { NextFunction, Request, Response } from "express";
import { APIError } from "../../../errors/api-error";
import { BusinessError } from "../../../errors/business-error";

export function errorBusinessHandler(err: any, _req: Request, res: Response, next: NextFunction): void {
    if (err instanceof BusinessError) {
        res.status(err.httpStatusCode)
           .json([new APIError(err.code, err.message)]);
        return;
    }

    next(err);
}