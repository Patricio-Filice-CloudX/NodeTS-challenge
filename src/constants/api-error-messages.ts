export const APIErrorMessages = {
    API_NOT_FOUND: (req: { method: string, url: string }) => `Couldn't found API verb: ${req.method} - url: ${req.url}`,
    UNHANDLED_ERROR: "An error ocurred while running the requested operation. Please try again later.",
    ENTITY_NOT_FOUND: (className: string) => `Couldn't found entity ${className}`
} as const;