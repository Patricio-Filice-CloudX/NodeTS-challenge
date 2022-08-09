import { EntityName } from "../types";

export const API_ERROR_MESSAGES = {
    API_NOT_FOUND: (req: { method: string, url: string }) => `Couldn't found API verb: ${req.method} - url: ${req.url}`,
    MODEL_VALIDATION_ERROR_ON_FIELD: (propertyName: string, error: string) => `Field ${propertyName}: ${error}`,
    UNHANDLED_ERROR: "An error ocurred while running the requested operation. Please try again later.",
    ENTITY_NOT_FOUND: (entityName: EntityName) => `Couldn't found entity ${entityName.toLocaleLowerCase()}`
} as const;