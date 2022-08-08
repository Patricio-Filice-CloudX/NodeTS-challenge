import { HttpStatusCode } from "../types";

export class BusinessError extends Error {
    code: string;
    httpStatusCode: HttpStatusCode;

    constructor(message: string, code: string, httpStatusCode: HttpStatusCode) {
        super(message)
        this.code = code;
        this.httpStatusCode = httpStatusCode;
    }
}