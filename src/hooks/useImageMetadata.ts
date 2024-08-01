import { useEffect, useRef, useState } from "react";
import { validateImageFile, type ValidateOptions } from "../utils/validate";

//todo validate 추가하기
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

const useImageMetadata = ({ validateOptions }: Props | undefined = {}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [imageMetadata, setImageMetadata] = useState<ImageFileMetadata | null>(
    null
  );
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const reader = new FileReader();

    reader.onload = (e) => {
      const readerTarget = e.target as FileReader;
      const image = new Image();
      image.src = readerTarget.result as string;
      image.onload = () => {
        const { height, width } = image;
        const totalSizeKB = Math.ceil(e.total / 1024);
        const fileName = target.files?.[0].name ?? "";
        const fileExtension = (fileName.split(".").pop() ?? "").toLowerCase();
        const metaData = {
          height,
          width,
          size: totalSizeKB,
          name: fileName,
          extension: fileExtension,
          src: image.src,
        };
        if (validateOptions) {
          const validatePassed = validateImageFile(validateOptions, metaData);
          if (!validatePassed) return false;
        }
        setImageMetadata(metaData);
      };
    };

    if (target.files && target.files[0]) reader.readAsDataURL(target.files[0]);
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
