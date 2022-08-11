import { API_ERROR_CODES } from '../api-error-codes';

describe("Api Error Codes", () => {
    it("Should format model validation error on field code", async () => {
        expect(API_ERROR_CODES.MODEL_VALIDATION_ERROR_ON_FIELD("body")).toBe("MODEL_VALIDATION_ERROR_ON_FIELD_BODY");
    });

    it("Should format entity not found code", async () => {
        expect(API_ERROR_CODES.ENTITY_NOT_FOUND("Article")).toBe("ARTICLE_NOT_FOUND");
    });
})