import {
  type ImageFileMetadata,
  readImageFileMetadata,
} from "../hooks/useImage";

const defaultEvent = {
  target: { result: "data:image/png;base64,dummy content" },
} as ProgressEvent<FileReader>;

describe("readImageFileMetadata", () => {
  let fileReaderMock: any;
  let imageMock: any;

  const mockFile = new File(["dummy content"], "example.png", {
    type: "image/png",
  });

  Object.defineProperty(mockFile, "size", {
    value: 1024 * 1024,
    writable: false,
  }); // 1MB 크기 설정

  beforeEach(() => {
    // Mocking FileReader
    fileReaderMock = {
      readAsDataURL: vi.fn(),
      onload: vi.fn(() => console.log("fileReaderMock.onload called")),
    };

    global.FileReader = vi.fn(
      () => fileReaderMock as unknown as FileReader
    ) as unknown as typeof FileReader;

    Object.assign(global.FileReader, {
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
    });

    // Mocking Image
    imageMock = {
      height: 100,
      width: 200,
      onload: vi.fn(() => console.log("imageMock.onload called")),
    };

    global.Image = vi.fn(() => imageMock) as unknown as new (
      width?: number,
      height?: number
    ) => HTMLImageElement;
  });

  it("should return correct metadata for a valid image file", async () => {
    fileReaderMock.readAsDataURL.mockImplementation(() => {
      const event = defaultEvent;
      fileReaderMock.onload?.(event);
    });

    setTimeout(() => {
      imageMock.onload?.();
    }, 0);

    const expectedMetadata: ImageFileMetadata = {
      height: 100,
      width: 200,
      size: 1024 * 1024,
      name: "example.png",
      extension: "png",
      src: "data:image/png;base64,dummy content",
    };

    const result = await readImageFileMetadata(mockFile);
    expect(result).toEqual(expectedMetadata);
  });

  it("should return null if validation fails due to file size", async () => {
    fileReaderMock.readAsDataURL.mockImplementation(() => {
      const event = defaultEvent;
      fileReaderMock.onload?.(event);
    });

    setTimeout(() => {
      imageMock.onload?.();
    }, 0);

    const result = await readImageFileMetadata(mockFile, { size: 10 }); // 100 KB max size
    expect(result).toBeNull();
  });

  it("should return null if validation fails due to file width", async () => {
    fileReaderMock.readAsDataURL.mockImplementation(() => {
      const event = defaultEvent;
      fileReaderMock.onload?.(event);
    });

    setTimeout(() => {
      imageMock.onload?.();
    }, 0);

    const result = await readImageFileMetadata(mockFile, { width: 100 }); // width 100px 제한
    expect(result).toBeNull();
  });

  it("should return null if validation fails due to file height", async () => {
    fileReaderMock.readAsDataURL.mockImplementation(() => {
      const event = defaultEvent;
      fileReaderMock.onload?.(event);
    });

    setTimeout(() => {
      imageMock.onload?.();
    }, 0);

    const result = await readImageFileMetadata(mockFile, { height: 50 }); // height 50px 제한
    expect(result).toBeNull();
  });
});

//todo onError함수 실행했는지 체크하는 테스트 코드 추가
