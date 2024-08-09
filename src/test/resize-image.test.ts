import { describe, it, expect, vi, beforeEach } from "vitest";
import { resizeImage } from "../utils/resizeImage";
import { ImageMetadata } from "../utils/readImageMetadata";
import { createCanvas, Image as CanvasImage } from "canvas";

const base64Image =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/haljkcAAAAASUVORK5CYII=";

describe("resizeImage", () => {
  let originalMetadata: ImageMetadata;
  let mockImage: CanvasImage;

  beforeEach(() => {
    originalMetadata = {
      height: 1,
      width: 1,
      size: 1024 * 1024,
      name: "example.png",
      extension: "png",
      src: `data:image/png;base64,${base64Image}`,
    };

    // HTMLCanvasElement의 getContext 메서드를 오버라이드하여 node-canvas 모듈 사용
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    //@ts-ignore
    HTMLCanvasElement.prototype.getContext = function (
      contextId: "2d" | "bitmaprenderer" | "webgl" | "webgl2",
      options?: any
    ) {
      if (contextId === "2d") {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");

        // drawImage 메서드를 모킹합니다.
        ctx.drawImage = vi.fn((image: any, ...args: any[]) => {
          // 기본적인 drawImage 기능을 모킹합니다.
        });

        return ctx;
      }
      return originalGetContext.call(this, contextId, options);
    };

    // Image 클래스를 모킹하여 JSDOM의 HTMLImageElement로 캐스팅
    mockImage = new CanvasImage();

    // canvas.toBlob 메서드를 모킹합니다.
    HTMLCanvasElement.prototype.toBlob = function (
      callback: BlobCallback,
      type?: string
    ) {
      const blob = new Blob(["mocked blob data"], {
        type: type || "image/png",
      });
      callback(blob);
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof global.Image;

    setTimeout(() => {
      // 이미지가 로드되었음을 수동으로 시뮬레이션
      mockImage.width = 2; // 리사이즈된 가상 크기
      mockImage.height = 2;
      if (mockImage.onload) {
        mockImage.onload(); // 인자를 전달하지 않음
      }
    }, 0);
  });

  afterEach(() => {
    // 테스트 후 원래 설정으로 복원
    vi.restoreAllMocks();
  });

  it("should return correct file after resizing scale", async () => {
    const result = await resizeImage(originalMetadata, {
      mode: "aspectRatio",
      scale: 2,
    });

    expect(result).not.toBeNull();
    if (result) {
      expect(result.name).toBe("example.png");
      expect(result.size).toBeGreaterThan(0);
    }
  });

  it("should return correct file after resizing width", async () => {
    const result = await resizeImage(originalMetadata, {
      mode: "aspectRatio",
      width: 200,
    });

    expect(result).not.toBeNull();
    if (result) {
      expect(result.name).toBe("example.png");
      expect(result.size).toBeGreaterThan(0);
    }
  });

  it("should return correct file after resizing height", async () => {
    const result = await resizeImage(originalMetadata, {
      mode: "aspectRatio",
      height: 100,
    });

    expect(result).not.toBeNull();
    if (result) {
      expect(result.name).toBe("example.png");
      expect(result.size).toBeGreaterThan(0);
    }
  });

  it("should return correct file after resizing by stretch", async () => {
    const result = await resizeImage(originalMetadata, {
      mode: "stretch",
      height: 100,
    });

    expect(result).not.toBeNull();
    if (result) {
      expect(result.name).toBe("example.png");
      expect(result.size).toBeGreaterThan(0);
    }
  });
});

//todo width, height을 테스트하는 코드로 변경 예정
