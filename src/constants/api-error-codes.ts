import { EntityName } from "../types";

export const API_ERROR_CODES = {
    API_NOT_FOUND: "API_NOT_FOUND",
    MODEL_VALIDATION_ERROR_ON_FIELD: (propertyName: string) => `MODEL_VALIDATION_ERROR_ON_FIELD_${propertyName.toUpperCase()}`,
    UNHANDLED_ERROR: "UNHANDLED_ERROR",
    ENTITY_NOT_FOUND: (className: EntityName) => `${className.toUpperCase()}_NOT_FOUND`
} as const;