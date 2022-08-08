export const APIErrorCodes = {
    API_NOT_FOUND: "API_NOT_FOUND",
    UNHANDLED_ERROR: "UNHANDLED_ERROR",
    ENTITY_NOT_FOUND: (className: string) => `${className}_NOT_FOUND`
} as const;