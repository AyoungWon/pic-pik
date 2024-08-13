import { checkFileType } from "src/hooks/useImage";

describe("checkFileType", () => {
  it("should return true if the input type is file", () => {
    const mockInput = { type: "file" } as HTMLInputElement;
    const result = checkFileType(mockInput);

    cy.wrap(result).should("be.true");
  });

  it("should return false and log an error if the input type is not file", () => {
    const mockInput = { type: "text" } as HTMLInputElement;
    const result = checkFileType(mockInput);

    cy.wrap(result).should("be.false");
  });
});
