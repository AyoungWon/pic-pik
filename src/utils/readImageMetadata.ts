import { validateImageFile, type Limit } from "src/utils/validate";

/**
 * @interface ImageMetadata
 * 이미지 파일의 메타데이터를 나타냅니다.
 * @property {number} height - 이미지의 높이 (픽셀 단위).
 * @property {number} width - 이미지의 너비 (픽셀 단위).
 * @property {number} size - 이미지 파일의 크기 (바이트 단위).
 * @property {string} name - 이미지 파일의 이름.
 * @property {string} extension - 이미지 파일의 확장자.
 * @property {string} src - 이미지 파일의 데이터 URL.
 */
export interface ImageMetadata {
  height: number;
  width: number;
  size: number;
  name: string;
  extension: string;
  src: string;
}

/**
 * 이미지 파일의 메타데이터를 읽고, 주어진 제한 조건(Limit)에 따라 유효성을 검사합니다.
 *
 * @param {File} file - 읽을 이미지 파일입니다.
 * @param {Limit} [limit] - 선택적 제한 조건 객체로, 이미지의 너비, 높이, 크기 등을 제한할 수 있습니다.
 *
 * @returns {Promise<ImageMetadata | null>} 이미지 메타데이터를 반환하는 Promise를 반환합니다.
 * 유효성 검사를 통과하지 못하면 null을 반환합니다.
 *
 * @example
 * const file = document.querySelector('input[type="file"]').files[0];
 * const limit = { width: 1000, height: 800, size: 5000000 };
 *
 * readImageMetadata(file, limit)
 *   .then(metaData => {
 *     if (metaData) {
 *       console.log('Image metadata:', metaData);
 *     } else {
 *       console.log('Image did not meet the validation criteria.');
 *     }
 *   });
 */
export const readImageMetadata = (
  file: File,
  limit?: Limit
): Promise<ImageMetadata | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const readerTarget = e.target as FileReader;
      const image = new Image();
      image.src = readerTarget.result as string;

      image.onload = () => {
        const metaData: ImageMetadata = {
          height: image.height,
          width: image.width,
          size: file.size,
          name: file.name,
          extension: (file.name.split(".").pop() ?? "").toLowerCase(),
          src: image.src,
        };

        if (limit) {
          const validatePassed = validateImageFile(limit, metaData);
          if (!validatePassed) return resolve(null);
        }
        resolve(metaData);
      };

      image.onerror = () => resolve(null);
    };

    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};
