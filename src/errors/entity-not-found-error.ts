import { API_ERROR_CODES } from "../constants/api-error-codes";
import { API_ERROR_MESSAGES } from "../constants/api-error-messages";
import { EntityName } from "../types";
import { BusinessError } from "./business-error";

export class EntityNotFoundError extends BusinessError {
    constructor(entityName: EntityName) {
        super(API_ERROR_MESSAGES.ENTITY_NOT_FOUND(entityName), API_ERROR_CODES.ENTITY_NOT_FOUND(entityName), 404);
    }
} 