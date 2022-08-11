import { API_ERROR_MESSAGES } from '../api-error-messages';

describe("Api Error Messages", () => {
    it("Should format api not found message", async () => {
        expect(API_ERROR_MESSAGES.API_NOT_FOUND({ method: "POST", url: "/articles" })).toBe("Couldn't found API verb: POST - url: /articles");
    });

    it("Should format model validation error on field message", async () => {
        expect(API_ERROR_MESSAGES.MODEL_VALIDATION_ERROR_ON_FIELD("body", "some error")).toBe("Field body: some error");
    });

    it("Should format entity not found message", async () => {
        expect(API_ERROR_MESSAGES.ENTITY_NOT_FOUND("Article")).toBe("Couldn't found entity article");
    });
})