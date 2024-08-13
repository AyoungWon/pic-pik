import { validateImageFile, type Limit } from "src/utils/validate";

export interface ImageMetadata {
  height: number;
  width: number;
  size: number;
  name: string;
  extension: string;
  src: string;
}

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
