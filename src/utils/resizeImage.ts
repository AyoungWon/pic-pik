import { ImageFileMetadata } from "./readImageMetadata";

interface AspectRatioWidth {
  mode: "aspectRatio";
  width: number;
}

interface AspectRatioHeight {
  mode: "aspectRatio";
  height: number;
}

interface AspectRatioScale {
  mode: "aspectRatio";
  scale: number;
}

interface StretchResize {
  mode: "stretch";
  width?: number; // width와 height 중 하나는 반드시 있어야 함
  height?: number;
}

export type ResizeOption =
  | AspectRatioWidth
  | AspectRatioHeight
  | AspectRatioScale
  | StretchResize;

interface ResizeDimensions {
  targetWidth: number;
  targetHeight: number;
}

const calculateResizeDimensions = (
  imgWidth: number,
  imgHeight: number,
  option: ResizeOption
): ResizeDimensions => {
  let targetWidth: number = imgWidth; // 초기값 설정
  let targetHeight: number = imgHeight; // 초기값 설정

  const { mode } = option;

  switch (mode) {
    case "aspectRatio":
      if ("width" in option) {
        targetWidth = option.width;
        targetHeight = (imgHeight / imgWidth) * targetWidth;
      } else if ("height" in option) {
        targetHeight = option.height;
        targetWidth = (imgWidth / imgHeight) * targetHeight;
      } else if ("scale" in option) {
        targetWidth = imgWidth * option.scale;
        targetHeight = imgHeight * option.scale;
      }
      break;

    case "stretch":
      targetWidth = option.width || imgWidth;
      targetHeight = option.height || imgHeight;
      break;

    default:
      // 기본값으로 초기화된 상태를 유지
      break;
  }

  return { targetWidth, targetHeight };
};

export const getResizedImageFile = (
  metadata: ImageFileMetadata,
  option: ResizeOption
): Promise<File | null> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = metadata.src; // src에서 이미지를 로드

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      const { targetWidth, targetHeight } = calculateResizeDimensions(
        metadata.width,
        metadata.height,
        option
      );

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob((resizedBlob) => {
        if (resizedBlob) {
          const resizedFile = new File([resizedBlob], metadata.name, {
            type: `image/${metadata.extension}`,
            lastModified: Date.now(), // 원본 파일의 마지막 수정 시간을 유지할 수 없는 경우
          });
          resolve(resizedFile);
        } else {
          reject(new Error("Failed to create Blob from canvas"));
        }
      }, `image/${metadata.extension}`);
    };

    img.onerror = () => {
      reject(new Error("Image failed to load"));
    };
  });

export const resizeImage = async (
  metadata: ImageFileMetadata,
  option: ResizeOption
) => {
  let attempt = 0;
  let result: File | null = null;

  // attempt를 인자로 받을까?
  while (attempt < 3 && !result) {
    try {
      result = await getResizedImageFile(metadata, option);
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed. Retrying...`, error);
    }
    attempt++;
  }

  if (result) {
    return result;
  } else {
    console.error("Failed to resize image after 3 attempts.");
    return null; // 명시적으로 null 반환
  }
};
