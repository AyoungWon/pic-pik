import {
  type ImageFileMetadata,
  readImageFileMetadata,
} from "../hooks/useImageMetadata";

describe("readImageFileMetadata", () => {
  const mockFile = new File(["dummy content"], "example.png", {
    type: "image/png",
  });

  it("should return correct metadata for a valid image file", async () => {
    const fileReaderMock = {
      readAsDataURL: jest.fn(),
      onload: jest.fn(),
    };

    global.FileReader = jest.fn(
      () => fileReaderMock as unknown as FileReader
    ) as unknown as typeof FileReader;
    Object.assign(global.FileReader, {
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
    });

    fileReaderMock.readAsDataURL.mockImplementation(() => {
      const event = {
        target: { result: "data:image/png;base64,dummy content" },
        total: 1024,
      } as ProgressEvent<FileReader>;
      fileReaderMock.onload?.(event);
    });

    const imageMock = {
      height: 100,
      width: 200,
      onload: jest.fn(),
    };

    global.Image = jest.fn(
      () => imageMock as unknown as HTMLImageElement
    ) as unknown as jest.Mock;

    setTimeout(() => {
      imageMock.onload?.();
    }, 0);

    const expectedMetadata: ImageFileMetadata = {
      height: 100,
      width: 200,
      size: 1,
      name: "example.png",
      extension: "png",
      src: "data:image/png;base64,dummy content",
    };

    const result = await readImageFileMetadata(mockFile);
    expect(result).toEqual(expectedMetadata);
  });
});
