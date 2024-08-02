import { useEffect, useRef, useState } from "react";
import { validateImageFile, type ValidateOptions } from "../utils/validate";

interface Props {
  validateOptions?: ValidateOptions;
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
  validateOptions?: ValidateOptions
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
          size: Math.ceil(e.total / 1024),
          name: file.name,
          extension: (file.name.split(".").pop() ?? "").toLowerCase(),
          src: image.src,
        };

        if (validateOptions) {
          const validatePassed = validateImageFile(validateOptions, metaData);
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

const useImageMetadata = ({ validateOptions }: Props | undefined = {}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [imageMetadata, setImageMetadata] = useState<ImageFileMetadata | null>(
    null
  );

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const metaData = await readImageFileMetadata(file, validateOptions);
      setImageMetadata(metaData);
    }
  };

  useEffect(() => {
    const fileInput = ref.current;
    if (fileInput && !fileInput.dataset.listenerAdded) {
      // 이벤트 리스너 등록
      fileInput.addEventListener("change", handleFileChange);
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        fileInput.removeEventListener("change", handleFileChange);
      };
    }
  }, [ref.current]);

  return { ref, imageMetadata };
};

export default useImageMetadata;
