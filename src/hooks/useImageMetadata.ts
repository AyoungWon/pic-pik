import { useEffect, useState } from "react";
import { validateImageFile, type Limit } from "../utils/validate";

interface Props {
  limit?: Limit;
  file?: File;
}

export interface ImageFileMetadata {
  height: number;
  width: number;
  size: number;
  name: string;
  extension: string;
  src: string;
}

export const readImageFileMetadata = (
  file: File,
  limit?: Limit
): Promise<ImageFileMetadata | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const readerTarget = e.target as FileReader;
      const image = new Image();
      image.src = readerTarget.result as string;

      image.onload = () => {
        const metaData: ImageFileMetadata = {
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

const useImageMetadata = ({ limit, file }: Props | undefined = {}) => {
  const [imageMetadata, setImageMetadata] = useState<ImageFileMetadata | null>(
    null
  );

  const handleFileChange = async (file: File) => {
    const metaData = await readImageFileMetadata(file, limit);
    setImageMetadata(metaData);
  };

  useEffect(() => {
    if (file) handleFileChange(file);
  }, [file]);

  return { imageMetadata };
};

export default useImageMetadata;
