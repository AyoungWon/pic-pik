import { type ImageMetadata } from "src/utils/readImageMetadata";
import { calcResizeDimensions } from "./calcResizeDimensions";

/**
 * 사용자가 원하는 너비에 맞춰 비율을 유지하면서 이미지를 리사이즈합니다.
 */
interface AspectRatioWidth {
  mode: "aspectRatio";
  /** 리사이즈할 목표 너비 (픽셀 단위) */
  width: number;
}

/**
 * 사용자가 원하는 높이에 맞춰 비율을 유지하면서 이미지를 리사이즈합니다.
 */
interface AspectRatioHeight {
  mode: "aspectRatio";
  /** 리사이즈할 목표 높이 (픽셀 단위) */
  height: number;
}

/**
 * 사용자가 원하는 비율에 맞춰 이미지를 리사이즈합니다.
 * 1보다 큰 값은 이미지를 확대하고, 1보다 작은 값은 축소합니다.
 */
interface AspectRatioScale {
  mode: "aspectRatio";
  /** 리사이즈할 비율 (1.0은 100% 크기) */
  scale: number;
}

/**
 * 비율을 무시하고 지정된 너비와 높이로 이미지를 강제 리사이즈합니다.
 * 너비와 높이 중 하나는 반드시 지정해야 합니다.
 */
interface StretchResize {
  mode: "stretch";
  /** 리사이즈할 목표 너비 (픽셀 단위) */
  width?: number;
  /** 리사이즈할 목표 높이 (픽셀 단위) */
  height?: number;
}

/**
 * useImageResize 훅의 매개변수 타입.
 * 리사이즈 모드에 따라 이미지의 크기를 조정할 수 있습니다.
 */
export type ResizeOption =
  | AspectRatioWidth
  | AspectRatioHeight
  | AspectRatioScale
  | StretchResize;
/**
 * 주어진 이미지 메타데이터와 리사이즈 옵션에 따라 이미지를 리사이즈한 파일을 반환합니다.
 *
 * @param {ImageMetadata} metadata - 이미지의 메타데이터. 원본 이미지의 너비, 높이, 소스 등을 포함합니다.
 * @param {ResizeOption} option - 이미지 리사이즈 옵션. 비율을 유지하거나, 강제 리사이즈할 수 있는 옵션을 포함합니다.
 * @returns {Promise<File | null>} 리사이즈된 이미지 파일을 반환합니다. 오류 발생 시 null을 반환할 수 있습니다.
 *
 * @example
 * // 이미지 리사이즈 예제
 * getResizedImageFile(metadata, { mode: "aspectRatio", width: 1280 })
 *   .then(resizedFile => {
 *     // 리사이즈된 파일을 처리합니다.
 *   })
 *   .catch(error => {
 *     console.error("Failed to resize image", error);
 *   });
 */
export const getResizedImageFile = (
  metadata: ImageMetadata,
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

      const { targetWidth, targetHeight } = calcResizeDimensions(
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
            lastModified: Date.now(),
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

/**
 * 이미지 메타데이터와 리사이즈 옵션을 받아 이미지를 리사이즈하고, 최대 3번 시도합니다.
 *
 * @param {ImageMetadata} metadata - 이미지의 메타데이터. 원본 이미지의 너비, 높이, 소스 등을 포함합니다.
 * @param {ResizeOption} option - 이미지 리사이즈 옵션. 비율을 유지하거나, 강제 리사이즈할 수 있는 옵션을 포함합니다.
 * @returns {Promise<File | null>} 리사이즈된 이미지 파일을 반환합니다. 3번 시도 후에도 실패하면 null을 반환합니다.
 *
 * @example
 * // 이미지 리사이즈를 3번 시도하는 예제
 * resizeImage(metadata, { mode: "stretch", width: 1024, height: 768 })
 *   .then(resizedFile => {
 *     if (resizedFile) {
 *       console.log("Image resized successfully:", resizedFile);
 *     } else {
 *       console.error("Failed to resize image after 3 attempts.");
 *     }
 *   });
 */
export const resizeImage = async (
  metadata: ImageMetadata,
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
