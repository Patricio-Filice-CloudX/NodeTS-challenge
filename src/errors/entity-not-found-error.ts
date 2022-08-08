import { APIErrorCodes } from "../constants/api-error-codes";
import { APIErrorMessages } from "../constants/api-error-messages";
import { BusinessError } from "./business-error";

export class EntityNotFoundError extends BusinessError {
    constructor(className: string) {
        super(APIErrorMessages.ENTITY_NOT_FOUND(className), APIErrorCodes.ENTITY_NOT_FOUND(typeof(className)), 404);
    }
} 