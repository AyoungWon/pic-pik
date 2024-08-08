import { checkFileType } from "../hooks/useImageFile";

describe("checkFileType", () => {
  it("should return true if the input type is file", () => {
    // Create a mock input element with type "file"
    const mockInput = { type: "file" } as HTMLInputElement;
    const result = checkFileType(mockInput);
    expect(result).toBe(true);
  });

  it("should return false and log an error if the input type is not file", () => {
    // Create a mock input element with a different type
    const mockInput = { type: "text" } as HTMLInputElement;
    const result = checkFileType(mockInput);
    expect(result).toBe(false);
  });
});
