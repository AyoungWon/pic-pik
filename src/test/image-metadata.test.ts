import {
  type ImageMetadata,
  readImageMetadata,
} from "../utils/readImageMetadata";
import { describe, it, expect } from "vitest";
const base64Image =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/haljkcAAAAASUVORK5CYII=";

describe("readImageMetadata", () => {
  let mockFile: File;
  let mockImage: HTMLImageElement;
  const expectedMetadata: ImageMetadata = {
    height: 100,
    width: 100,
    size: 1024 * 1024,
    name: "example.png",
    extension: "png",
    src: `data:image/png;base64,${base64Image}`,
  };

  beforeEach(() => {
    // Base64 데이터를 디코딩하여 Blob으로 변환
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: `image/${expectedMetadata.extension}`,
    });
    mockFile = new File([blob], expectedMetadata.name, {
      type: `image/${expectedMetadata.extension}`,
    });

    Object.defineProperty(mockFile, "size", {
      value: expectedMetadata.size,
      writable: false,
    }); // 1MB 크기 설정

    // Mocking the Image object and triggering onload manually
    mockImage = new Image();

    mockImage.addEventListener("load", () => {
      mockImage.width = expectedMetadata.width;
      mockImage.height = expectedMetadata.height;
    });

    mockImage.src = expectedMetadata.src;

    // global Image를 mockImage로 대체
    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;

    // 수동으로 load 이벤트 트리거
    setTimeout(() => {
      mockImage.dispatchEvent(new Event("load"));
    }, 100);
  });

  it("should return correct metadata for a valid image file", async () => {
    const result = await readImageMetadata(mockFile);
    expect(result).toEqual(expectedMetadata);
  });

  it("should return null if validation fails due to file size", async () => {
    const result = await readImageMetadata(mockFile, { size: 10 }); // 100 KB max size
    expect(result).toBeNull();
  });

  it("should return null if validation fails due to file width", async () => {
    const result = await readImageMetadata(mockFile, { width: 50 }); // width 50px 제한
    expect(result).toBeNull();
  });

  it("should return null if validation fails due to file height", async () => {
    const result = await readImageMetadata(mockFile, { height: 50 }); // height 50px 제한
    expect(result).toBeNull();
  });
});
