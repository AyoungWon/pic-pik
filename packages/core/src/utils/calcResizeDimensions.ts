import { type ResizeOption } from "./resizeImage";

/**
 * @typedef {Object} ResizeDimensions
 * @property {number} targetWidth - 리사이즈 후 계산된 너비.
 * @property {number} targetHeight - 리사이즈 후 계산된 높이.
 */
export interface ResizeDimensions {
  targetWidth: number;
  targetHeight: number;
}

/**
 * 주어진 리사이즈 옵션에 따라 이미지의 목표 크기를 계산합니다.
 *
 * @param {number} imgWidth - 원본 이미지의 너비 (픽셀 단위).
 * @param {number} imgHeight - 원본 이미지의 높이 (픽셀 단위).
 * @param {ResizeOption} option - 리사이즈 옵션을 지정하는 객체. 사용자가 원하는 리사이즈 모드 및 크기 정보를 포함합니다.
 *
 * @returns {ResizeDimensions} 리사이즈 후의 계산된 목표 너비와 높이를 포함한 객체.
 *
 * @example
 * // 비율 유지하면서 너비에 맞춰 리사이즈
 * const dimensions = calcResizeDimensions(1920, 1080, { mode: "aspectRatio", width: 1280 });
 * console.log(dimensions); // { targetWidth: 1280, targetHeight: 720 }
 *
 * @example
 * // 비율 유지하면서 높이에 맞춰 리사이즈
 * const dimensions = calcResizeDimensions(1920, 1080, { mode: "aspectRatio", height: 720 });
 * console.log(dimensions); // { targetWidth: 1280, targetHeight: 720 }
 *
 * @example
 * // 비율을 무시하고 강제 리사이즈
 * const dimensions = calcResizeDimensions(1920, 1080, { mode: "stretch", width: 1024, height: 768 });
 * console.log(dimensions); // { targetWidth: 1024, targetHeight: 768 }
 */
export const calcResizeDimensions = (
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
